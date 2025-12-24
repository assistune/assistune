// Sayfa yüklendiğinde çalışacak kodlar
document.addEventListener('DOMContentLoaded', () => {
    
    // CTA Butonuna tıklama efekti
    const ctaBtn = document.getElementById('main-cta');
    ctaBtn.addEventListener('click', () => {
        alert('Sisteme yönlendiriliyorsunuz...');
    });

    // Navigasyon linkleri için yumuşak kaydırma
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll sırasında navbar değişimi
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.padding = '1rem 10%';
            navbar.style.background = '#020617'; // Daha koyu renk
        } else {
            navbar.style.padding = '1.5rem 10%';
            navbar.style.background = '#0f172a';
        }
    });
});
