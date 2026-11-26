# Demo formu → Telegram

Sitedeki demo formu doğrudan Telegram'a değil, bu küçük Cloudflare Worker'a gönderilir. Worker talebi Telegram grubunuza iletir. Böylece Telegram bot anahtarı sitenin kodunda görünmez.

Kurulum yaklaşık 15 dakika sürer. Hepsi ücretsiz.

## 1. Telegram botunu oluşturun

1. Telegram'da **@BotFather** ile sohbet açın, `/newbot` yazın.
2. Bota bir ad ve `_bot` ile biten bir kullanıcı adı verin (örn. `assistune_demo_bot`).
3. BotFather size bir **token** verir (`123456789:AA...` gibi). Bunu kimseyle paylaşmayın, koda ya da GitHub'a yazmayın.

## 2. Taleplerin düşeceği grubu hazırlayın

1. Ekipçe kullanacağınız bir Telegram grubu açın ve botu gruba ekleyin.
2. Grupta herhangi bir mesaj yazın (örn. `merhaba`).
3. Tarayıcıda şu adresi açın (TOKEN yerine kendi token'ınızı yazın):
   `https://api.telegram.org/botTOKEN/getUpdates`
4. Çıkan metinde `"chat":{"id":-100...` kısmındaki sayı grubun **chat id**'sidir. Eksi işaretiyle birlikte not alın.

## 3. Worker'ı oluşturun

1. [dash.cloudflare.com](https://dash.cloudflare.com) adresinde ücretsiz hesap açın.
2. **Workers & Pages → Create → Create Worker** yolunu izleyin. Ad olarak `assistune-form` girin, **Deploy**'a basın.
3. **Edit code**'a tıklayın. İçindeki her şeyi silip bu klasördeki `worker.js` dosyasının tamamını yapıştırın. **Deploy**'a basın.
4. Worker'ın **Settings → Variables and Secrets** bölümüne iki **Secret** ekleyin:
   - `TELEGRAM_BOT_TOKEN` → BotFather'dan aldığınız token
   - `TELEGRAM_CHAT_ID` → 2. adımda bulduğunuz chat id
5. Worker'ın adresini kopyalayın (örn. `https://assistune-form.ADINIZ.workers.dev`).

## 4. Siteye bağlayın

`script.js` dosyasının başındaki satırı Worker adresinizle doldurun:

```js
const FORM_ENDPOINT = 'https://assistune-form.ADINIZ.workers.dev';
```

Değişikliği GitHub'a yükleyin. Site güncellendikten sonra formu bir kez deneyin. Mesaj birkaç saniye içinde Telegram grubuna düşmelidir.

## Güvenlik notları

- Worker yalnızca `assistune.com` ve `www.assistune.com` adreslerinden gelen istekleri kabul eder.
- Formda botları eleyen gizli bir alan var. Bu alanı dolduran istekler Telegram'a iletilmez.
- Spam gelirse Cloudflare'de Worker için **Rate limiting** kuralı eklenebilir.
- Form ad ve telefon gibi kişisel veriler topluyor. Telegram'ın sunucuları yurt dışındadır. KVKK aydınlatma metninde bu aktarımın belirtilmesi gerekir (hukukçuya danışın).
