# Element-to-Function ID Map

This document maps every interactive or data-driven HTML element to the JavaScript function or action it needs. Since the current HTML does **not have `id` attributes** on most elements, this guide tells you how to **find each element** via DOM queries and what **IDs you should add** to make wiring easier.

> **Recommendation**: Before writing any JS logic, do a first pass adding `id` attributes to every element listed below. This makes DOM wiring clean and maintainable.

---

## index.html — Dashboard

### IDs to Add

```html
<!-- Header -->
<h2 id="welcome-name">Welcome back, User</h2>
<button id="notification-btn">...</button>

<!-- Hero Card -->
<div id="days-until-broke">14</div>
<circle id="hero-ring-progress" .../>
<span id="hero-ring-percent">75%</span>
<p id="remaining-amount">₹4,200.00</p>
<p id="monthly-budget">₹16,800.00</p>

<!-- Stat Grid -->
<p id="daily-average">₹283</p>
<p id="streak-count">5 days</p>

<!-- Timeline -->
<div id="timeline-list">  <!-- Container for expense items -->
  <!-- Expense items rendered dynamically here -->
</div>
<button id="see-archive-btn">See Archive</button>
```

### Wiring Map

| ID | DOM Query (if no ID) | JS Action on Load | JS Action on Click |
|----|---------------------|-------------------|-------------------|
| `welcome-name` | `header h2` | Set `.textContent` to `"Welcome back, " + user.name` | — |
| `notification-btn` | `header button` | — | Toggle notification panel (future) |
| `days-until-broke` | `.neon-glow-primary` div with `text-[7rem]` | Set `.textContent` to computed days | — |
| `hero-ring-progress` | Second `<circle>` in hero SVG | Set `stroke-dashoffset` to `628.3 * (1 - pct/100)` | — |
| `hero-ring-percent` | `.text-3xl` span inside ring container | Set `.textContent` to `pct + '%'` | — |
| `remaining-amount` | `.text-tertiary.text-2xl` in hero bottom bar | Set `.textContent` to `formatCurrency(remaining)` | — |
| `monthly-budget` | `.text-on-surface.text-2xl` in hero bottom bar (right side) | Set `.textContent` to `formatCurrency(budget)` | — |
| `daily-average` | First `.text-4xl` in stat grid | Set `.textContent` to `formatCurrency(avg)` | — |
| `streak-count` | Second `.text-4xl` in stat grid | Set `.textContent` to `streak + ' days'` | — |
| `timeline-list` | `.space-y-4` inside timeline section | Clear `.innerHTML`, rebuild with `renderExpenseItem()` for each recent expense | — |
| `see-archive-btn` | Button with text "See Archive" | — | Navigate to full history or expand list |

---

## analytics.html — Analytics

### IDs to Add

```html
<!-- Time Range Toggle -->
<button id="range-weekly">Weekly</button>
<button id="range-monthly">Monthly</button>   <!-- currently active -->
<button id="range-semester">Semester</button>

<!-- Budget Health Ring -->
<circle id="health-ring-progress" .../>
<span id="health-score">78</span>
<span id="health-label">Budget Health</span>
<span id="health-status">Good</span>
<p id="health-message">You are on track this month.</p>

<!-- Insights Panel -->
<p id="month-forecast">₹6,800</p>
<p id="spending-pattern">Weekend 2x Weekday</p>

<!-- Spending Breakdown -->
<div id="breakdown-chart">  <!-- SVG donut container -->
  <path id="breakdown-ring" .../>
</div>
<div id="breakdown-list">   <!-- Category percentage list -->
  <!-- Dynamic rows -->
</div>

<!-- Weekly Trend -->
<div id="trend-bars">       <!-- Container for all 7 bar divs -->
  <!-- 7 bar divs with tooltips -->
</div>
```

### Wiring Map

| ID | JS Action on Load | JS Action on Click |
|----|-------------------|-------------------|
| `range-weekly` | — | Filter expenses to current week, recompute, re-render all |
| `range-monthly` | — | Filter expenses to current month, recompute, re-render all |
| `range-semester` | — | Filter expenses to semester range, recompute, re-render all |
| `health-ring-progress` | Set `stroke-dashoffset` to `879.6 * (1 - score/100)` | — |
| `health-score` | Set `.textContent` to computed score | — |
| `health-status` | Set `.textContent` to `getHealthStatus(score)` | — |
| `health-message` | Set `.textContent` to dynamic status message | — |
| `month-forecast` | Set `.textContent` to `formatCurrency(forecast)` | — |
| `spending-pattern` | Set `.textContent` to pattern analysis string | — |
| `breakdown-ring` | Set `stroke-dasharray` based on top category pct | — |
| `breakdown-list` | Clear and rebuild with category rows | — |
| `trend-bars` | Set each child bar's `style.height` to `(amount/max*100)%`, update tooltip text | Tooltips show on hover (CSS handles this already) |

### Time Range Toggle — Active State Swap

```javascript
// Active button class
const ACTIVE = 'px-6 py-2 rounded-full text-xs font-label uppercase tracking-widest bg-primary/10 text-primary neon-glow-primary shadow-[0_0_20px_rgba(217,70,239,0.3)] transition-all';

// Inactive button class  
const INACTIVE = 'px-6 py-2 rounded-full text-xs font-label uppercase tracking-widest text-slate-400 hover:text-on-surface transition-all';
```

---

## add_expense.html — Add Expense Form

### IDs to Add

```html
<!-- Amount Input -->
<input id="expense-amount" placeholder="₹0" type="text" />

<!-- Category Buttons -->
<div id="category-buttons">
  <button id="cat-food" data-category="food">Food & Canteen</button>
  <button id="cat-transport" data-category="transport">Transport</button>
  <button id="cat-academics" data-category="academics">Academics</button>
  <button id="cat-subscriptions" data-category="subscriptions">Subscriptions</button>
  <button id="cat-social" data-category="social">Social Outings</button>
</div>

<!-- Context -->
<textarea id="expense-description" placeholder="What was this for?"></textarea>

<!-- Date Display -->
<button id="date-picker-btn">
  <span id="date-display">Today, 24 Oct</span>
</button>

<!-- Wallet -->
<button id="wallet-picker-btn">
  <span id="wallet-display">Main Wallet</span>
</button>

<!-- Receipt -->
<section id="receipt-section">
  <!-- Hidden file input to add -->
  <input type="file" id="receipt-input" accept="image/*" hidden />
</section>

<!-- Save -->
<button id="save-expense-btn">Save Expense</button>
```

### Wiring Map

| ID | JS Action on Load | JS Action on Click / Input |
|----|-------------------|---------------------------|
| `expense-amount` | Focus input | Format value, strip non-numeric chars |
| `cat-food` | Set as default active | Toggle active class, set `selectedCategory = 'food'` |
| `cat-transport` | — | Toggle active class, set `selectedCategory = 'transport'` |
| `cat-academics` | — | Toggle active class, set `selectedCategory = 'academics'` |
| `cat-subscriptions` | — | Toggle active class, set `selectedCategory = 'subscriptions'` |
| `cat-social` | — | Toggle active class, set `selectedCategory = 'social'` |
| `expense-description` | — | Read value on save |
| `date-picker-btn` | Set text to today's formatted date | Open date picker or show date dropdown |
| `date-display` | Set `.textContent` to `formatDate(new Date())` | — |
| `wallet-picker-btn` | — | Toggle wallet selector (future feature) |
| `receipt-section` | — | Click triggers `receipt-input.click()` |
| `receipt-input` | — | On `change`: read file as Base64, show preview |
| `save-expense-btn` | — | Validate → `addExpense()` → redirect to `index.html` |

### Category Button — Active/Inactive Classes

```javascript
// Active (selected) category button
const CAT_ACTIVE = 'px-6 py-3 rounded-xl bg-[#d946ef] text-on-primary-fixed font-bold text-sm transition-all neon-glow-primary hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(217,70,239,0.3)]';

// Inactive category button
const CAT_INACTIVE = 'px-6 py-3 rounded-xl bg-surface-container-low text-zinc-400 font-medium text-sm border border-outline-variant/20 hover:border-[#d946ef]/40 hover:text-on-surface hover:bg-surface-container transition-all active:scale-95';
```

### Save Validation Flow

```javascript
document.getElementById('save-expense-btn').addEventListener('click', () => {
  const amount = parseFloat(document.getElementById('expense-amount').value.replace(/[^0-9.]/g, ''));
  const category = selectedCategory;  // set by category button clicks
  const description = document.getElementById('expense-description').value;
  const date = selectedDate || new Date().toISOString();
  const receipt = receiptBase64 || null;

  // Validate
  if (!amount || amount <= 0) {
    // Highlight amount input with error border
    return;
  }
  if (!category) {
    // Highlight category section
    return;
  }

  // Save
  addExpense(amount, category, description, date, receipt);

  // Redirect
  window.location.href = 'index.html';
});
```

---

## Summary: Total Elements Needing Backend Wiring

| Page | Interactive Elements | Data-Display Elements | Total |
|------|---------------------|----------------------|-------|
| Dashboard | 2 (notification, archive) | 9 (name, days, ring, pct, remaining, budget, avg, streak, timeline) | 11 |
| Analytics | 3 (range toggles) | 8 (score, ring, status, msg, forecast, pattern, breakdown, trend) | 11 |
| Add Expense | 8 (amount, 5 categories, receipt, save) | 2 (date, wallet) | 10 |
| **Total** | **13** | **19** | **32** |
