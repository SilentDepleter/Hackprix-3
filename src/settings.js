import { getUser, getSettings, updateSettings } from './storage.js';

document.addEventListener('DOMContentLoaded', async () => {
    const user = await getUser();
    const settings = await getSettings();
    
    // Elements
    const budgetInput = document.getElementById('settings-budget');
    const currencyInput = document.getElementById('settings-currency');
    const startInput = document.getElementById('settings-start');
    const endInput = document.getElementById('settings-end');
    const saveBtn = document.getElementById('save-settings-btn');
    const currencyAddon = document.getElementById('currency-addon');
    
    // Initializer
    budgetInput.value = user.monthlyBudget;
    currencyInput.value = settings.currency || '₹';
    if (settings.semesterStart) startInput.value = settings.semesterStart;
    if (settings.semesterEnd) endInput.value = settings.semesterEnd;
    currencyAddon.textContent = settings.currency || '₹';
    
    // Dynamic currency addon
    currencyInput.addEventListener('input', (e) => {
        currencyAddon.textContent = e.target.value || '₹';
    });

    // Save
    saveBtn.addEventListener('click', async () => {
        const newBudget = parseFloat(budgetInput.value);
        if (isNaN(newBudget) || newBudget <= 0) {
            budgetInput.classList.add('border-error', 'animate-pulse');
            setTimeout(() => budgetInput.classList.remove('border-error', 'animate-pulse'), 1000);
            return;
        }
        
        // Settings update
        const newSettings = {
            currency: currencyInput.value || '₹',
            semesterStart: startInput.value,
            semesterEnd: endInput.value
        };
        await updateSettings(newSettings);
        
        // Since budget is on user object historically, we need to update user too to not break things
        const { updateUser } = await import('./storage.js');
        await updateUser({ monthlyBudget: newBudget });
        
        // Success feedback
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = `<span>Saved!</span><span class="material-symbols-outlined text-lg">done_all</span>`;
        saveBtn.classList.remove('bg-white', 'text-black');
        saveBtn.classList.add('bg-green-400', 'text-black', 'border-transparent');
        
        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.classList.remove('bg-green-400', 'border-transparent');
            saveBtn.classList.add('bg-white', 'text-black');
        }, 2000);
    });
});
