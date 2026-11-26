/**
 * Assistune site: mobile menu + demo form.
 *
 * The demo form posts to a Cloudflare Worker that forwards the request to a
 * Telegram chat. The Telegram bot token lives only in the Worker's secrets,
 * never in this file. See telegram-worker/README.md for setup.
 */

// Set this to your Worker's URL after deploying it, e.g.
// 'https://assistune-form.<your-subdomain>.workers.dev'
const FORM_ENDPOINT = '';

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initDemoForm();
});

function initMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    if (!toggle || !links) return;

    const setOpen = (open) => {
        links.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    };

    toggle.addEventListener('click', () => setOpen(!links.classList.contains('open')));
    links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}

function initDemoForm() {
    const form = document.getElementById('demo-form');
    const button = document.getElementById('demo-submit');
    const status = document.getElementById('form-status');
    if (!form || !button || !status) return;

    const show = (text, kind) => {
        status.textContent = text;
        status.className = 'form-status' + (kind ? ' ' + kind : '');
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form).entries());
        const required = ['name', 'phone'];
        let firstInvalid = null;

        required.forEach((name) => {
            const input = form.elements[name];
            const empty = !String(data[name] || '').trim();
            input.setAttribute('aria-invalid', empty ? 'true' : 'false');
            if (empty && !firstInvalid) firstInvalid = input;
        });

        if (firstInvalid) {
            show('Lütfen adınızı ve telefon numaranızı yazın.', 'err');
            firstInvalid.focus();
            return;
        }
        if (!form.elements.consent.checked) {
            show('Devam etmek için onay kutusunu işaretleyin.', 'err');
            return;
        }
        if (!FORM_ENDPOINT) {
            show('Form şu an bakımda. Lütfen daha sonra tekrar deneyin.', 'err');
            return;
        }

        button.disabled = true;
        show('Gönderiliyor…');

        try {
            const res = await fetch(FORM_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    phone: data.phone,
                    organization: data.organization || '',
                    role: data.role || '',
                    instagram: data.instagram || '',
                    message: data.message || '',
                    website: data.website || ''
                })
            });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            form.reset();
            show('Teşekkürler! Talebiniz bize ulaştı, en kısa sürede sizi arayacağız.', 'ok');
        } catch (err) {
            show('Gönderilemedi. Lütfen bir süre sonra tekrar deneyin.', 'err');
        } finally {
            button.disabled = false;
        }
    });
}
