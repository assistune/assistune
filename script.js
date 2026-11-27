/**
 * Assistune site script: header menus, scroll reveal, UTM capture, forms.
 *
 * Every form posts to a Cloudflare Worker that forwards the request to a
 * Telegram chat. The Telegram bot token lives only in the Worker's secrets,
 * never in this file. See telegram-worker/README.md.
 */

// Cloudflare Worker that forwards the forms to Telegram (telegram-worker/worker.js).
const FORM_ENDPOINT = 'https://assistune-form.arslanardakerem3.workers.dev';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const desktopNav = window.matchMedia('(min-width: 1025px)');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.addEventListener('DOMContentLoaded', () => {
    captureUtm();
    initHeader();
    initMenus();
    initMobileMenu();
    initReveal();
    initServicePicker();
    document.querySelectorAll('[data-lead-form]').forEach(initLeadForm);
});

// Deep links like /asistan/#demo: make sure we land on the section even if
// the browser's own jump happened before layout settled (fonts, redirects).
window.addEventListener('load', () => {
    const id = decodeURIComponent(location.hash.slice(1));
    const target = id && document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top;
    if (top > 120 || top < -10) target.scrollIntoView({ behavior: 'instant', block: 'start' });
});

/* ---------------------------------------------------------------- header */

function initHeader() {
    const nav = document.querySelector('[data-nav]');
    if (!nav) return;
    const update = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
}

// Desktop: panels open on hover (with a short close delay so moving between
// menus doesn't flicker), on keyboard focus, or by clicking the caret.
// Mobile: the caret toggles an accordion.
function initMenus() {
    const items = Array.from(document.querySelectorAll('[data-menu]'));
    if (!items.length) return;

    const setOpen = (item, open) => {
        item.classList.toggle('open', open);
        item.querySelector('.menu-caret').setAttribute('aria-expanded', String(open));
    };
    const closeOthers = (keep) => items.forEach((i) => { if (i !== keep) setOpen(i, false); });

    items.forEach((item) => {
        const caret = item.querySelector('.menu-caret');
        let closeTimer = null;

        item.addEventListener('mouseenter', () => {
            if (!desktopNav.matches) return;
            clearTimeout(closeTimer);
            closeOthers(item);
            setOpen(item, true);
        });
        item.addEventListener('mouseleave', () => {
            if (!desktopNav.matches) return;
            closeTimer = setTimeout(() => setOpen(item, false), 150);
        });
        item.addEventListener('focusin', () => {
            if (!desktopNav.matches) return;
            closeOthers(item);
            setOpen(item, true);
        });
        item.addEventListener('focusout', (e) => {
            if (!desktopNav.matches) return;
            if (!item.contains(e.relatedTarget)) setOpen(item, false);
        });
        caret.addEventListener('click', () => {
            const open = !item.classList.contains('open');
            if (desktopNav.matches) closeOthers(item);
            setOpen(item, open);
        });
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && item.classList.contains('open')) {
                setOpen(item, false);
                item.querySelector('.menu-link').focus();
                e.stopPropagation();
            }
        });
        // Clicking a link inside a panel (e.g. same-page anchor) closes it.
        item.querySelectorAll('.menu-panel a').forEach((a) => a.addEventListener('click', () => setOpen(item, false)));
    });

    desktopNav.addEventListener('change', () => items.forEach((i) => setOpen(i, false)));

    // Desktop panels close once the page scrolls away (pointer may not move).
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
        if (!desktopNav.matches) return;
        if (Math.abs(window.scrollY - lastY) > 40) {
            items.forEach((i) => { if (!i.contains(document.activeElement)) setOpen(i, false); });
            lastY = window.scrollY;
        }
    }, { passive: true });
    items.forEach((i) => i.addEventListener('mouseenter', () => { lastY = window.scrollY; }));
}

function initMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('site-menu');
    if (!toggle || !menu) return;

    const setOpen = (open) => {
        menu.classList.toggle('open', open);
        document.body.classList.toggle('menu-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    };

    toggle.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('open')) {
            setOpen(false);
            toggle.focus();
        }
    });
    desktopNav.addEventListener('change', () => setOpen(false));
}

/* ---------------------------------------------------------------- reveal */

function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
        els.forEach((el) => el.classList.add('in'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                io.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------------- UTM */

function captureUtm() {
    try {
        const params = new URLSearchParams(location.search);
        const found = {};
        UTM_KEYS.forEach((k) => { if (params.get(k)) found[k] = params.get(k).slice(0, 150); });
        if (Object.keys(found).length) sessionStorage.setItem('assistune_utm', JSON.stringify(found));
    } catch (e) { /* storage blocked: ignore */ }
}

function readUtm() {
    try {
        return JSON.parse(sessionStorage.getItem('assistune_utm') || '{}') || {};
    } catch (e) {
        return {};
    }
}

/* --------------------------------------------------------- service cards */

// /baslayalim/: radio cards + ?hizmet=asistan|ai|ajans|genel preselect.
function initServicePicker() {
    const picker = document.querySelector('[data-service-picker]');
    if (!picker) return;
    try {
        const wanted = new URLSearchParams(location.search).get('hizmet');
        const input = wanted && picker.querySelector(`input[data-key="${CSS.escape(wanted)}"]`);
        if (input) input.checked = true;
    } catch (e) { /* ignore */ }
}

/* ----------------------------------------------------------------- forms */

function isValidPhone(raw) {
    const value = String(raw || '').trim();
    const plus = value.startsWith('+');
    let digits = value.replace(/\D/g, '');
    if (plus && !digits.startsWith('90')) return digits.length >= 8 && digits.length <= 15;
    if (digits.startsWith('90') && digits.length === 12) digits = digits.slice(2);
    if (digits.startsWith('0') && digits.length === 11) digits = digits.slice(1);
    return /^[2-5]\d{9}$/.test(digits);
}

function initLeadForm(form) {
    const button = form.querySelector('button[type="submit"]');
    const label = button.querySelector('.btn-label');
    const status = form.querySelector('.form-status');
    const idleText = label ? label.textContent : button.textContent;

    const show = (text, kind) => {
        status.textContent = text;
        status.className = 'form-status span-2' + (kind ? ' ' + kind : '');
    };

    const mark = (el, bad) => {
        const target = el.closest('fieldset') || el;
        target.setAttribute('aria-invalid', bad ? 'true' : 'false');
    };

    form.addEventListener('input', (e) => {
        if (e.target.getAttribute('aria-invalid') === 'true') mark(e.target, false);
        const fs = e.target.closest('fieldset[aria-invalid="true"]');
        if (fs) fs.setAttribute('aria-invalid', 'false');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());

        // Required fields (radio groups count once).
        let firstInvalid = null;
        const seen = new Set();
        form.querySelectorAll('[required]').forEach((el) => {
            if (el.name === 'consent' || seen.has(el.name)) return;
            seen.add(el.name);
            const empty = !String(data[el.name] || '').trim();
            mark(el, empty);
            if (empty && !firstInvalid) firstInvalid = el;
        });
        if (firstInvalid) {
            show('Lütfen zorunlu alanları doldurun.', 'err');
            firstInvalid.focus();
            return;
        }
        const phone = form.elements.phone;
        if (!isValidPhone(data.phone)) {
            mark(phone, true);
            show('Telefon numarası geçerli görünmüyor. Örnek: 0532 123 45 67', 'err');
            phone.focus();
            return;
        }
        if (!form.elements.consent.checked) {
            show('Devam etmek için onay kutusunu işaretleyin.', 'err');
            form.elements.consent.focus();
            return;
        }

        delete data.consent;
        const payload = Object.assign({}, data, readUtm(), {
            form_type: form.dataset.formType,
            consent: true,
            page: location.pathname + location.hash,
        });

        button.disabled = true;
        button.classList.add('is-loading');
        if (label) label.textContent = 'Gönderiliyor…';
        show('');

        try {
            const res = await fetch(FORM_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            form.reset();
            if (form.querySelector('[data-service-picker]')) initServicePicker();
            show(form.dataset.success || 'Talebiniz bize ulaştı.', 'ok');
        } catch (err) {
            show('Bir sorun oluştu, lütfen tekrar deneyin.', 'err');
        } finally {
            button.disabled = false;
            button.classList.remove('is-loading');
            if (label) label.textContent = idleText;
        }
    });
}
