// HomeLedger — pages.
// Each view is a hash route. The dashboard, planner, tracker and goals all
// recompute from the same sample data, and every control on the page works.

import {
  HOUSEHOLD,
  CATEGORIES,
  EXPENSES,
  GOALS,
  TIPS,
  PAYDAY_CHECKLIST,
  spentByCategory,
  totalSpent,
  totalBudget,
} from './data.js';
import { donutChart, budgetBars } from './charts.js';

function money(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || { label: id, color: '#6b7280' };
}

export function viewDashboard() {
  const spent = spentByCategory(EXPENSES);
  const total = totalSpent(EXPENSES);
  const budget = totalBudget();
  const left = budget - total;
  const slices = CATEGORIES.filter((c) => (spent[c.id] || 0) > 0).map((c) => ({
    label: c.label,
    value: spent[c.id],
    color: c.color,
  }));
  const bars = CATEGORIES.map((c) => ({
    label: c.label,
    spent: spent[c.id] || 0,
    budget: c.budget,
    color: c.color,
  }));
  const recent = [...EXPENSES].slice(-5).reverse();
  return `
  <section class="hero">
    <p class="eyebrow">Household budget · ${HOUSEHOLD.month}</p>
    <h1>HomeLedger</h1>
    <p class="lede">${HOUSEHOLD.name} — ${HOUSEHOLD.members}. ${HOUSEHOLD.home}.
    Take-home pay ${money(HOUSEHOLD.incomeMonthly)} a month. This page shows where
    the money has gone so far this month.</p>
  </section>
  <div class="kpis">
    <article class="kpi"><div class="kpi-value">${money(HOUSEHOLD.incomeMonthly)}</div><div class="kpi-label">Monthly income</div><div class="kpi-note">${HOUSEHOLD.incomeNote}</div></article>
    <article class="kpi"><div class="kpi-value">${money(total)}</div><div class="kpi-label">Spent so far</div><div class="kpi-note">of a ${money(budget)} monthly budget</div></article>
    <article class="kpi"><div class="kpi-value">${money(left)}</div><div class="kpi-label">Left in the budget</div><div class="kpi-note">${left >= 0 ? 'On track for the month' : 'Over budget — see the planner'}</div></article>
    <article class="kpi"><div class="kpi-value">15%</div><div class="kpi-label">Planned savings rate</div><div class="kpi-note">${money(780)} of ${money(HOUSEHOLD.incomeMonthly)} goes to savings</div></article>
  </div>
  <section class="panel">
    <h2>Where the money went</h2>
    ${donutChart(slices, 'spent so far')}
  </section>
  <section class="panel">
    <h2>Spent vs budget, by category</h2>
    ${budgetBars(bars)}
    <p class="source">Grey is the budget, colour is what has been spent. Red means over budget.</p>
    <p><a class="button" href="#/planner">Adjust the budget →</a>
    <a class="button ghost" href="#/expenses">Track an expense →</a></p>
  </section>
  <section class="panel">
    <h2>Recent expenses</h2>
    <table><thead><tr><th>Date</th><th>What</th><th>Category</th><th>Amount</th></tr></thead>
    <tbody>${recent.map((e) => `<tr><td>${e.date}</td><td>${e.desc}</td><td>${categoryById(e.category).label}</td><td>${money(e.amount)}</td></tr>`).join('')}</tbody></table>
  </section>`;
}

export function viewPlanner() {
  const budget = totalBudget();
  return `
  <section class="hero slim"><p class="eyebrow">Budget planner</p>
    <h1>Plan the month</h1>
    <p class="lede">Type a monthly budget for each category. The total, the money left
    over and the savings rate update as you type — nothing is saved anywhere,
    so try any numbers you like.</p>
  </section>
  <section class="panel">
    <div class="controls">
      <label>Monthly take-home pay <input id="income-input" type="number" min="0" step="50" value="${HOUSEHOLD.incomeMonthly}"></label>
    </div>
    <table id="plan-table">
      <thead><tr><th>Category</th><th>What it covers</th><th>Monthly budget</th></tr></thead>
      <tbody>${CATEGORIES.map((c) => `<tr><td><strong>${c.label}</strong></td><td>${c.note}</td><td><input class="budget-input" data-cat="${c.id}" type="number" min="0" step="10" value="${c.budget}" aria-label="Budget for ${c.label}"></td></tr>`).join('')}</tbody>
    </table>
    <div id="plan-summary" class="summary"></div>
    <p class="source">Starting point: the sample household's budget, ${money(budget)} a month against ${money(HOUSEHOLD.incomeMonthly)} of income.</p>
    <p><a class="button" href="#/guide">How the 50/30/20 rule fits →</a></p>
  </section>`;
}

export function viewExpenses() {
  const total = totalSpent(EXPENSES);
  const options = CATEGORIES.map((c) => `<option value="${c.id}">${c.label}</option>`).join('');
  return `
  <section class="hero slim"><p class="eyebrow">Expense tracker</p>
    <h1>Every dollar, listed</h1>
    <p class="lede">Add an expense and the totals update at once. Filter by category or
    search by description. Everything stays in this browser tab.</p>
  </section>
  <section class="panel">
    <h2>Add an expense</h2>
    <form id="add-expense" class="expense-form">
      <label>Date <input name="date" type="date" value="2026-11-26" required></label>
      <label>What <input name="desc" type="text" placeholder="e.g. Weekly groceries" required></label>
      <label>Category <select name="category">${options}</select></label>
      <label>Amount ($) <input name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required></label>
      <button type="submit">Add expense</button>
    </form>
  </section>
  <section class="panel">
    <div class="controls">
      <label>Filter <select id="expense-filter"><option value="">All categories</option>${options}</select></label>
      <label>Search <input id="expense-search" type="search" placeholder="e.g. groceries" aria-label="Search expenses"></label>
    </div>
    <table id="expense-table">
      <thead><tr><th>Date</th><th>What</th><th>Category</th><th>Amount</th><th></th></tr></thead>
      <tbody></tbody>
    </table>
    <p id="expense-total" class="summary">Total: ${money(total)} across ${EXPENSES.length} expenses.</p>
  </section>`;
}

export function viewGoals() {
  return `
  <section class="hero slim"><p class="eyebrow">Savings goals</p>
    <h1>What are you saving for?</h1>
    <p class="lede">Each goal shows how much is saved, how much is left, and how many
    months it takes at the current monthly amount — plus what happens if you
    save $50 more a month.</p>
  </section>
  ${GOALS.map((g) => {
    const left = Math.max(g.target - g.saved, 0);
    const months = Math.ceil(left / g.monthly);
    const monthsFaster = Math.ceil(left / (g.monthly + 50));
    const pct = Math.min(Math.round((g.saved / g.target) * 100), 100);
    return `<section class="panel">
      <h2>${g.name}</h2>
      <p>${g.note}. Target ${money(g.target)} · saved ${money(g.saved)} · ${money(g.monthly)} a month.</p>
      <div class="progress" role="img" aria-label="${pct}% saved"><div class="progress-fill" style="width:${pct}%"></div></div>
      <p><strong>${pct}% saved — ${money(left)} to go.</strong> At ${money(g.monthly)} a month that takes
      ${months} month${months === 1 ? '' : 's'}. Save $50 more a month and it takes ${monthsFaster} month${monthsFaster === 1 ? '' : 's'} instead.</p>
    </section>`;
  }).join('')}`;
}

export function viewGuide() {
  const income = HOUSEHOLD.incomeMonthly;
  const needs = 1560 + 720 + 430 + 260 + 310;
  const wants = 260 + 180;
  const savings = 780;
  return `
  <section class="hero slim"><p class="eyebrow">Guide</p>
    <h1>The 50/30/20 rule, worked out</h1>
    <p class="lede">Split take-home pay into 50% needs, 30% wants and 20% savings and
    debt repayment. Type your own income and the split updates.</p>
  </section>
  <section class="panel">
    <div class="controls">
      <label>Monthly take-home pay <input id="rule-income" type="number" min="0" step="50" value="${income}"></label>
    </div>
    <div id="rule-result" class="summary"></div>
    <p>This household budgets ${money(needs)} needs (${Math.round((needs / income) * 100)}%),
    ${money(wants)} wants (${Math.round((wants / income) * 100)}%) and ${money(savings)} savings
    (${Math.round((savings / income) * 100)}%), with ${money(income - needs - wants - savings)} unassigned.
    Needs run high because rent is expensive where they live — the fix is a housing
    decision, not skipping lunches.</p>
  </section>
  <section class="panel">
    <h2>Five things that actually move the needle</h2>
    ${TIPS.map((t) => `<h3>${t.title}</h3><p>${t.body}</p>`).join('')}
  </section>
  <section class="panel">
    <h2>The payday routine — five minutes, once a month</h2>
    <ol>${PAYDAY_CHECKLIST.map((step) => `<li>${step}</li>`).join('')}</ol>
    <p>Over a year this household plans to save ${money(780 * 12)} and spend
    ${money(totalBudget() * 12)} — the planner above shows whether the month
    is keeping to that pace.</p>
  </section>`;
}

export const VIEWS = {
  '/': viewDashboard,
  '/planner': viewPlanner,
  '/expenses': viewExpenses,
  '/goals': viewGoals,
  '/guide': viewGuide,
};
