# PressKit Pro Code Style Guide

Consistency and readability are key to a maintainable codebase. Please follow these guidelines for all code contributions.

---

## Table of Contents

- [General Principles](#general-principles)
- [Languages & Frameworks](#languages--frameworks)
- [Formatting](#formatting)
- [Naming Conventions](#naming-conventions)
- [TypeScript](#typescript)
- [React/Next.js](#reactnextjs)
- [Node.js/Express](#nodejsexpress)
- [Testing](#testing)
- [Linting & Prettier](#linting--prettier)
- [File & Folder Structure](#file--folder-structure)
- [Comments & Documentation](#comments--documentation)

---

## General Principles

- Write clean, readable, and self-explanatory code.
- Prefer clarity over cleverness.
- Keep functions and files small and focused.
- Remove unused code and imports.

---

## Languages & Frameworks

- **Backend:** TypeScript (Node.js, Express)
- **Web:** TypeScript (Next.js, React)
- **Mobile:** TypeScript (React Native, Expo)

---

## Formatting

- Use **2 spaces** for indentation.
- Use **Prettier** for automatic code formatting.
- Use **single quotes** for strings, except in JSON.
- End files with a newline.

---

## Naming Conventions

- **Files & Folders:** kebab-case (e.g., `user-profile.tsx`)
- **Variables & Functions:** camelCase (e.g., `getUserProfile`)
- **Classes & Types:** PascalCase (e.g., `UserProfile`)
- **Constants:** UPPER_CASE (e.g., `MAX_RETRIES`)

---

## TypeScript

- Always type function arguments and return values.
- Prefer interfaces for object shapes.
- Use `unknown` over `any` when possible.
- Avoid non-null assertions (`!`) unless absolutely necessary.

---

## React/Next.js

- Use functional components and hooks.
- Name components with PascalCase.
- Place each component in its own file if it’s reusable.
- Use `useEffect` and `useState` appropriately.
- Use `zod` for schema validation and `react-hook-form` for forms.

---

## Node.js/Express

- Organize code into `controllers`, `models`, `routes`, `middleware`, `services`, `utils`, `config`, and `types`.
- Use async/await for asynchronous code.
- Handle errors with centralized middleware.

---

## Testing

- Use **Jest** for unit and integration tests.
- Place tests in `tests/unit` and `tests/integration`.
- Name test files as `*.test.ts` or `*.test.tsx`.

---

## Linting & Prettier

- Use **ESLint** with the provided config.
- Run `npm run lint` and `npm run lint:fix` before committing.
- Use **Prettier** for formatting (`npm run format`).

---

## File & Folder Structure

- Follow the structure outlined in the `START_GUIDE.md` and `README.md`.
- Group related files together.
- Keep imports organized: external, then internal, then styles.

---

## Comments & Documentation

- Use JSDoc for complex functions and classes.
- Write meaningful comments, but prefer self-explanatory code.
- Update documentation as you change code.

---

**For more details, see the `development-rules.md` in each subproject.**

---

Happy coding! 🚀