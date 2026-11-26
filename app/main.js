// HomeLedger — wiring.
// Hash routing plus the interactive controls: the budget planner's live
// totals, the expense tracker's add / filter / search / delete, and the
// 50/30/20 calculator. All state lives in this tab; nothing is sent anywhere.

import { VIEWS } from './views.js';
import { HOUSEHOLD, CATEGORIES, EXPENSES, spentByCategory, totalSpent, totalBudget } from './data.js';

const app = document.getElementById('app');
const navLinks = [...document.querySelectorAll('nav a')];
let expenses = [...EXPENSES];

function money(n) {
  return '$' + Math.round(n).toLocaleString('en-US');
}

function categoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || { label: id, color: '#6b7280' };
}

function route() {
  const hash = window.location.hash || '#/';
  const path = hash.slice(1) || '/';
  const view = VIEWS[path] || VIEWS['/'];
  app.innerHTML = view();
  navLinks.forEach((a) => {
    const target = a.getAttribute('href').slice(1) || '/';
    a.setAttribute('aria-current', target === path ? 'page' : 'false');
  });
  if (path === '/planner') wirePlanner();
  if (path === '/expenses') wireExpenses();
  if (path === '/guide') wireGuide();
  window.scrollTo(0, 0);
}

function wirePlanner() {
  const incomeInput = document.getElementById('income-input');
  const summary = document.getElementById('plan-summary');
  const inputs = [...document.querySelectorAll('.budget-input')];

  function update() {
    const income = Number(incomeInput.value) || 0;
    const total = inputs.reduce((s, el) => s + (Number(el.value) || 0), 0);
    const left = income - total;
    const savings = Number(document.querySelector('[data-cat="savings"]')?.value || 0);
    const rate = income > 0 ? Math.round((savings / income) * 100) : 0;
    summary.innerHTML = `<strong>Total budget: ${money(total)}</strong> · ` +
      `Income: ${money(income)} · ` +
      `<strong>${left >= 0 ? `${money(left)} left unassigned` : `${money(-left)} over income`}</strong> · ` +
      `Savings rate: ${rate}%`;
  }
  incomeInput.addEventListener('input', update);
  inputs.forEach((el) => el.addEventListener('input', update));
  update();
}

function wireExpenses() {
  const tbody = document.querySelector('#expense-table tbody');
  const totalEl = document.getElementById('expense-total');
  const filter = document.getElementById('expense-filter');
  const search = document.getElementById('expense-search');
  const form = document.getElementById('add-expense');

  function render() {
    const q = search.value.trim().toLowerCase();
    const cat = filter.value;
    const list = expenses.filter(
      (e) => (!cat || e.category === cat) && (!q || e.desc.toLowerCase().includes(q)),
    );
    tbody.innerHTML = list
      .map((e, i) => {
        const idx = expenses.indexOf(e);
        return `<tr><td>${e.date}</td><td>${e.desc}</td><td>${categoryById(e.category).label}</td><td>${money(e.amount)}</td><td><button type="button" data-del="${idx}">Delete</button></td></tr>`;
      })
      .join('') || `<tr><td colspan="5">No expenses match. Try clearing the filter.</td></tr>`;
    const shown = list.reduce((s, e) => s + e.amount, 0);
    totalEl.textContent = `Showing ${money(shown)} across ${list.length} expenses (of ${money(totalSpent(expenses))} in total).`;
    tbody.querySelectorAll('[data-del]').forEach((btn) => {
      btn.addEventListener('click', () => {
        expenses.splice(Number(btn.dataset.del), 1);
        render();
      });
    });
  }

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const data = new FormData(form);
    expenses.push({
      date: data.get('date'),
      desc: String(data.get('desc')).trim(),
      category: data.get('category'),
      amount: Number(data.get('amount')),
    });
    form.reset();
    form.querySelector('[name="date"]').value = '2026-11-26';
    render();
  });
  filter.addEventListener('change', render);
  search.addEventListener('input', render);
  render();
}

function wireGuide() {
  const incomeInput = document.getElementById('rule-income');
  const result = document.getElementById('rule-result');
  function update() {
    const income = Number(incomeInput.value) || 0;
    result.innerHTML =
      `<strong>Needs (50%): ${money(income * 0.5)}</strong> · ` +
      `<strong>Wants (30%): ${money(income * 0.3)}</strong> · ` +
      `<strong>Savings &amp; debt (20%): ${money(income * 0.2)}</strong>`;
  }
  incomeInput.addEventListener('input', update);
  update();
}

window.addEventListener('hashchange', route);
route();
