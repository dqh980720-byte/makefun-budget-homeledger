# HomeLedger — Household Budget Planner

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/dqh980720-byte/makefun-budget-homeledger/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/dqh980720-byte/makefun-budget-homeledger/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

A household budget site that runs entirely in the browser from static files
— no account, no network request, no data leaves the device. Open
`app/index.html` in a desktop browser or on a phone and it works.

## What it does

- **Dashboard** — this month at a glance: income, spending, savings rate,
  and spending by category against budget.
- **Budget planner** — set a monthly budget per category; the planner shows
  the total, what is left, and which categories are over.
- **Expense tracker** — add, filter and delete expenses; totals update
  immediately and are grouped by category.
- **Savings goals** — set a goal and a monthly amount; the site works out
  how many months it takes, and what happens if you save $50 more.
- **Guide** — the 50/30/20 rule with a calculator, plus practical tips for
  cutting the three biggest household costs.

## How it is built

- `app/index.html` — the single page shell and navigation.
- `app/style.css` — all of the site's styling.
- `app/data.js` — the sample household, categories, budgets and expenses.
- `app/charts.js` — the SVG donut and budget bars, drawn from the data.
- `app/views.js` — the hash-route pages (dashboard, planner, expenses,
  goals, guide).
- `app/main.js` — routing and all of the interactive controls.
- `main.ts` — the hand-in program: copies `app/` and `screenshots/` to
  `/output` and writes `/output/dossier.json`.
- `screenshots/` — real renders of the site running in a browser.

The sample household is fictional and shown as an example; the planner,
tracker and goals tools work with any numbers the visitor types in.
