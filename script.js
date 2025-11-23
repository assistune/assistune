// Sayfa tamamen yüklendiğinde çalışır
document.addEventListener('DOMContentLoaded', () => {
    
    /* * MOBİL MENÜ MANTIĞI 
     */
    const toggleBtn = document.querySelector('[data-collapse-toggle="navbar-sticky"]');
    const menu = document.getElementById('navbar-sticky');
    const navLinks = document.querySelectorAll('.nav-link'); // Menü içindeki linkler

    if (toggleBtn && menu) {
        // Menü açma/kapama butonu
        toggleBtn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });

        // Menüdeki bir linke tıklayınca menüyü kapat (Mobil için önemli)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (!menu.classList.contains('hidden')) {
                    menu.classList.add('hidden');
                }
            });
        });
    }

    /* * İLETİŞİM FORMU ve WEBHOOK ENTEGRASYONU
     * Form verilerini alır ve n8n webhook'una JSON olarak gönderir.
     */
    const form = document.getElementById('contactForm');
    const statusText = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Sayfanın yenilenmesini engelle
            
            // Form verilerini al
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone')
            };

            // Butonu yükleniyor moduna al
            const originalBtnText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Gönderiliyor...';
            statusText.classList.add('hidden'); // Önceki mesajları gizle

            try {
                // n8n Webhook'a istek gönder
                const response = await fetch('https://tasshake.app.n8n.cloud/webhook-test/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    // Başarılı
                    statusText.innerHTML = '<i class="fa-solid fa-check-circle"></i> Teşekkürler! Bilgileriniz alındı. Size döneceğiz.';
                    statusText.className = "text-center text-sm mt-4 text-brand-cyan block font-bold animate-pulse";
                    form.reset(); // Formu temizle
                } else {
                    // Sunucu hatası
                    throw new Error('Sunucu hatası');
                }
            } catch (error) {
                // Bağlantı hatası
                console.error('Hata:', error);
                statusText.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Bir hata oluştu. Lütfen tekrar deneyin.';
                statusText.className = "text-center text-sm mt-4 text-red-500 block font-bold";
            } finally {
                // Butonu her durumda eski haline getir (biraz bekleyip)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    
                    // Başarı mesajını 5 saniye sonra gizle
                    if (statusText.classList.contains('text-brand-cyan')) {
                        setTimeout(() => {
                            statusText.classList.add('hidden');
                        }, 5000);
                    }
                }, 1000);
            }
        });
    }
});
