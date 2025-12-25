// Sayfa yüklendiğinde her şeyi başlatan ana kontrolcü
document.addEventListener('DOMContentLoaded', () => {
    console.log("Assistune Sistemleri Başlatıldı..."); // Tarayıcı konsolunda çalışıp çalışmadığını görebilirsin
    initCalculator();
});

// Kayıp Müşteri Hesaplayıcı Mantığı
function initCalculator() {
    // HTML elemanlarını seçiyoruz
    const dailyTotalInput = document.getElementById('dailyTotal');
    const dailyMissedDisplay = document.getElementById('dailyMissed');
    const monthlyMissedDisplay = document.getElementById('monthlyMissed');
    const yearlyMissedDisplay = document.getElementById('yearlyMissed');

    // Güvenlik kontrolü: Eğer sayfada bu ID'ler yoksa hata verme, dur.
    if (!dailyTotalInput || !dailyMissedDisplay) {
        console.error("Hata: HTML tarafında 'dailyTotal' veya 'dailyMissed' ID'leri bulunamadı!");
        return;
    }

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

    // Kullanıcı bir rakam yazdığı anda hesaplamayı tetikle
    dailyTotalInput.addEventListener('input', calculate);
    
    // Sayfa ilk açıldığında varsayılan değerle hesapla
    calculate();
}

// Karanlık Mod Yönetimi
function toggleDarkMode() {
    const htmlElement = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    
    htmlElement.classList.toggle('dark');
    if (themeIcon) {
        themeIcon.innerText = htmlElement.classList.contains('dark') ? '🌙' : '☀️';
    }
    localStorage.setItem('theme', htmlElement.classList.contains('dark') ? 'dark' : 'light');
}
