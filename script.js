// Sayfa yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', () => {
    initROI();
    initTabs();
});

// 1. ROI (Tasarruf) Hesaplayıcı Mantığı
function initROI() {
    const missedCallsInput = document.getElementById('missedCalls');
    const minsPerCallInput = document.getElementById('minsPerCall');
    const roiResultDisplay = document.getElementById('roiResult');

    const calculate = () => {
        const calls = parseFloat(missedCallsInput.value) || 0;
        const mins = parseFloat(minsPerCallInput.value) || 0;
        
        // Formül: (Günlük Çağrı * 30 Gün * Çağrı Başı Süre) / 60 Dakika
        const monthlyHoursSaved = Math.round((calls * 30 * mins) / 60);
        
        // Sonucu ekrana yazdır
        roiResultDisplay.innerText = monthlyHoursSaved;
    };

    // Input değiştikçe hesapla
    missedCallsInput.addEventListener('input', calculate);
    minsPerCallInput.addEventListener('input', calculate);
    
    // İlk hesaplamayı yap
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

    // Metni değiştir
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
