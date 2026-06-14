# Backend Implementation Plan

This is the full plan for wiring JavaScript functionality into Aurora's existing HTML frontend. All UI is already built — this work is about making it **alive**.

---

## Storage Strategy

### Recommended: `localStorage`

For a student expense tracker that runs locally, `localStorage` is the simplest and most appropriate storage:

```javascript
// All data lives under one key
const STORAGE_KEY = 'aurora_data';

// Read
const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

// Write
localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
```

### Data Schema

```javascript
const auroraData = {
  user: {
    name: "User",                    // Display name
    monthlyBudget: 16800,            // Monthly budget in ₹
    location: "Mumbai University",   // Campus label
  },
  expenses: [
    {
      id: "exp_1713200000000",       // Unique ID (timestamp-based)
      amount: 60,                    // Amount in ₹ (always positive)
      category: "food",             // One of: food, transport, academics, subscriptions, social
      description: "Canteen Lunch",  // User-entered context
      date: "2026-04-16T12:30:00",  // ISO 8601 datetime
      receipt: null,                 // Base64 image string or null
      wallet: "main",               // Wallet identifier
    },
    // ... more expenses
  ],
  settings: {
    currency: "₹",
    semesterStart: "2026-01-15",
    semesterEnd: "2026-05-15",
  }
};
```

### Category Definitions

```javascript
const CATEGORIES = {
  food:          { label: "Food & Canteen",  icon: "restaurant",            color: "primary"   },
  transport:     { label: "Transport",       icon: "directions_car",        color: "tertiary"   },
  academics:     { label: "Academics",       icon: "print",                 color: "secondary"  },
  subscriptions: { label: "Subscriptions",   icon: "subscriptions",         color: "primary"    },
  social:        { label: "Social Outings",  icon: "diversity_3",           color: "error"      },
};
```

---

## Module Architecture

Create these files:

```
aurora/
├── src/
│   ├── storage.js        # localStorage read/write, data access layer
│   ├── expenses.js       # Expense CRUD operations
│   ├── analytics.js      # All computation functions (averages, projections, etc.)
│   ├── dashboard.js      # DOM wiring for index.html
│   ├── analytics-ui.js   # DOM wiring for analytics.html
│   └── add-expense.js    # DOM wiring for add_expense.html
```

### How to Connect Modules to Pages

Each HTML page adds a `<script type="module">` tag at the end of `<body>`:

```html
<!-- In index.html, before </body> -->
<script type="module" src="/src/dashboard.js"></script>

<!-- In analytics.html, before </body> -->
<script type="module" src="/src/analytics-ui.js"></script>

<!-- In add_expense.html, before </body> -->
<script type="module" src="/src/add-expense.js"></script>
```

---

## Module 1: `storage.js` — Data Access Layer

```javascript
const STORAGE_KEY = 'aurora_data';

const DEFAULT_DATA = {
  user: { name: "User", monthlyBudget: 16800, location: "Mumbai University" },
  expenses: [],
  settings: { currency: "₹", semesterStart: "2026-01-15", semesterEnd: "2026-05-15" },
};

export function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    saveData(DEFAULT_DATA);
    return DEFAULT_DATA;
  }
  return JSON.parse(raw);
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getExpenses() {
  return loadData().expenses;
}

export function getUser() {
  return loadData().user;
}

export function getSettings() {
  return loadData().settings;
}
```

---

## Module 2: `expenses.js` — CRUD Operations

### Functions to Build

| Function | Signature | Purpose |
|----------|-----------|---------|
| `addExpense` | `(amount, category, description, date, receipt) → expense` | Create a new expense, save to storage, return it |
| `deleteExpense` | `(expenseId) → boolean` | Remove expense by ID |
| `editExpense` | `(expenseId, updates) → expense` | Update fields on an existing expense |
| `getExpensesByDate` | `(startDate, endDate) → expense[]` | Filter expenses within a date range |
| `getExpensesByCategory` | `(category) → expense[]` | Filter by category |
| `getRecentExpenses` | `(count) → expense[]` | Get the N most recent expenses |

### `addExpense` Implementation Guide

```javascript
import { loadData, saveData } from './storage.js';

export function addExpense(amount, category, description, date, receipt = null) {
  const data = loadData();
  const expense = {
    id: `exp_${Date.now()}`,
    amount: parseFloat(amount),
    category,
    description,
    date: date || new Date().toISOString(),
    receipt,
    wallet: "main",
  };
  data.expenses.push(expense);
  saveData(data);
  return expense;
}
```

---

## Module 3: `analytics.js` — Computation Engine

### Functions to Build

| Function | Returns | Used On |
|----------|---------|---------|
| `getTotalSpent(expenses)` | `number` | Dashboard, Analytics |
| `getRemaining(budget, expenses)` | `number` | Dashboard |
| `getBudgetUsedPercent(budget, expenses)` | `number (0–100)` | Dashboard (ring) |
| `getDailyAverage(expenses, daysElapsed)` | `number` | Dashboard |
| `getDaysUntilBroke(remaining, dailyAverage)` | `number` | Dashboard (hero) |
| `getStreak(expenses, dailyBudget)` | `number` | Dashboard |
| `getBudgetHealthScore(budget, expenses)` | `number (0–100)` | Analytics (ring) |
| `getHealthStatus(score)` | `"Good"` / `"Warning"` / `"Critical"` | Analytics |
| `getMonthForecast(expenses)` | `number` | Analytics |
| `getSpendingPattern(expenses)` | `string` | Analytics |
| `getCategoryBreakdown(expenses)` | `{category, percent}[]` | Analytics |
| `getWeeklyTrend(expenses)` | `{day, amount}[7]` | Analytics |

### Key Computation Details

#### Days Until Broke
```javascript
export function getDaysUntilBroke(remaining, dailyAverage) {
  if (dailyAverage <= 0) return Infinity;
  return Math.floor(remaining / dailyAverage);
}
```

#### Budget Health Score
```javascript
export function getBudgetHealthScore(budget, expenses) {
  const now = new Date();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const expectedSpendRate = dayOfMonth / daysInMonth;  // How much of the month has passed
  const actualSpendRate = getTotalSpent(expenses) / budget;  // How much budget is used
  
  // If you've used less than expected, score is high
  const ratio = actualSpendRate / expectedSpendRate;
  const score = Math.max(0, Math.min(100, Math.round(100 - (ratio - 1) * 100)));
  return score;
}
```

#### Category Breakdown
```javascript
export function getCategoryBreakdown(expenses) {
  const total = getTotalSpent(expenses);
  const byCategory = {};
  
  for (const exp of expenses) {
    byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount;
  }
  
  return Object.entries(byCategory)
    .map(([category, amount]) => ({
      category,
      amount,
      percent: Math.round((amount / total) * 100),
    }))
    .sort((a, b) => b.amount - a.amount);
}
```

#### Weekly Trend
```javascript
export function getWeeklyTrend(expenses) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
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
```

---

## Module 4: `dashboard.js` — DOM Wiring for index.html

### On Page Load (`DOMContentLoaded`)

1. Load data from storage
2. Compute all dashboard metrics
3. Update these DOM elements:

| What to Update | How to Find the Element | What to Set |
|----------------|------------------------|-------------|
| Welcome name | Find `h2` inside `header` containing "Welcome" | Replace `User` with actual `user.name` |
| Days Until Broke number | The `div` with class containing `text-[7rem]` | `.textContent = computedDays` |
| Progress ring offset | The second `<circle>` in the hero SVG | `stroke-dashoffset` = `628.3 * (1 - percentUsed/100)` |
| Ring center percentage | The `span` with `text-3xl` inside the ring | `.textContent = percentUsed + '%'` |
| Remaining amount | The `p` with class `text-tertiary` in bottom bar | `.textContent = formatCurrency(remaining)` |
| Monthly budget | The `p` in the right side of bottom bar | `.textContent = formatCurrency(budget)` |
| Daily average | The `p` with `text-4xl` in the first stat card | `.textContent = formatCurrency(dailyAvg)` |
| Streak | The `p` with `text-4xl` in the second stat card | `.textContent = streak + ' days'` |
| Timeline expenses | The `div.space-y-4` inside the timeline section | Clear and rebuild with `renderExpenseItem()` HTML |

### Expense Item Template

```javascript
function renderExpenseItem(expense) {
  const cat = CATEGORIES[expense.category];
  return `
    <div class="flex items-center justify-between p-4 bg-surface-container rounded-xl group hover:bg-surface-bright hover:shadow-lg transition-all cursor-pointer" data-expense-id="${expense.id}">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-${cat.color} shadow-[0_0_15px_rgba(243,130,255,0.1)] group-hover:scale-110 transition-transform">
          <span class="material-symbols-outlined">${cat.icon}</span>
        </div>
        <div>
          <h4 class="text-base font-medium text-on-surface">${expense.description}</h4>
          <p class="text-[11px] text-on-surface-variant uppercase tracking-widest mt-1">${cat.label} • ${formatTime(expense.date)}</p>
        </div>
      </div>
      <div class="text-right">
        <p class="font-headline font-bold text-${cat.color} group-hover:scale-110 transition-transform origin-right">-₹${expense.amount}</p>
      </div>
    </div>
  `;
}
```

---

## Module 5: `analytics-ui.js` — DOM Wiring for analytics.html

### On Page Load

1. Load data, filter expenses to current month
2. Compute analytics metrics
3. Update DOM elements:

| What to Update | What to Set |
|----------------|-------------|
| Budget health score (`78`) | Computed score |
| Health ring SVG offset | `879.6 * (1 - score/100)` |
| Status text (`"Good"`) | `getHealthStatus(score)` |
| Status message | Dynamic message based on status |
| Month forecast (`₹6,800`) | Projected monthly total |
| Spending pattern | Analyzed pattern string |
| Breakdown categories + percentages | Dynamic list from `getCategoryBreakdown()` |
| Donut chart `stroke-dasharray` | Compute from top category percentage |
| Weekly trend bars | Set each bar's height as `(dayAmount / maxAmount * 100)%` |
| Weekly trend tooltips | Set each tooltip text to `₹{amount}` |

### Time Range Toggle

The 3 buttons in the header (Weekly / Monthly / Semester) need click handlers:
- On click, add active class to clicked button, remove from others
- Re-filter expenses based on selected range
- Recalculate and re-render all metrics

---

## Module 6: `add-expense.js` — DOM Wiring for add_expense.html

### Behavior to Implement

#### 1. Amount Input
- On input, format the value with ₹ prefix
- Only allow numeric input (and decimal point)
- Strip non-numeric characters before storing

#### 2. Category Selection
- On category button click:
  - Remove active styles from all buttons
  - Add active styles to clicked button
  - Store selected category in a variable
- Active style: `bg-[#d946ef] text-on-primary-fixed font-bold neon-glow-primary shadow-[0_0_15px_rgba(217,70,239,0.3)]`
- Inactive style: `bg-surface-container-low text-zinc-400 font-medium border border-outline-variant/20`

#### 3. Date Display
- On page load, set the date button text to today's formatted date (e.g., "Today, 16 Apr")
- Optionally: on click, show a native date picker or custom date selector

#### 4. Receipt Upload
- On click of the receipt section, open a file input (`<input type="file" accept="image/*">`)
- Read the file as Base64 using `FileReader`
- Show a thumbnail preview in the receipt section
- Store the Base64 string in the expense data

#### 5. Save Button
- On click:
  1. **Validate**: amount > 0, category selected
  2. **Collect**: amount, category, description, date, receipt
  3. **Call**: `addExpense(amount, category, description, date, receipt)`
  4. **Redirect**: `window.location.href = 'index.html'`
  5. **Error handling**: Show validation errors if inputs are missing (highlight the relevant section)

---

## Implementation Order (Recommended)

| Phase | What | Why First |
|-------|------|-----------|
| 1 | `storage.js` | Everything depends on data access |
| 2 | `expenses.js` | CRUD operations needed before UI can work |
| 3 | `add-expense.js` | Users need to be able to ADD data before anything can DISPLAY |
| 4 | `analytics.js` | Computation functions used by both pages |
| 5 | `dashboard.js` | Wire the main dashboard to live data |
| 6 | `analytics-ui.js` | Wire the analytics page to live data |

---

## Utility Functions Needed

```javascript
// Format number as currency
export function formatCurrency(amount) {
  return '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Format ISO date to display time like "12:30 PM"
export function formatTime(isoDate) {
  return new Date(isoDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// Format ISO date to "Today, 16 Apr" or "Yesterday" or "16 Apr"
export function formatDate(isoDate) {
  const d = new Date(isoDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// Generate unique ID
export function generateId() {
  return `exp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
```

---

## SVG Ring Math Reference

Both the dashboard and analytics pages use SVG `<circle>` elements for progress rings. Here's how the math works:

```
circumference = 2 * π * radius

For dashboard ring:  radius = 100, circumference = 628.3
For analytics ring:  radius = 140, circumference = 879.6

To show X% filled:
  stroke-dasharray = circumference
  stroke-dashoffset = circumference * (1 - X/100)

Example: 75% filled with radius 100:
  dasharray = 628.3
  dashoffset = 628.3 * (1 - 0.75) = 157.07
```
