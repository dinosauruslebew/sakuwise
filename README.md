# SakuWise

SakuWise is a personal finance web app that helps users (especially students) track expenses, manage budgets, and reach savings goals.

## Features

- **Landing page**: hero, features, pricing, security, and a "how it works" modal.
- **Authentication**: login and sign-up pages (email + password, plus a Google button).
- **Dashboard** with several views:
  - Overview
  - Expenses
  - Bills
  - Monthly Budget
  - Savings Goals
  - AI Assistant
  - Settings and Help

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- [Supabase](https://supabase.com) (authentication, optional)
- [lucide-react](https://lucide.dev) for icons

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Installation

    git clone <repository-url>
    cd sakuwise
    npm install

### Environment Configuration (optional)

Create a `.env.local` file in the project root to enable Supabase authentication:

    NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

If these variables are not set, the app automatically falls back to a local simulation mode: accounts and sessions are stored in the browser's `localStorage`. This mode is for demo/development only and is not secure for production.

### AI Assistant (Gemini)

The AI Assistant calls the Gemini API through the server route `app/api/chat/route.ts`. Add your key to `.env.local` (never prefix it with `NEXT_PUBLIC_`, so it stays on the server):

    GEMINI_API_KEY=your-gemini-api-key
    # optional, defaults to gemini-2.5-flash
    GEMINI_MODEL=gemini-2.5-flash

Without `GEMINI_API_KEY`, the assistant shows an error message in the chat. When a message is sent, a summary of the user's finance data (allowance, budgets, recent transactions, bills, goals) is sent to Gemini as context; account details are not included.

### Running the App

    npm run dev

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |

## Project Structure

    app/                 Pages (landing, login, signup, dashboard)
    components/          Landing page components
    components/dashboard Dashboard view components
    context/             AuthContext (authentication state)
    lib/                 Supabase client
    public/              Static assets (logos, icons)

## Notes

This project uses a version of Next.js with API changes compared to older releases. See `AGENTS.md` and the docs in `node_modules/next/dist/docs/` before changing framework conventions.
