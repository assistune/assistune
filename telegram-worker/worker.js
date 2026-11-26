/**
 * Assistune demo form -> Telegram
 *
 * Cloudflare Worker. Receives the demo form from assistune.com and posts it
 * to a Telegram chat. Secrets are set in the Cloudflare dashboard, not here:
 *   TELEGRAM_BOT_TOKEN  (Secret)  token from @BotFather
 *   TELEGRAM_CHAT_ID    (Secret)  the chat/group id that receives the requests
 */

const ALLOWED_ORIGINS = [
    'https://assistune.com',
    'https://www.assistune.com',
];

const LIMITS = {
    name: 100,
    phone: 30,
    organization: 120,
    role: 60,
    instagram: 60,
    message: 1000,
};

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

        let body;
        try {
            body = await request.json();
        } catch {
            return json({ ok: false, error: 'bad_json' }, 400, cors);
        }

        // Honeypot: bots fill the hidden "website" field. Pretend success.
        if (body && typeof body.website === 'string' && body.website.trim() !== '') {
            return json({ ok: true }, 200, cors);
        }

        const clean = {};
        for (const [key, max] of Object.entries(LIMITS)) {
            const value = typeof body?.[key] === 'string' ? body[key].trim() : '';
            clean[key] = value.slice(0, max);
        }

        if (!clean.name || !clean.phone) {
            return json({ ok: false, error: 'missing_fields' }, 400, cors);
        }
        if (!/^[+\d][\d\s().-]{6,}$/.test(clean.phone)) {
            return json({ ok: false, error: 'bad_phone' }, 400, cors);
        }

        if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
            return json({ ok: false, error: 'not_configured' }, 500, cors);
        }

        const lines = [
            'Yeni demo talebi (assistune.com)',
            '',
            `Ad soyad: ${clean.name}`,
            `Telefon: ${clean.phone}`,
            clean.organization && `Klinik/ajans: ${clean.organization}`,
            clean.role && `Rol: ${clean.role}`,
            clean.instagram && `Instagram: ${clean.instagram}`,
            clean.message && `\nNot:\n${clean.message}`,
        ].filter(Boolean);

        // Plain text (no parse_mode) so user input can never be read as markup.
        const tg = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: env.TELEGRAM_CHAT_ID,
                text: lines.join('\n'),
                disable_web_page_preview: true,
            }),
        });

        if (!tg.ok) {
            return json({ ok: false, error: 'telegram_failed' }, 502, cors);
        }
        return json({ ok: true }, 200, cors);
    },
};

function json(data, status, headers) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...headers },
    });
}
