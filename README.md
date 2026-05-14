# Flight Logger

A small React and TypeScript app for logging flight hours by aircraft tail number. The app shows total flights, total hours, and the five most recent flight log entries.

## Tech Stack

- React
- TypeScript
- Vite
- Vitest
- Tailwind CSS Vite plugin

## Requirements

- Node.js `>=20.19.0`
- npm

The repo includes an `.nvmrc` file for Node version managers.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev
```

Open the local URL printed by Vite.

## Data Storage

Flight logs are stored in:

```text
data/flights.json
```

During local development, a Vite plugin serves a lightweight JSON API:

- `GET /api/flights` reads saved flight logs
- `POST /api/flights` saves a new flight log

Each flight entry contains:

```ts
type FlightLogEntry = {
  id: string;
  hours: number;
  loggedAt: string;
  tailNumber: string;
};
```

## Available Scripts

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
src/components/   React UI components
src/constants/    Static app constants
src/libs/         Shared utility and validation functions
src/plugins/      Vite development plugins
src/state/        API client and reducer logic
src/types/        Shared TypeScript types
data/             Local JSON data store
```

## Notes

This project uses a Vite dev-server plugin for local JSON file persistence. That keeps the app lightweight for development, but a production deployment would need a real backend or hosted storage service for writes.
