import { getUser, getExpenses, updateUser } from './storage.js';
import { getRemaining, getDailyAverage, getDaysUntilBroke, getStreak, getBudgetUsedPercent } from './analytics.js';
import { formatCurrency, formatTime, CATEGORIES } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  const user = await getUser();
  const expenses = await getExpenses();
  
  // Set welcome name and campus
  const nameEl = document.getElementById('welcome-name');
  if (nameEl) nameEl.textContent = `Welcome back, ${user.name}`;
  
  const campusText = document.getElementById('campus-text');
  const campusDisplay = document.getElementById('campus-display');
  const mapCampusText = document.getElementById('map-campus-text');
  const mapEditBtn = document.getElementById('map-edit-btn');
  
  if (campusText && user.location) campusText.textContent = user.location;
  if (mapCampusText && user.location) mapCampusText.textContent = user.location;
  
  // Dashboard Editable Campus
  if (campusDisplay) {
    campusDisplay.addEventListener('click', () => {
      window.location.href = 'profile.html';
    });
  }
  
  if (mapEditBtn) {
      mapEditBtn.addEventListener('click', () => {
          window.location.href = 'profile.html';
      });
  }
  
  // Notifications logic
  const notifBtn = document.getElementById('notification-btn');
  const notifDropdown = document.getElementById('notification-dropdown');
  const notifList = document.getElementById('notification-list');
  const clearBtn = document.getElementById('clear-notifications-btn');
  
  if (notifBtn && notifDropdown) {
      notifBtn.addEventListener('click', () => {
          notifDropdown.classList.toggle('hidden');
      });
      // Click outside to close
      document.addEventListener('click', (e) => {
          if (!notifBtn.contains(e.target) && !notifDropdown.contains(e.target)) {
              notifDropdown.classList.add('hidden');
          }
      });
  }
  
  // Compute some basic notifications based on analytics
  function renderNotifications() {
      if (!notifList) return;
      try {
          const budget = user.monthlyBudget;
          const remaining = getRemaining(budget, expenses);
          const usedPct = getBudgetUsedPercent(budget, expenses);
          
          let notifs = [];
          if (usedPct >= 90) {
              notifs.push({ icon: 'warning', text: `Critical: You have used ${usedPct}% of your budget!`, color: 'error' });
          } else if (usedPct >= 75) {
              notifs.push({ icon: 'info', text: `Warning: You are approaching your budget limit (${formatCurrency(remaining)} left).`, color: 'primary' });
          }
          
          const today = new Date().toDateString();
          const spentToday = expenses.filter(e => new Date(e.date).toDateString() === today);
          if (spentToday.length === 0) {
              notifs.push({ icon: 'savings', text: `Great job! You haven't tracked any spending today.`, color: 'tertiary' });
          }
          
          if (notifs.length === 0) {
              notifs.push({ icon: 'check_circle', text: `Everything looks good! You're on track.`, color: 'zinc-400' });
          }
          
          notifList.innerHTML = notifs.map(n => `
              <div class="p-3 bg-surface-container-high rounded-xl text-xs text-zinc-300 flex gap-3 items-center border-l-2 border-${n.color}">
                  <span class="material-symbols-outlined text-${n.color} text-lg">${n.icon}</span>
                  <p>${n.text}</p>
              </div>
          `).join('');
      } catch (err) {
          console.error("Notifications render error:", err);
      }
  }
  renderNotifications();
  
  if(clearBtn) {
      clearBtn.addEventListener('click', () => {
          notifList.innerHTML = `<div class="p-3 bg-surface-container-high rounded-xl text-xs text-zinc-500 italic text-center">No new notifications</div>`;
          // clear visually from ping
          notifBtn.querySelector('.animate-ping')?.remove();
      });
  }
  
  // Computations
  const budget = user.monthlyBudget;
  const remaining = getRemaining(budget, expenses);
  const dailyAverage = getDailyAverage(expenses);
  const daysUntilBroke = getDaysUntilBroke(remaining, dailyAverage);
  const streak = getStreak(expenses, budget / 30);
  const percentUsed = getBudgetUsedPercent(budget, expenses);
  
  // Update DOM metrics
  const daysEl = document.getElementById('days-until-broke');
  if (daysEl) daysEl.textContent = daysUntilBroke;
  
  const ringPctEl = document.getElementById('hero-ring-percent');
  if (ringPctEl) ringPctEl.textContent = `${percentUsed}%`;
  
  const ringProgressEl = document.getElementById('hero-ring-progress');
  if (ringProgressEl) ringProgressEl.style.strokeDashoffset = 628.3 * (1 - percentUsed/100);
  
  const remEl = document.getElementById('remaining-amount');
  if (remEl) remEl.textContent = formatCurrency(remaining);
  
  const budgEl = document.getElementById('monthly-budget');
  if (budgEl) budgEl.textContent = formatCurrency(budget);
  
  const avgEl = document.getElementById('daily-average');
  if (avgEl) avgEl.textContent = formatCurrency(dailyAverage);
  
  const streakEl = document.getElementById('streak-count');
  if (streakEl) streakEl.textContent = `${streak} days`;
  
  // Timeline rendering logic with Archive toggle
  const timelineContainer = document.getElementById('timeline-list');
  const seeArchiveBtn = document.getElementById('see-archive-btn');
  let showingArchive = false;
  
  const allSortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  function renderTimeline() {
    if (!timelineContainer) return;
    try {
        const expensesToRender = allSortedExpenses.slice(0, 3);
        
        if (expensesToRender.length === 0) {
        timelineContainer.innerHTML = `<p class="text-on-surface-variant text-sm py-4">No recent expenses. Time to add one!</p>`;
        } else {
        timelineContainer.innerHTML = expensesToRender.map(expense => {
            const cat = CATEGORIES[expense.category] || CATEGORIES['food'];
            const amountStr = expense.amount ? Math.abs(expense.amount) : 0;
            return `
            <div class="flex items-center justify-between p-4 bg-surface-container rounded-xl group hover:bg-surface-bright hover:shadow-lg transition-all cursor-pointer">
                <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <span class="material-symbols-outlined" style="color: var(--tw-colors-${cat.color}, #f382ff);">${cat.icon}</span>
                </div>
                <div>
                    <h4 class="text-base font-medium text-on-surface">${expense.description || 'Expense'}</h4>
                    <p class="text-[11px] text-on-surface-variant uppercase tracking-widest mt-1">${cat.label} • ${formatTime(expense.date)}</p>
                </div>
                </div>
                <div class="text-right">
                <p class="font-headline font-bold group-hover:scale-110 transition-transform origin-right" style="color: var(--tw-colors-${cat.color}, #f382ff);">-${formatCurrency(amountStr)}</p>
                </div>
            </div>
            `;
        }).join('');
        }
    } catch (err) {
        console.error("Timeline render error:", err);
    }
  }
  
  if (seeArchiveBtn) {
      seeArchiveBtn.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = 'archive.html';
      });
  }
  
  renderTimeline();
});
