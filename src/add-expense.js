import { addExpense } from './expenses.js';
import { formatDate } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const dateDisplay = document.getElementById('date-display');
    if (dateDisplay) {
        dateDisplay.textContent = formatDate(new Date().toISOString());
    }
    
    let selectedCategory = 'food';
    const ACTIVE_CLASS = ['bg-[#d946ef]', 'text-on-primary-fixed', 'font-bold', 'neon-glow-primary', 'shadow-[0_0_15px_rgba(217,70,239,0.3)]', 'hover:scale-105'];
    const INACTIVE_CLASS = ['bg-surface-container-low', 'text-zinc-400', 'font-medium', 'hover:border-[#d946ef]/40'];
    
    const categoryButtons = document.querySelectorAll('#category-buttons button');
    
    function resetCategories() {
        categoryButtons.forEach(btn => {
            btn.classList.add(...INACTIVE_CLASS, 'border', 'border-outline-variant/20');
            btn.classList.remove(...ACTIVE_CLASS);
        });
    }
    
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            resetCategories();
            btn.classList.remove(...INACTIVE_CLASS, 'border', 'border-outline-variant/20');
            btn.classList.add(...ACTIVE_CLASS);
            selectedCategory = btn.getAttribute('data-category');
        });
    });

    const amountInput = document.getElementById('expense-amount');
    amountInput.addEventListener('input', (e) => {
        // Only keep numbers and dot
        let val = e.target.value.replace(/[^0-9.]/g, '');
        // Optional: limit decimal places
        if (val.includes('.')) {
            let parts = val.split('.');
            val = parts[0] + '.' + parts[1].substring(0, 2);
        }
        e.target.value = val;
    });

    let receiptBase64 = null;
    const receiptSection = document.getElementById('receipt-section');
    const receiptInput = document.getElementById('receipt-input');
    
    if (receiptSection && receiptInput) {
        receiptSection.addEventListener('click', () => receiptInput.click());
        receiptInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    receiptBase64 = event.target.result;
                    receiptSection.innerHTML = `
                        <div class="w-16 h-16 mx-auto rounded-full bg-[#d946ef]/20 flex items-center justify-center text-[#d946ef] mb-4">
                            <span class="material-symbols-outlined text-3xl">check</span>
                        </div>
                        <p class="font-medium text-[#d946ef]">Image attached</p>
                        <p class="text-xs text-zinc-500 font-label mt-1">Click to replace</p>
                        <input type="file" id="receipt-input-replacement" accept="image/*" class="hidden" />
                    `;
                    // Wire up the new input explicitly
                    const newFileInput = document.getElementById('receipt-input-replacement');
                    receiptSection.onclick = () => newFileInput.click();
                    newFileInput.onchange = receiptInput.onchange;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    document.getElementById('save-expense-btn').addEventListener('click', async () => {
        const amountVal = parseFloat(amountInput.value);
        const descInput = document.getElementById('expense-description').value;
        const date = new Date().toISOString();
        
        if (isNaN(amountVal) || amountVal <= 0) {
            amountInput.focus();
            return;
        }
        
        await addExpense(amountVal, selectedCategory, descInput, date, receiptBase64);
        window.location.href = 'index.html'; // redirect
    });
});
