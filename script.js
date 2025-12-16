document.addEventListener('DOMContentLoaded', () => {
    
    // --- MOBİL MENÜ ---
    const toggleBtn = document.querySelector('[data-collapse-toggle="navbar-sticky"]');
    const menu = document.getElementById('navbar-sticky');
    
    if (toggleBtn && menu) {
        toggleBtn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });
        
        // Linke tıklanınca menüyü kapat
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('hidden');
            });
        });
    }

    // --- ACCORDION (SSS) ---
    const accordions = document.querySelectorAll('.accordion-btn');
    accordions.forEach(acc => {
        acc.addEventListener('click', function() {
            // Aktif durumu değiştir
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            const icon = this.querySelector('i');

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                icon.classList.remove('rotate-45'); // İkonu geri döndür
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                icon.classList.add('rotate-45'); // İkonu çarpı yap
            }
        });
    });

    // --- N8N FORM GÖNDERİMİ ---
    const form = document.getElementById('contactForm');
    const statusText = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone')
            };

            // Loading Modu
            const originalBtnText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> GÖNDERİLİYOR...';
            statusText.classList.add('hidden');

            try {
                // Assistune Webhook URL
                const response = await fetch('https://n8n.bosphorusspace.com/webhook-test/2eb11a4c-3572-4283-9101-287730632243', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    statusText.innerHTML = '<i class="fa-solid fa-check-circle"></i> Başarıyla gönderildi! En kısa sürede döneceğiz.';
                    statusText.className = "text-center text-sm mt-4 text-brand-cyan block font-bold";
                    form.reset();
                } else {
                    throw new Error('Sunucu hatası');
                }
            } catch (error) {
                console.error(error);
                statusText.innerHTML = 'Bir hata oluştu. Lütfen tekrar deneyin.';
                statusText.className = "text-center text-sm mt-4 text-red-500 block";
            } finally {
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }, 2000);
            }
        });
    }
});
