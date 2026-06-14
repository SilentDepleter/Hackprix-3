export const CATEGORIES = {
  food:          { label: "Food & Canteen",  icon: "restaurant",            color: "primary"   },
  transport:     { label: "Transport",       icon: "directions_car",        color: "tertiary"   },
  academics:     { label: "Academics",       icon: "print",                 color: "secondary"  },
  subscriptions: { label: "Subscriptions",   icon: "subscriptions",         color: "primary"    },
  social:        { label: "Social Outings",  icon: "diversity_3",           color: "error"      },
};

export function formatCurrency(amount) {
  // Use minimumFractionDigits: 0, maximumFractionDigits: 2 so solid numbers don't show .00 unless we want to. Let's stick to .00
  return '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatTime(isoDate) {
  return new Date(isoDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function formatDate(isoDate) {
  const d = new Date(isoDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
