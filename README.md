# Chirag Maru — Full-stack 3D Portfolio

A responsive, Apple-inspired glassmorphism portfolio with a Node.js backend (built-in modules; no package installation required).

## Run locally on macOS

1. Install Node.js (LTS) if it is not already installed: https://nodejs.org/
2. Open Terminal and move into this folder: `cd path/to/chirag-portfolio-fullstack`
3. Start the server: `npm start` (or `node server.js`)
4. Open `http://localhost:3000` in your browser.

## Backend API

- `GET /api/health` — server health check
- `GET /api/projects` — returns project data from the backend
- `POST /api/contact` — validates and saves contact messages to `data/messages.json`

Example contact body: `{ "name":"Alex", "email":"alex@example.com", "message":"Hello, let's collaborate!" }`

## Personalise before publishing

- Replace `YOUR-USERNAME`, `YOUR-LINKEDIN`, and `YOUR-EMAIL@example.com` in `public/index.html`.
- Add real repository links to the project objects in `server.js` (`link` field).
- Edit project descriptions and skills to reflect your actual progress.
- The contact endpoint currently saves messages to a local JSON file. For production hosting, use a database and an email service, and add rate limiting / spam protection.

## Deploy

This is a Node web app, so deploy it to a Node-compatible host (for example Render, Railway, or a VPS). Set the start command to `npm start`. A static-only GitHub Pages deployment will not run the Express backend.
