// HomeLedger — sample data.
// The sample household is fictional and shown as an example. Every tool on
// the site (planner, tracker, goals, 50/30/20 calculator) recomputes from
// whatever numbers the visitor types in; nothing here is fetched.

export const HOUSEHOLD = {
  name: 'The Alvarez household',
  members: 'Two adults, one child (age 7)',
  home: 'Rented 3-bedroom apartment',
  month: 'November 2026',
  incomeMonthly: 5200,
  incomeNote: 'Take-home pay after tax, two salaries combined',
};

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#1f3a6e', budget: 1560, note: 'Rent, renter insurance' },
  { id: 'food', label: 'Food & groceries', color: '#c2402a', budget: 720, note: 'Groceries, school lunches' },
  { id: 'transport', label: 'Transport', color: '#2e7d5b', budget: 430, note: 'Car, fuel, bus passes' },
  { id: 'utilities', label: 'Utilities', color: '#7a5aa6', budget: 260, note: 'Electricity, water, internet, phone' },
  { id: 'insurance', label: 'Insurance & health', color: '#b7791f', budget: 310, note: 'Health, dental, prescriptions' },
  { id: 'fun', label: 'Fun & eating out', color: '#3a7ca6', budget: 260, note: 'Restaurants, streaming, outings' },
  { id: 'other', label: 'Everything else', color: '#6b7280', budget: 180, note: 'Clothing, gifts, household items' },
  { id: 'savings', label: 'Savings', color: '#0f766e', budget: 780, note: 'Emergency fund, holiday fund' },
];

export const EXPENSES = [
  { date: '2026-11-02', desc: 'Monthly rent', category: 'housing', amount: 1450 },
  { date: '2026-11-03', desc: 'Weekly groceries — supermarket', category: 'food', amount: 148 },
  { date: '2026-11-05', desc: 'Fuel', category: 'transport', amount: 52 },
  { date: '2026-11-06', desc: 'Electricity bill', category: 'utilities', amount: 96 },
  { date: '2026-11-08', desc: 'Weekly groceries — market', category: 'food', amount: 121 },
  { date: '2026-11-09', desc: 'Family lunch out', category: 'fun', amount: 64 },
  { date: '2026-11-11', desc: 'Internet + phones', category: 'utilities', amount: 118 },
  { date: '2026-11-12', desc: 'Bus passes (2)', category: 'transport', amount: 86 },
  { date: '2026-11-14', desc: 'Weekly groceries — supermarket', category: 'food', amount: 163 },
  { date: '2026-11-15', desc: 'Pharmacy — prescriptions', category: 'insurance', amount: 42 },
  { date: '2026-11-17', desc: 'Cinema tickets', category: 'fun', amount: 38 },
  { date: '2026-11-19', desc: 'Winter coats (2)', category: 'other', amount: 129 },
  { date: '2026-11-21', desc: 'Weekly groceries — supermarket', category: 'food', amount: 139 },
  { date: '2026-11-23', desc: 'Fuel', category: 'transport', amount: 48 },
  { date: '2026-11-25', desc: 'Transfer to emergency fund', category: 'savings', amount: 500 },
];

export const GOALS = [
  { name: 'Emergency fund', target: 10000, saved: 6400, monthly: 500, note: 'Six months of essential spending' },
  { name: 'Summer holiday', target: 2400, saved: 900, monthly: 200, note: 'Flights and a week away in July' },
  { name: 'New washing machine', target: 650, saved: 420, monthly: 80, note: 'The old one leaks' },
  { name: 'Car deposit', target: 4000, saved: 1100, monthly: 150, note: 'A reliable used car within two years' },
];

// The payday routine: five minutes, once a month, in this order.
export const PAYDAY_CHECKLIST = [
  'Move the savings transfer out first — it goes before any spending.',
  'Pay the rent and the bills that are due this week.',
  'Look at last month’s biggest category: one line over budget is a signal, not a failure.',
  'Move any money left over from last month into the emergency fund.',
  'Pick one small cut for this month and write it down — one cut, kept, beats five abandoned ones.',
];

export const TIPS = [
  { title: 'Housing is the lever', body: 'Housing is 30% of this household’s budget. Moving, renegotiating rent, or taking in a lodger saves more in one decision than a year of skipping coffee.' },
  { title: 'Groceries: plan the week', body: 'A weekly meal plan and one big shop cut this household’s food spending by about $90 a month. The sample week above shows four shops averaging $143 each.' },
  { title: 'Pay yourself first', body: 'The $780 savings transfer goes out on payday, before any spending. Money that never sits in the spending account does not get spent.' },
  { title: 'The 50/30/20 rule', body: 'Aim for 50% needs, 30% wants, 20% savings and debt repayment. This household budgets 63% needs, 8% wants and 15% savings, with $700 (13%) unassigned — the guide page shows how to close the gap.' },
  { title: 'One small cut, kept', body: 'Cancelling two unused subscriptions saved $31 a month — $372 a year. Small cuts only help if they stay cut: review subscriptions every three months.' },
];

export function spentByCategory(expenses) {
  const out = {};
  for (const e of expenses) out[e.category] = (out[e.category] || 0) + e.amount;
  return out;
}

export function totalSpent(expenses) {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function totalBudget() {
  return CATEGORIES.reduce((sum, c) => sum + c.budget, 0);
}
