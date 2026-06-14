import { getUser, getExpenses } from './storage.js';
import { formatCurrency, CATEGORIES } from './utils.js';
import { 
  getBudgetHealthScore, 
  getHealthStatus, 
  getHealthMessage, 
  getMonthForecast, 
  getSpendingPattern, 
  getCategoryBreakdown, 
  getWeeklyTrend
} from './analytics.js';

document.addEventListener('DOMContentLoaded', async () => {
    const user = await getUser();
    const allExpenses = await getExpenses();
    const budget = user.monthlyBudget;
    
    const now = new Date();
    const currentMonthExpenses = allExpenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    // Insights and score update
    const score = getBudgetHealthScore(budget, currentMonthExpenses);
    const status = getHealthStatus(score);
    
    document.getElementById('health-score').textContent = score;
    document.getElementById('health-ring-progress').style.strokeDashoffset = 879.6 * (1 - score / 100);
    document.getElementById('health-status').textContent = status;
    document.getElementById('health-message').textContent = getHealthMessage(status);
    
    document.getElementById('month-forecast').textContent = formatCurrency(getMonthForecast(currentMonthExpenses, budget));
    document.getElementById('spending-pattern').textContent = getSpendingPattern(allExpenses);
    
    // Breakdown
    const breakdown = getCategoryBreakdown(currentMonthExpenses);
    const listContainer = document.getElementById('breakdown-list');
    
    if (breakdown.length === 0) {
        listContainer.innerHTML = `<p class="text-slate-400 font-label text-sm">No expenses yet this month.</p>`;
        document.getElementById('breakdown-ring').setAttribute('stroke-dasharray', `100, 100`);
    } else {
        const topCategoryPercent = breakdown[0].percent;
        document.getElementById('breakdown-ring').setAttribute('stroke-dasharray', `${topCategoryPercent}, 100`);
        
        listContainer.innerHTML = breakdown.map(catData => {
            const cat = CATEGORIES[catData.category] || CATEGORIES['food'];
            return `
            <div class="flex justify-between items-center bg-surface-container-lowest p-3 rounded-xl border border-transparent hover:border-${cat.color}/20 transition-colors">
                <span class="text-slate-400 font-label text-sm">${cat.label}</span> 
                <span class="font-bold text-on-surface text-lg">${catData.percent}%</span>
            </div>
            `;
        }).join('');
    }
    
    // Trend bars
    const trendContainer = document.getElementById('trend-bars');
    const trends = getWeeklyTrend(allExpenses);
    const maxAmount = Math.max(...trends.map(t => t.amount), 1);
    
    trendContainer.innerHTML = trends.map(trend => {
        const heightPct = Math.max(10, Math.min(100, (trend.amount / maxAmount) * 100)); // Minimum 10% height to be visible
        const isMax = trend.amount === maxAmount && trend.amount > 0;
        
        const baseClasses = isMax 
            ? "w-4 bg-primary neon-glow-primary rounded-t-full shadow-[0_0_15px_rgba(217,70,239,0.5)] cursor-pointer group-hover:animate-pulse relative group/bar"
            : "w-4 bg-primary/20 hover:bg-primary/50 transition-colors rounded-t-full cursor-pointer relative group/bar";
            
        return `
            <div class="${baseClasses}" style="height: ${heightPct}%">
                <div class="absolute -top-8 left-1/2 -translate-x-1/2 ${isMax ? 'bg-primary text-black' : 'bg-surface-bright text-white'} font-bold px-2 py-1 rounded text-[10px] font-label opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">${formatCurrency(trend.amount)}</div>
            </div>
        `;
    }).join('');
});
