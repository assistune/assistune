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

    /* * İLETİŞİM FORMU (DEMO MODU)
     * Google Sheets iptal edildiği için sadece başarı mesajı gösterir.
     */
    const form = document.getElementById('contactForm');
    const statusText = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault(); // Sayfanın yenilenmesini engelle
            
            // Butonu yükleniyor moduna al
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Gönderiliyor...';
            
            // 1.5 saniye bekleme simülasyonu (Sanki sunucuya gidiyormuş gibi)
            setTimeout(() => {
                // Başarılı mesajı
                statusText.innerHTML = '<i class="fa-solid fa-check-circle"></i> Teşekkürler! Bilgileriniz alındı. Size döneceğiz.';
                statusText.className = "text-center text-sm mt-4 text-brand-cyan block font-bold animate-pulse";
                form.reset(); // Formu temizle
                
                // Butonu eski haline getir
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerText = "BİZE ULAŞIN";
                    
                    // Mesajı 3 saniye sonra gizle
                    setTimeout(() => {
                        statusText.classList.add('hidden');
                    }, 3000);
                }, 2000);
            }, 1500);
        });
    }
});