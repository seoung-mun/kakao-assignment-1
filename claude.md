# KakaoTech Campus Assignment 3 - AI Assistant Guidelines

## 1. Project Rules
- **Branch**: All work for assignment 3 must be done on the `week-03-최성문` branch.
- **Directories**:
  - `frontend/`: Next.js 15+ (App Router), React 18+, TypeScript, Tailwind CSS v4.
  - `backend/`: FastAPI, SQLAlchemy, SQLite.
- **Data Flow**: Use Server Actions (`actions.ts`) or API Routes (`route.ts`) to communicate with the FastAPI backend.

## 2. Coding Guidelines
- **Component Splitting**: Do not create monolithic components (like the previous `App.jsx`). Break down UI into small, focused, and reusable components.
- **Server vs Client Components**: Default to Server Components. Use `"use client"` only when user interaction (hooks, event listeners) is required.
- **Key Prop**: Always provide a unique `key` prop when rendering lists in React. This is crucial for React's reconciliation process to efficiently update the DOM when items are added, removed, or reordered.
- **Timezones & Dates**: Handle dates carefully. Store all dates in UTC on the backend. Only convert to local timezones on the frontend for display purposes to avoid issues like the "1-day shift" and handle Daylight Saving Time (DST) correctly.
- **State Management**: Shift from synchronous, main-thread-blocking LocalStorage to asynchronous, server-based data fetching. LocalStorage parsing is computationally heavy because it's synchronous and blocks the main thread.

## 3. Communication
- Explain the "why" behind the code. The user needs to be able to explain how the code works to others.
- Add clear comments to complex logic.

## 4. General Conventions
- TypeScript strict mode
- Python type hinting
- Environment variables for URLs
- Clear, descriptive commits
