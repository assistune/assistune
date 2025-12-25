// Sayfa yüklendiğinde tüm sistemleri başlatan ana fonksiyon
document.addEventListener('DOMContentLoaded', () => {
    initCalculator();
    // initTabs() fonksiyonu eğer aşağıda tanımlı değilse hata vermemesi için kontrol ekledik
    if (typeof initTabs === "function") initTabs(); 
});

// 1. Kayıp Müşteri Hesaplayıcı Mantığı
function initCalculator() {
    const dailyTotalInput = document.getElementById('dailyTotal');
    const dailyMissedDisplay = document.getElementById('dailyMissed');
    const monthlyMissedDisplay = document.getElementById('monthlyMissed');
    const yearlyMissedDisplay = document.getElementById('yearlyMissed');

    // Eğer sayfada bu ID'ler yoksa fonksiyonu durdur (Hata almamak için)
    if (!dailyTotalInput || !dailyMissedDisplay) return;

    const MISSED_RATIO = 0.30; // %30 Kaçırma Oranı

    const calculate = () => {
        const total = parseFloat(dailyTotalInput.value) || 0;
        
        // Matematiksel Hesaplamalar
        const dailyMissed = Math.round(total * MISSED_RATIO);
        const monthlyMissed = dailyMissed * 30;
        const yearlyMissed = dailyMissed * 365;

        // Sonuçları Ekrana Yazdır
        dailyMissedDisplay.innerText = dailyMissed.toLocaleString('tr-TR');
        monthlyMissedDisplay.innerText = monthlyMissed.toLocaleString('tr-TR');
        yearlyMissedDisplay.innerText = yearlyMissed.toLocaleString('tr-TR');
    };

    // Kullanıcı sayı girdikçe hesapla
    dailyTotalInput.addEventListener('input', calculate);
    
    // Sayfa açıldığında ilk hesaplamayı yap
    calculate();
}

// 2. Karanlık Mod (Dark Mode) Yönetimi
function toggleDarkMode() {
    const htmlElement = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    
    if (htmlElement.classList.contains('dark')) {
        htmlElement.classList.remove('dark');
        themeIcon.innerText = '☀️';
        localStorage.setItem('theme', 'light');
    } else {
        htmlElement.classList.add('dark');
        themeIcon.innerText = '🌙';
        localStorage.setItem('theme', 'dark');
    }
}

// 3. Sektörel Senaryo Seçici (Tabs)
const sectorData = {
    klinik: "Hastaların randevularını 7/24 düzenleyin, tedavi sonrası takip mesajlarını otomatize edin.",
    eticaret: "Sepette ürün bırakan müşterilere özel indirimler sunun ve kargo sorgularını anında yanıtlayın.",
    hizmet: "Teklif süreçlerini hızlandırın, saha ekiplerinizin takvimini AI ile koordine edin."
};

function showTab(type) {
    const contentArea = document.getElementById('tabContent');
    const buttons = document.querySelectorAll('.tab-btn');

    if(!contentArea) return;

    // Metni yumuşak geçişle değiştir
    contentArea.style.opacity = 0;
    setTimeout(() => {
        contentArea.innerText = sectorData[type];
        contentArea.style.opacity = 1;
    }, 150);

    // Aktif buton stilini güncelle
    buttons.forEach(btn => {
        if (btn.getAttribute('data-tab') === type) {
            btn.classList.add('gradient-bg', 'text-white');
            btn.classList.remove('border-slate-300', 'dark:border-slate-700');
        } else {
            btn.classList.remove('gradient-bg', 'text-white');
            btn.classList.add('border-slate-300', 'dark:border-slate-700');
        }
    });
}
