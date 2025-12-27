/**
 * Assistune Modern AI Automation - Core Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initROI();
    initContactForm();
});

/**
 * Theme Management (Dark/Light Mode)
 */
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.innerText = savedTheme === 'dark' ? '🌙' : '☀️';
    }
}

function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        themeIcon.innerText = isDark ? '🌙' : '☀️';
    }
}

/**
 * FAQ Accordion Toggle
 */
function toggleFaq(element) {
    const isActive = element.classList.contains('active');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    // If the clicked one wasn't active, open it
    if (!isActive) {
        element.classList.add('active');
    }
}

/**
 * ROI Calculator Logic (5.312.500 Target Math)
 */
function initROI() {
    const dailyInput = document.getElementById('dailyTotal');
    const rangeValue = document.getElementById('rangeValue');
    const customerValue = document.getElementById('customerValue');
    
    const yearlyLossDisplay = document.getElementById('yearlyLoss');
    const aiRecoveryDisplay = document.getElementById('aiRecovery');
    const lossPercentDisplay = document.getElementById('lossPercent');
    const recoveryPercentDisplay = document.getElementById('recoveryPercent');
    const recoveryBar = document.getElementById('recoveryBar');

    if (!dailyInput || !customerValue) return;

    function updateAnalysis() {
        const total = parseInt(dailyInput.value); 
        const val = parseInt(customerValue.value) || 0;
        rangeValue.innerText = total.toLocaleString('tr-TR');

        // Logic: 25% Miss Rate, 12 Months
        const monthlyLoss = total * 0.25 * val;
        const yearlyLoss = monthlyLoss * 12;
        const monthlyRecovery = monthlyLoss * 0.85; // 85% AI Recovery
        const aiRecoveryYearly = monthlyRecovery * 10; // 10-month conservative cycle
        
        yearlyLossDisplay.innerText = yearlyLoss.toLocaleString('tr-TR');
        aiRecoveryDisplay.innerText = aiRecoveryYearly.toLocaleString('tr-TR');
        lossPercentDisplay.innerText = "₺" + monthlyLoss.toLocaleString('tr-TR');
        recoveryPercentDisplay.innerText = "₺" + monthlyRecovery.toLocaleString('tr-TR');

        if (recoveryBar) {
            setTimeout(() => { recoveryBar.style.width = "85%"; }, 100);
        }
    }

    dailyInput.addEventListener('input', updateAnalysis);
    customerValue.addEventListener('input', updateAnalysis);
    updateAnalysis();
}

/**
 * Contact Form & n8n Webhook Submission
 */
function initContactForm() {
    const form = document.getElementById('assistuneContactForm');
    const btn = document.getElementById('submitBtn');
    const loader = document.getElementById('loader');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const WEBHOOK_URL = 'https://n8n.bosphorusspace.com/webhook-test/2eb11a4c-3572-4283-9101-287730632243';
        
        try {
            btn.disabled = true;
            if (loader) loader.classList.remove('hidden');
            
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
            } else { throw new Error('Network error'); }
        } catch (error) {
            console.error(error);
            showToast('❌ Hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            btn.disabled = false;
            if (loader) loader.classList.add('hidden');
        }
    });
}

/**
 * Toast Notification System
 */
function showToast(msg) {
    const notification = document.getElementById('notification');
    const notifMsg = document.getElementById('notif-msg');
    if (notification && notifMsg) {
        notifMsg.innerText = msg;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 5000);
    }
}
