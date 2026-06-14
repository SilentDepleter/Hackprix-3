import { getUser, getExpenses } from './storage.js';
import { getRemaining } from './analytics.js';
import { formatCurrency, formatTime, CATEGORIES } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
    const user = await getUser();
    const expenses = await getExpenses();
    
    // Wallet UI elements
    const balanceEl = document.getElementById('wallet-balance');
    const budgetEl = document.getElementById('wallet-budget');
    const ledgerEl = document.getElementById('wallet-ledger');
    
    // Main Wallet logic
    const budget = user.monthlyBudget;
    const remaining = getRemaining(budget, expenses);
    
    balanceEl.textContent = formatCurrency(remaining);
    budgetEl.textContent = formatCurrency(budget);
    
    // Render Ledger (all expenses sorted)
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (sortedExpenses.length === 0) {
        ledgerEl.innerHTML = `<p class="text-zinc-500 font-label py-4 text-center">No transactions available.</p>`;
    } else {
        ledgerEl.innerHTML = sortedExpenses.map(expense => {
            const cat = CATEGORIES[expense.category] || CATEGORIES['food'];
            return `
                <div class="flex items-center justify-between p-4 bg-surface-container rounded-xl group hover:bg-surface-bright hover:shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all cursor-pointer border border-transparent hover:border-${cat.color}/30" data-expense-id="${expense.id}">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-${cat.color} group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,0,0,0.1)] group-hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                      <span class="material-symbols-outlined">${cat.icon}</span>
                    </div>
                    <div>
                      <h4 class="text-base font-medium text-on-surface">${expense.description}</h4>
                      <p class="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">${cat.label} • ${formatTime(expense.date)}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-headline font-bold text-${cat.color} group-hover:scale-105 transition-transform origin-right">-${formatCurrency(expense.amount)}</p>
                  </div>
                </div>
            `;
        }).join('');
    }
});
