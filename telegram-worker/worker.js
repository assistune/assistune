/**
 * Assistune lead endpoint -> Telegram
 *
 * Cloudflare Worker. Every form on assistune.com posts here (one endpoint,
 * a `form_type` field tells them apart) and the Worker forwards the request
 * to a Telegram chat. Secrets are set in the Cloudflare dashboard, not here:
 *   TELEGRAM_BOT_TOKEN  (Secret)  token from @BotFather
 *   TELEGRAM_CHAT_ID    (Secret)  the chat/group id that receives the requests
 *
 * Accepted at any path, so both the root URL and /api/lead work.
 */

const ALLOWED_ORIGINS = [
    'https://assistune.com',
    'https://www.assistune.com',
    // Local preview (ruby -run -e httpd . -p 8765)
    'http://localhost:8765',
    'http://127.0.0.1:8765',
];

// Best-effort rate limit per Worker instance: N requests per IP per window.
// For a hard limit add a Cloudflare "Rate limiting" rule as well.
const RATE_LIMIT = 4;
const RATE_WINDOW_MS = 60 * 1000;
const hits = new Map();

const FORM_TYPES = {
    asistan_demo: { title: '🤖 Yeni Asistan demo talebi', required: ['name', 'phone'] },
    ai_analiz: { title: '🔍 Yeni AI görünürlük analizi talebi', required: ['name', 'phone', 'organization', 'city'] },
    ajans: { title: '🤝 Yeni ajans eşleştirme talebi', required: ['name', 'phone', 'organization', 'city', 'org_type'] },
    baslayalim: { title: '🚀 Yeni "Başlayalım" talebi', required: ['name', 'phone', 'organization', 'city', 'service'] },
};

// Field -> [max length, Telegram label]. Order = order in the message.
const FIELDS = {
    name: [100, '👤 Ad'],
    phone: [30, '📞 Tel'],
    organization: [120, '🏥 İşletme'],
    city: [60, '📍 Şehir'],
    service: [40, '🧭 Seçim'],
    role: [60, '🧑‍⚕️ Rol'],
    instagram: [60, '📸 Instagram'],
    web: [200, '🌐 Web/Instagram'],
    org_type: [40, '🏷 Kurum tipi'],
    org_age: [40, '📅 Kuruluş'],
    budget: [40, '💰 Aylık bütçe'],
    has_agency: [10, '🤝 Ajansla çalışıyor mu'],
    message: [1000, '📝 Not'],
};

const META = { page: 300, utm_source: 100, utm_medium: 100, utm_campaign: 150, utm_content: 150, utm_term: 150 };

export default {
    async fetch(request, env) {
        const origin = request.headers.get('Origin') || '';
        const allowed = ALLOWED_ORIGINS.includes(origin);
        const cors = allowed ? {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
            'Vary': 'Origin',
        } : {};

        if (request.method === 'OPTIONS') {
            return new Response(null, { status: allowed ? 204 : 403, headers: cors });
        }
        if (request.method !== 'POST') {
            return json({ ok: false, error: 'method_not_allowed' }, 405, cors);
        }
        if (!allowed) {
            return json({ ok: false, error: 'forbidden' }, 403, cors);
        }

        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        if (isRateLimited(ip)) {
            return json({ ok: false, error: 'rate_limited' }, 429, cors);
        }

        let body;
        try {
            body = await request.json();
        } catch {
            return json({ ok: false, error: 'bad_json' }, 400, cors);
        }
        if (!body || typeof body !== 'object') {
            return json({ ok: false, error: 'bad_json' }, 400, cors);
        }

        // Honeypot: bots fill the hidden "website" field. Pretend success.
        if (typeof body.website === 'string' && body.website.trim() !== '') {
            return json({ ok: true }, 200, cors);
        }

        // Older cached pages send no form_type: they are the Asistan demo form.
        const type = FORM_TYPES[body.form_type] ? body.form_type : 'asistan_demo';
        const spec = FORM_TYPES[type];

        const clean = {};
        for (const [key, [max]] of Object.entries(FIELDS)) clean[key] = str(body[key], max);
        const meta = {};
        for (const [key, max] of Object.entries(META)) meta[key] = str(body[key], max);

        if (spec.required.some((key) => !clean[key])) {
            return json({ ok: false, error: 'missing_fields' }, 400, cors);
        }
        if (!isValidPhone(clean.phone)) {
            return json({ ok: false, error: 'bad_phone' }, 400, cors);
        }
        if (body.consent !== true && body.consent !== 'on' && body.consent !== undefined) {
            return json({ ok: false, error: 'no_consent' }, 400, cors);
        }

        if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
            return json({ ok: false, error: 'not_configured' }, 500, cors);
        }

        const title = type === 'baslayalim' && clean.service
            ? `${spec.title} — Seçim: ${clean.service}`
            : spec.title;

        const lines = [`<b>${esc(title)}</b>`, ''];
        for (const [key, [, label]] of Object.entries(FIELDS)) {
            if (key === 'service' && type === 'baslayalim') continue; // already in title
            if (clean[key]) lines.push(`${label}: ${esc(clean[key])}`);
        }

        const utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']
            .map((k) => meta[k] || '-').join('/');
        const hasUtm = utm !== '-/-/-/-';
        lines.push('');
        lines.push(`🔗 Sayfa: ${esc(meta.page || '-')}${hasUtm ? ` | UTM: ${esc(utm)}` : ''}`);
        lines.push(`🕒 ${istanbulTime()}`);

        const tg = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: env.TELEGRAM_CHAT_ID,
                text: lines.join('\n'),
                parse_mode: 'HTML',
                disable_web_page_preview: true,
            }),
        });

        if (!tg.ok) {
            return json({ ok: false, error: 'telegram_failed' }, 502, cors);
        }
        return json({ ok: true }, 200, cors);
    },
};

function str(value, max) {
    return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

// Telegram HTML mode: only &, < and > need escaping in text.
function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Turkish numbers (05xx..., 5xx..., +90 5xx..., landlines 2xx-4xx) or any
// international number written with a leading "+" (health tourism patients).
function isValidPhone(raw) {
    const plus = raw.trim().startsWith('+');
    let digits = raw.replace(/\D/g, '');
    if (plus && !digits.startsWith('90')) return digits.length >= 8 && digits.length <= 15;
    if (digits.startsWith('90') && digits.length === 12) digits = digits.slice(2);
    if (digits.startsWith('0') && digits.length === 11) digits = digits.slice(1);
    return /^[2-5]\d{9}$/.test(digits);
}

function isRateLimited(ip) {
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
    recent.push(now);
    hits.set(ip, recent);
    if (hits.size > 5000) {
        for (const [key, times] of hits) {
            if (!times.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(key);
        }
    }
    return recent.length > RATE_LIMIT;
}

function istanbulTime() {
    return new Intl.DateTimeFormat('tr-TR', {
        timeZone: 'Europe/Istanbul',
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date()) + ' (İstanbul)';
}

function json(data, status, headers) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...headers },
    });
}
