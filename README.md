# Personal Finance & Expense Analytics App

A minimal, production-grade React app for tracking income, expenses, budgets, and financial analytics.

## Tech Stack

- **Vite** + **React 18**
- **Tailwind CSS** — utility-first styling
- **React Router DOM** — multi-page routing
- **React Hook Form** + **Yup** — form handling & validation
- **Recharts** — pie, line, and bar charts
- **Framer Motion** — smooth animations
- **date-fns** — date formatting
- **uuid** — unique IDs
- **react-toastify** — toast notifications
- **react-icons** — icon library
- **axios** — HTTP client (currency API)

## Setup

```bash
npm install
npm run dev
```

## Pages

| Route | Page |
|---|---|
| `/dashboard` | Overview with stats, budget, chart, recent transactions |
| `/transactions` | Full transaction list with search, filter, sort |
| `/transactions/new` | Add new income or expense |
| `/budget` | Monthly budget tracker with category breakdown |
| `/analytics` | Charts: pie, line trend, bar comparison, recurring |

## Features

- Add / edit / delete transactions
- Income & expense tracking
- Category filtering (Food, Travel, Rent, Shopping, etc.)
- Search by title or notes
- Sort by date, amount, category
- Monthly budget with progress bar
- Spending by category (pie chart)
- Monthly trend line chart
- Income vs expense bar chart
- Recurring expense tagging
- Persistent state via localStorage
- Mobile responsive with bottom nav
