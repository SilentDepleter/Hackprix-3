# Screen Inventory — Every UI Element & Its Current State

This document catalogs every interactive and data-driven element on each page. For each element, it notes what is currently **hardcoded** and what needs to be **wired to backend logic**.

---

## Page 1: Dashboard (`index.html`)

### Header (Sticky, line 158–170)

| Element | Current State | Needs Backend? |
|---------|--------------|----------------|
| Welcome text: `"Welcome back, User"` | Hardcoded string | ✅ Replace `User` with actual username |
| Subtitle: `"Here is your financial status"` | Hardcoded | Optional — could show date or dynamic message |
| Notification bell button | Static icon with ping animation | ✅ Show/hide based on unread notifications count |

### Hero Card — Days Until Broke (line 177–211)

| Element | Current Value | Needs Backend? |
|---------|--------------|----------------|
| Label: `"Run Rate Projection"` | Static | No |
| Title: `"Days Until Broke"` | Static | No |
| Big number: `14` | Hardcoded | ✅ Calculate from `(remaining balance) / (daily average spend)` |
| SVG progress ring: `stroke-dashoffset="157.07"` | Hardcoded at 75% | ✅ Animate to `(spent / budget) * 100` percentage |
| Ring center text: `75%` + `Used` | Hardcoded | ✅ Display `(spent / budget * 100)%` |
| Remaining: `₹4,200.00` | Hardcoded | ✅ Compute `budget - totalSpent` |
| Monthly Budget: `₹16,800.00` | Hardcoded | ✅ Read from user settings |

### Stat Grid (line 214–233)

| Element | Current Value | Needs Backend? |
|---------|--------------|----------------|
| Daily Average: `₹283` | Hardcoded | ✅ Compute `totalSpent / daysElapsed` |
| Streak: `5 days` | Hardcoded | ✅ Count consecutive days where spend ≤ daily budget |

### Timeline — Recent Expenses (line 239–300)

Currently 3 hardcoded expense items:

| # | Name | Category | Time | Amount |
|---|------|----------|------|--------|
| 1 | Canteen Lunch | Campus Dining | 12:30 PM | -₹60 |
| 2 | Auto to College | Commute | 08:15 AM | -₹35 |
| 3 | Printouts | Academic | Yesterday | -₹20 |

**Backend needs:**
- ✅ Dynamically render expense list from stored data
- ✅ Sort by most recent first
- ✅ Show correct icon per category (restaurant, directions_car, print, etc.)
- ✅ Show correct accent color per category (primary, tertiary, secondary)
- ✅ "See Archive" button → could link to a full history view or expand the list
- ✅ The progress bars under each amount → compute as `(expense amount / daily budget)`

### Map Section (line 302–316)

| Element | Current State | Needs Backend? |
|---------|--------------|----------------|
| Image | External URL (Google hosted) | No (decorative) |
| Location label: `"Campus Set"` / `"Mumbai University"` | Hardcoded | Optional — user profile setting |
| "Edit" button | Non-functional | Optional |

---

## Page 2: Analytics (`analytics.html`)

### Header (line 157–168)

| Element | Current State | Needs Backend? |
|---------|--------------|----------------|
| Title: `"Analytics"` | Static | No |
| Time range toggle: `Weekly` / `Monthly` / `Semester` | Visual only, "Monthly" appears active | ✅ Switch data view when clicked |

### Budget Health Ring (line 172–195)

| Element | Current Value | Needs Backend? |
|---------|--------------|----------------|
| Score: `78 / 100` | Hardcoded | ✅ Compute budget health score |
| SVG ring: `stroke-dashoffset="193.5"` | Hardcoded at 78% | ✅ Animate to computed percentage |
| Label: `"Budget Health"` | Static | No |
| Status: `"Good"` | Hardcoded | ✅ Derive from score (Good / Warning / Critical) |
| Message: `"You are on track this month."` | Hardcoded | ✅ Dynamic based on status |

### Insights Panel (line 200–217)

| Element | Current Value | Needs Backend? |
|---------|--------------|----------------|
| Month Forecast: `₹6,800` | Hardcoded | ✅ Project monthly total from current pace |
| Spending Pattern: `"Weekend 2x Weekday"` | Hardcoded | ✅ Analyze day-of-week spending ratios |

### Spending Breakdown (line 222–246)

Currently 3 hardcoded categories:

| Category | Percentage |
|----------|------------|
| Food & Canteen | 40% |
| Transport | 20% |
| Social Outings | 15% |

**Backend needs:**
- ✅ Compute actual percentages from stored expenses
- ✅ Generate category list dynamically
- ✅ Update the donut chart SVG `stroke-dasharray` values
- ✅ Show all categories, not just top 3

### Weekly Trend Bar Chart (line 249–264)

Currently 7 hardcoded bars (Mon–Sun) with heights and tooltip values:

| Day | Amount | Bar Height |
|-----|--------|------------|
| Mon | ₹320 | 50% |
| Tue | ₹480 | 75% |
| Wed | ₹640 | 100% (peak, highlighted) |
| Thu | ₹420 | 67% |
| Fri | ₹210 | 33% |
| Sat | ₹350 | 50% |
| Sun | ₹510 | 80% |

**Backend needs:**
- ✅ Aggregate daily spending totals for the current week
- ✅ Find max to calculate relative bar heights
- ✅ Highlight the peak day with primary color + glow
- ✅ Update tooltip values

---

## Page 3: Add Expense (`add_expense.html`)

### Header (line 151–161)

| Element | Current State | Needs Backend? |
|---------|--------------|----------------|
| Back arrow → links to `index.html` | Working link | No |
| Title: `"New Expense"` | Static | No |

### Amount Input (line 166–172)

| Element | Current State | Needs Backend? |
|---------|--------------|----------------|
| `<input>` with placeholder `₹0` | Functional HTML input | ✅ Read value, validate as number, format with ₹ prefix |
| Neon underline bar | Animates on focus (CSS only) | No |

### Classification Buttons (line 177–196)

5 category buttons, "Food & Canteen" appears pre-selected (active style):

| Button | Style |
|--------|-------|
| Food & Canteen | Active: `bg-[#d946ef]` with glow |
| Transport | Inactive: `bg-surface-container-low` + border |
| Academics | Inactive |
| Subscriptions | Inactive |
| Social Outings | Inactive |

**Backend needs:**
- ✅ Toggle active state on click (only one selected at a time)
- ✅ Store selected category with the expense

### Context Textarea (line 198–203)

| Element | Current State | Needs Backend? |
|---------|--------------|----------------|
| `<textarea>` with placeholder `"What was this for?"` | Functional HTML textarea | ✅ Read value, store with expense |

### Details Buttons (line 208–229)

| Button | Current Display | Needs Backend? |
|--------|----------------|----------------|
| Calendar: `"Today, 24 Oct"` | Hardcoded date | ✅ Show actual current date, optionally open date picker |
| Wallet: `"Main Wallet"` | Hardcoded | Optional — if multi-wallet feature is added |

### Receipt Attachment (line 232–243)

| Element | Current State | Needs Backend? |
|---------|--------------|----------------|
| Upload area with camera icon | Non-functional | ✅ Open file picker, store image reference |

### Save Button (line 247–252)

| Element | Current State | Needs Backend? |
|---------|--------------|----------------|
| `"Save Expense"` button | Non-functional | ✅ This is the main action. On click: validate, save to storage, redirect to dashboard |

---

## Sidebar (Identical on all 3 pages)

| Element | Current State | Needs Backend? |
|---------|--------------|----------------|
| AURORA logo | Static | No |
| Dashboard link | `<a href="index.html">` — works | No |
| Analytics link | `<a href="analytics.html">` — works | No |
| Add Expense link | `<a href="add_expense.html">` — works | No |
| Wallet button | `<button>` — no action | ✅ Future feature |
| Profile button | `<button>` — no action | ✅ Future feature |
| Settings button | `<button>` — no action | ✅ Future feature |
