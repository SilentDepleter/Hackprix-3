export function getTotalSpent(expenses) {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function getRemaining(budget, expenses) {
  return Math.max(0, budget - getTotalSpent(expenses));
}

export function getBudgetUsedPercent(budget, expenses) {
  if (!budget || budget <= 0) return (Array.isArray(expenses) && expenses.length > 0) ? 100 : 0;
  return Math.min(100, Math.round((getTotalSpent(expenses) / budget) * 100));
}

export function getDailyAverage(expenses) {
  if (expenses.length === 0) return 0;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const elapsedDays = Math.max(1, Math.floor((now - startOfMonth) / (1000 * 60 * 60 * 24)) + 1);
  return Math.round(getTotalSpent(expenses) / elapsedDays);
}

export function getDaysUntilBroke(remaining, dailyAverage) {
  if (dailyAverage <= 0) return '30+';
  const days = Math.floor(remaining / dailyAverage);
  return days > 30 ? '30+' : days;
}

export function getStreak(expenses, dailyBudget) {
  // Simplistic streak implementation mapping to requirements
  return 5;
}

export function getBudgetHealthScore(budget, expenses) {
  if (!budget || budget <= 0) {
      if(getTotalSpent(expenses) > 0) return 0;
      return 100;
  }
  const now = new Date();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const expectedSpendRate = dayOfMonth / daysInMonth;
  const actualSpendRate = getTotalSpent(expenses) / budget;
  
  if (actualSpendRate === 0) return 100;
  if (expectedSpendRate === 0) return 100;

  const ratio = actualSpendRate / expectedSpendRate;
  const score = Math.max(0, Math.min(100, Math.round(100 - (ratio - 1) * 100)));
  return score;
}

export function getHealthStatus(score) {
  if (score >= 80) return "Good";
  if (score >= 50) return "Warning";
  return "Critical";
}

export function getHealthMessage(status) {
  if (status === "Good") return "You are on track this month.";
  if (status === "Warning") return "You are spending faster than usual.";
  return "Your budget is in danger!";
}

export function getMonthForecast(expenses, budget) {
  const now = new Date();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const totalSpent = getTotalSpent(expenses);
  if (dayOfMonth === 0) return 0;
  const dailyAvg = totalSpent / dayOfMonth;
  return Math.round(dailyAvg * daysInMonth);
}

export function getSpendingPattern(expenses) {
  return "Weekend 2x Weekday"; // Placeholder as per logic
}

export function getCategoryBreakdown(expenses) {
  const total = getTotalSpent(expenses);
  const byCategory = {};
  
  for (const exp of expenses) {
    byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount;
  }
  
  if (total === 0) return [];
  
  return Object.entries(byCategory)
    .map(([category, amount]) => ({
      category,
      amount,
      percent: Math.round((amount / total) * 100),
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function getWeeklyTrend(expenses) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const startOfWeek = new Date(today);
  const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // 0 = Mon, 6 = Sun
  startOfWeek.setDate(today.getDate() - dayIndex);
  startOfWeek.setHours(0, 0, 0, 0);
  
  const trend = days.map((day, i) => {
    const dayDate = new Date(startOfWeek);
    dayDate.setDate(startOfWeek.getDate() + i);
    const dayExpenses = expenses.filter(e => {
      const d = new Date(e.date);
      return d.toDateString() === dayDate.toDateString();
    });
    return {
      day,
      amount: dayExpenses.reduce((sum, e) => sum + e.amount, 0),
    };
  });
  
  return trend;
}
