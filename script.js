// Tailwind Configuration
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: { cyan: '#7FE5FF', purple: '#9625BC' },
                bg: { light: '#FFFFFF', dark: '#020617' }
            }
        }
    }
}

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    const themeIcon = document.getElementById('theme-icon');
    if(themeIcon) themeIcon.innerText = savedTheme === 'dark' ? '🌙' : '☀️';
}

function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const themeIcon = document.getElementById('theme-icon');
    if(themeIcon) themeIcon.innerText = isDark ? '🌙' : '☀️';
}

// FAQ Toggle Logic
function toggleFaq(element) {
    const isActive = element.classList.contains('active');
    
    // Akordiyon etkisi için diğerlerini kapat
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    if (!isActive) {
        element.classList.add('active');
    }
}

// ROI (Return on Investment) Logic
const dailyInput = document.getElementById('dailyTotal');
const rangeValue = document.getElementById('rangeValue');
const customerValue = document.getElementById('customerValue');
const yearlyLossDisplay = document.getElementById('yearlyLoss');
const aiRecoveryDisplay = document.getElementById('aiRecovery');
const lossPercentDisplay = document.getElementById('lossPercent');
const recoveryPercentDisplay = document.getElementById('recoveryPercent');
const recoveryBar = document.getElementById('recoveryBar');

function updateAnalysis() {
    if(!dailyInput || !customerValue) return;

    const total = parseInt(dailyInput.value);
    const val = parseInt(customerValue.value) || 0;
    rangeValue.innerText = total.toLocaleString('tr-TR');

    const monthlyLoss = total * 0.25 * val;
    const yearlyLoss = monthlyLoss * 12;
    const monthlyRecovery = monthlyLoss * 0.85;
    const aiRecoveryYearly = monthlyRecovery * 10; 
    
    yearlyLossDisplay.innerText = yearlyLoss.toLocaleString('tr-TR');
    aiRecoveryDisplay.innerText = aiRecoveryYearly.toLocaleString('tr-TR');
    lossPercentDisplay.innerText = "₺" + monthlyLoss.toLocaleString('tr-TR');
    recoveryPercentDisplay.innerText = "₺" + monthlyRecovery.toLocaleString('tr-TR');

    setTimeout(() => { 
        if(recoveryBar) recoveryBar.style.width = "85%"; 
    }, 100);
}

// Form Submission Logic
const form = document.getElementById('assistuneContactForm');
const btn = document.getElementById('submitBtn');
const loader = document.getElementById('loader');

if(form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const WEBHOOK_URL = 'https://n8n.bosphorusspace.com/webhook-test/2eb11a4c-3572-4283-9101-287730632243';
        
        try {
            btn.disabled = true;
            loader.classList.remove('hidden');
            
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: document.getElementById('name').value,
                    business: document.getElementById('business').value,
                    phone: document.getElementById('phone').value,
                    message: document.getElementById('message').value,
                    timestamp: new Date().toISOString()
                })
            });

            if (response.ok) {
                showToast('✅ Talebiniz Alındı!');
                form.reset();
            } else { 
                throw new Error(); 
            }
        } catch (err) {
            showToast('❌ Hata oluştu.');
        } finally {
            btn.disabled = false;
            loader.classList.add('hidden');
        }
    });
}

// Notification System
function showToast(msg) {
    const notification = document.getElementById('notification');
    const notifMsg = document.getElementById('notif-msg');
    if(notification && notifMsg) {
        notifMsg.innerText = msg;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 5000);
    }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    if(dailyInput) dailyInput.addEventListener('input', updateAnalysis);
    if(customerValue) customerValue.addEventListener('input', updateAnalysis);
    updateAnalysis();
});
