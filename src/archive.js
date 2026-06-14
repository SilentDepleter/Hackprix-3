import { getExpenses } from './storage.js';
import { formatCurrency, formatDate, formatTime, CATEGORIES } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  const expenses = await getExpenses();
  const archiveContainer = document.getElementById('archive-list');
  
  if (!archiveContainer) return;

  if (expenses.length === 0) {
    archiveContainer.innerHTML = `<p class="text-on-surface-variant text-sm py-4">No expenses found in the archive.</p>`;
    return;
  }

  // Sort all expenses by date descending
  const allSortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Group by month and year (e.g., "April 2026")
  const groupedExpenses = allSortedExpenses.reduce((groups, expense) => {
    const date = new Date(expense.date);
    const monthYear = date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    if (!groups[monthYear]) {
      groups[monthYear] = [];
    }
    groups[monthYear].push(expense);
    return groups;
  }, {});

  // Generate HTML for each month
  const html = Object.keys(groupedExpenses).map(monthYear => {
    const monthExpenses = groupedExpenses[monthYear];
    
    const monthHtml = monthExpenses.map(expense => {
      const cat = CATEGORIES[expense.category] || CATEGORIES['food'];
      return `
        <div class="flex items-center justify-between p-4 bg-surface-container rounded-xl group hover:bg-surface-bright hover:shadow-lg transition-all cursor-pointer">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-${cat.color} shadow-[0_0_15px_rgba(243,130,255,0.1)] group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined">${cat.icon}</span>
            </div>
            <div>
              <h4 class="text-base font-medium text-on-surface">${expense.description}</h4>
              <p class="text-[11px] text-on-surface-variant uppercase tracking-widest mt-1">${cat.label} • ${formatDate(expense.date)} ${formatTime(expense.date)}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-headline font-bold text-${cat.color} group-hover:scale-110 transition-transform origin-right">-${formatCurrency(expense.amount)}</p>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="space-y-4">
        <h4 class="font-label text-sm uppercase tracking-[0.2em] text-on-surface-variant border-b border-outline-variant/10 pb-2">${monthYear}</h4>
        <div class="space-y-4">
          ${monthHtml}
        </div>
      </div>
    `;
  }).join('');

  archiveContainer.innerHTML = html;
});
