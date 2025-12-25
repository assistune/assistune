// Sayfa yüklendiğinde tüm sistemleri güvenli bir şekilde başlatan ana kontrolcü
document.addEventListener('DOMContentLoaded', () => {
    console.log("Assistune: Sistemler kontrol ediliyor...");
    
    // Sadece sayfada varsa hesaplayıcıyı başlat
    if (document.getElementById('dailyTotal')) {
        initCalculator();
    }
    
    // Sektörel sekmeleri (Tabs) her ihtimale karşı hazırla
    updateTabStyles('klinik'); 
});

// 1. Kayıp Müşteri Hesaplayıcı Mantığı
function initCalculator() {
    const dailyTotalInput = document.getElementById('dailyTotal');
    const dailyMissedDisplay = document.getElementById('dailyMissed');
    const monthlyMissedDisplay = document.getElementById('monthlyMissed');
    const yearlyMissedDisplay = document.getElementById('yearlyMissed');

    const MISSED_RATIO = 0.30; // %30 Kaçırma Oranı

    const calculate = () => {
        const total = parseFloat(dailyTotalInput.value) || 0;
        
        // Matematiksel Hesaplamalar
        const dailyMissed = Math.round(total * MISSED_RATIO);
        const monthlyMissed = dailyMissed * 30;
        const yearlyMissed = dailyMissed * 365;

        // Sonuçları Ekrana Yazdır (Formatlı: 1.250 gibi)
        dailyMissedDisplay.innerText = dailyMissed.toLocaleString('tr-TR');
        monthlyMissedDisplay.innerText = monthlyMissed.toLocaleString('tr-TR');
        yearlyMissedDisplay.innerText = yearlyMissed.toLocaleString('tr-TR');
    };

    // Giriş kutusuna sayı yazıldığı an çalıştır
    dailyTotalInput.addEventListener('input', calculate);
    
    // Sayfa ilk açıldığında (varsayılan 50 değeriyle) hesaplamayı yap
    calculate();
}

// 2. Sektörel Senaryo Seçici (Tabs)
const sectorData = {
    klinik: "Hastaların randevularını 7/24 düzenleyin, tedavi sonrası takip mesajlarını otomatize edin.",
    eticaret: "Sepette ürün bırakan müşterilere özel indirimler sunun ve kargo sorgularını anında yanıtlayın.",
    hizmet: "Teklif süreçlerini hızlandırın, saha ekiplerinizin takvimini AI ile koordine edin."
};

function showTab(type) {
    const contentArea = document.getElementById('tabContent');
    if (!contentArea) return;

    // Metni değiştir
    contentArea.style.opacity = 0;
    setTimeout(() => {
        contentArea.innerText = sectorData[type];
        contentArea.style.opacity = 1;
        updateTabStyles(type);
    }, 150);
}

function updateTabStyles(activeType) {
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('data-tab') === activeType) {
            btn.classList.add('gradient-bg', 'text-white');
            btn.classList.remove('border-slate-300', 'dark:border-slate-700');
        } else {
            btn.classList.remove('gradient-bg', 'text-white');
            btn.classList.add('border-slate-300', 'dark:border-slate-700');
        }
    });
}

// 3. Karanlık Mod Yönetimi
function toggleDarkMode() {
    const htmlElement = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    
    htmlElement.classList.toggle('dark');
    if (themeIcon) {
        themeIcon.innerText = htmlElement.classList.contains('dark') ? '🌙' : '☀️';
    }
}
