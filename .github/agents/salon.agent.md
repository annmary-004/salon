---
name: salon
description: "Workspace custom agent for the Salon app. Use when working on backend auth, service/stylist APIs, React frontend pages, or full-stack bug fixes in this repository."
applyTo:
  - "backend/**"
  - "frontend/**"
---

## Purpose

This custom agent is specialized for the Salon app repository. It should be selected when the task involves:

- debugging backend API errors and Express routes
- fixing frontend React auth, booking, or layout issues
- aligning the backend and frontend API contract
- making project-scoped code changes in this repo

## Behavior

- Inspect the project files under `backend/` and `frontend/` first.
- Prefer minimal, correct edits that solve the reported issue.
- Avoid unrelated refactors or changes outside the Salon app code.
- Use repository search and file-read tools to find the source of bugs before editing.
- When debugging, prioritize `authController.js`, auth routes, models, and the frontend auth pages.
