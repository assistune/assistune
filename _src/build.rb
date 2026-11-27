# encoding: UTF-8
#
# Assistune static site builder.
#
# Zero dependencies: Ruby stdlib only (ERB + YAML). Reads templates from _src/
# and writes plain HTML into the repo root, which GitHub Pages serves as-is.
# Folders starting with "_" are not published by GitHub Pages (Jekyll).
#
#   ruby -E UTF-8:UTF-8 _src/build.rb
#
require 'erb'
require 'yaml'
require 'json'
require 'date'
require 'fileutils'

Encoding.default_external = Encoding::UTF_8
Encoding.default_internal = Encoding::UTF_8

SRC  = File.expand_path(__dir__)
ROOT = File.expand_path('..', SRC)
SITE = 'https://assistune.com'.freeze

require 'digest'
# Cache-busting query for style.css / script.js.
ASSET_VERSION = Digest::SHA1.hexdigest(%w[style.css script.js].map { |f| File.read(File.join(ROOT, f)) }.join)[0, 8]

# ---------------------------------------------------------------- helpers ---

module Helpers
  def h(s)
    s.to_s.gsub('&', '&amp;').gsub('<', '&lt;').gsub('>', '&gt;').gsub('"', '&quot;').gsub("'", '&#39;')
  end

  def abs(path)
    SITE + path
  end

  def partial(name, locals = {})
    render_erb(File.join(SRC, 'partials', "#{name}.html.erb"), locals)
  end

  def render_erb(file, locals = {})
    tpl = ERB.new(File.read(file), trim_mode: '-')
    ctx = RenderContext.new(locals.merge(site: @site || {}, page: @page || {}))
    tpl.result(ctx.instance_eval { binding })
  end

  def json_ld(obj)
    %(<script type="application/ld+json">#{JSON.generate(obj).gsub('</', '<\/')}</script>)
  end

  # "İlgili yazılar" etc. Turkish-aware slug for heading ids.
  def slugify(text)
    map = { 'ç' => 'c', 'Ç' => 'c', 'ğ' => 'g', 'Ğ' => 'g', 'ı' => 'i', 'I' => 'i', 'İ' => 'i',
            'ö' => 'o', 'Ö' => 'o', 'ş' => 's', 'Ş' => 's', 'ü' => 'u', 'Ü' => 'u', 'â' => 'a', 'Â' => 'a' }
    text.to_s.gsub(/<[^>]+>/, '').chars.map { |c| map[c] || c }.join.downcase
        .gsub(/[^a-z0-9]+/, '-').gsub(/^-|-$/, '')
  end

  # Shared form fields.
  def f_name;  { name: 'name', label: 'Ad soyad', required: true, autocomplete: 'name', max: 100 }; end
  def f_phone; { name: 'phone', label: 'Telefon', type: 'tel', required: true, autocomplete: 'tel', inputmode: 'tel', placeholder: '05xx xxx xx xx', max: 30 }; end
  def f_org(label); { name: 'organization', label: label, required: true, autocomplete: 'organization' }; end
  def f_city;  { name: 'city', label: 'Şehir', required: true, autocomplete: 'address-level2', max: 60 }; end
  def f_message(label = 'Kısaca anlatın', placeholder = nil); { name: 'message', label: label, type: 'textarea', placeholder: placeholder }; end

  def faq_schema(pairs)
    {
      '@type' => 'FAQPage',
      'mainEntity' => pairs.map { |q, a| { '@type' => 'Question', 'name' => q, 'acceptedAnswer' => { '@type' => 'Answer', 'text' => a } } },
    }
  end

  def tr_date(date)
    months = %w[Ocak Şubat Mart Nisan Mayıs Haziran Temmuz Ağustos Eylül Ekim Kasım Aralık]
    "#{date.day} #{months[date.month - 1]} #{date.year}"
  end
end

class RenderContext
  include Helpers
  def initialize(locals)
    locals.each do |k, v|
      instance_variable_set("@#{k}", v)
      define_singleton_method(k) { v }
    end
  end
end

include Helpers

# --------------------------------------------------------------- markdown ---
# Small Markdown subset used by the blog: ## headings, paragraphs, **bold**,
# *italic*, [links](url), "- " and "1. " lists, "> " quotes.

def md_inline(text)
  out = h(text)
  out = out.gsub(/\[([^\]]+)\]\(([^)\s]+)\)/) { %(<a href="#{$2}">#{$1}</a>) }
  out = out.gsub(/\*\*(.+?)\*\*/, '<strong>\1</strong>')
  out = out.gsub(/(?<![*\w])\*(?!\s)(.+?)(?<!\s)\*(?![*\w])/, '<em>\1</em>')
  out
end

def markdown(src)
  html = []
  toc = []
  blocks = src.strip.split(/\n{2,}/)
  blocks.each do |block|
    lines = block.split("\n")
    if block =~ /\A(#{'#'}{2,3}) (.+)\z/m
      level = $1.length
      text = $2.strip
      id = slugify(text)
      toc << { id: id, text: text } if level == 2
      html << %(<h#{level} id="#{id}">#{md_inline(text)}</h#{level}>)
    elsif lines.all? { |l| l =~ /\A- / }
      html << "<ul>\n" + lines.map { |l| "<li>#{md_inline(l.sub(/\A- /, ''))}</li>" }.join("\n") + "\n</ul>"
    elsif lines.all? { |l| l =~ /\A\d+\. / }
      html << "<ol>\n" + lines.map { |l| "<li>#{md_inline(l.sub(/\A\d+\. /, ''))}</li>" }.join("\n") + "\n</ol>"
    elsif lines.all? { |l| l.start_with?('>') }
      html << "<blockquote><p>#{md_inline(lines.map { |l| l.sub(/\A>\s?/, '') }.join(' '))}</p></blockquote>"
    else
      html << "<p>#{md_inline(lines.join(' '))}</p>"
    end
  end
  [html.join("\n"), toc]
end

def read_front_matter(file)
  raw = File.read(file)
  if raw =~ /\A---\n(.*?)\n---\n(.*)\z/m
    [YAML.safe_load($1, permitted_classes: [Date]), $2]
  else
    [{}, raw]
  end
end

# ------------------------------------------------------------------ build ---

def write(path, content)
  file = File.join(ROOT, path.end_with?('/') ? path + 'index.html' : path)
  FileUtils.mkdir_p(File.dirname(file))
  File.write(file, content)
  puts "  wrote #{file.sub(ROOT + '/', '')}"
end

def render_page(meta, body_html)
  @page = meta
  @site = { posts: POSTS }
  render_erb(File.join(SRC, 'layout.html.erb'), body: body_html)
end

# Blog posts first: pages (blog list, AI page) link to them.
POSTS = Dir[File.join(SRC, 'content', 'blog', '*.md')].map do |file|
  meta, body = read_front_matter(file)
  html, toc = markdown(body)
  meta.merge('html' => html, 'toc' => toc, 'path' => "/blog/#{meta['slug']}/")
end.sort_by { |p| [p['order'] || 99, p['slug']] }

SITEMAP = []

puts 'Building pages'
Dir[File.join(SRC, 'pages', '*.html.erb')].sort.each do |file|
  meta, body = read_front_matter(file)
  @page = meta
  @site = { posts: POSTS }
  body_html = ERB.new(body, trim_mode: '-').result(RenderContext.new(site: @site, page: meta).instance_eval { binding })
  write(meta['path'], render_page(meta, body_html))
  SITEMAP << meta['path'] unless meta['noindex']
end

puts 'Building blog posts'
POSTS.each do |post|
  others = POSTS.reject { |p| p['slug'] == post['slug'] }.first(3)
  meta = {
    'title' => "#{post['title']} | Assistune Blog",
    'description' => post['description'],
    'path' => post['path'],
    'og_title' => post['title'],
    'post' => post,
    'related' => others,
    'nav' => 'ai',
    'schema' => [{
      '@type' => 'Article',
      'headline' => post['title'],
      'description' => post['description'],
      'datePublished' => post['date'].to_s,
      'dateModified' => (post['updated'] || post['date']).to_s,
      'inLanguage' => 'tr-TR',
      'mainEntityOfPage' => abs(post['path']),
      'image' => abs('/og.png'),
      'author' => { '@type' => 'Organization', 'name' => 'Assistune', 'url' => abs('/') },
      'publisher' => { '@id' => abs('/#organization') },
    }],
  }
  @page = meta
  @site = { posts: POSTS }
  write(post['path'], render_page(meta, partial('post', post: post, related: others)))
  SITEMAP << post['path']
end

puts 'Building sitemap'
today = Date.today.iso8601
xml = +%(<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n)
SITEMAP.sort_by { |p| [p == '/' ? 0 : 1, p] }.each do |p|
  xml << "  <url>\n    <loc>#{abs(p)}</loc>\n    <lastmod>#{today}</lastmod>\n  </url>\n"
end
xml << "</urlset>\n"
write('sitemap.xml', xml)

puts 'Building llms.txt'
@page = {}
@site = { posts: POSTS }
write('llms.txt', render_erb(File.join(SRC, 'llms.txt.erb')))

puts 'Done.'
