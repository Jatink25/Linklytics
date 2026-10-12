# Linklytics

Linklytics is a full-stack URL shortener with a React dashboard and an Express API. Users can create short links, view saved URLs and click totals, copy short URLs, and redirect visitors to the original destinations. URL records are stored in MongoDB.

## Live Demo

- **Frontend (Netlify):** [Linklytics](https://linklytics-v.netlify.app/)
- **Backend (Render):** [Linklytics API](https://linklytics-api-cwzx.onrender.com)

> The hosted backend may take longer to respond to the first request after an idle period, depending on the Render service plan.

## Features

- Create short URLs from valid HTTP and HTTPS destinations.
- Generate unique seven-character short codes.
- Redirect short URLs to their original destinations.
- Increment and persist a URL's click count when its short URL is visited.
- Store URL creation and update timestamps, and display creation dates in the dashboard.
- Display saved URL records, total links, and the sum of recorded link clicks.
- Copy generated short URLs.
- Refresh the link list when the browser tab becomes visible again.
- Show loading, empty, validation, success, and error states in the frontend.

**Click-tracking limitation:** The backend contains a click model with a `clickedAt` field, but the current redirect handler does not create individual click records. Click totals are stored on each URL record; per-click history and per-click timestamp analytics are not currently implemented.

## Architecture

- **Frontend:** React and Vite dashboard hosted on Netlify.
- **Backend:** Node.js and Express API hosted on Render.
- **Database:** MongoDB Atlas stores URL records.

The frontend sends requests to the configured backend origin. The backend validates and stores URLs, looks up short codes during redirects, increments the stored click count, and redirects visitors to the original destination.

## Technology Stack

### Frontend

- React 19 and React DOM
- Vite 8
- Tailwind CSS 4 with the Tailwind Vite plugin
- ESLint

### Backend

- Node.js and Express 5
- MongoDB and Mongoose 9
- `nanoid` for short-code generation
- `dotenv` for environment configuration
- `cors` for cross-origin API requests
- `nodemon` for backend development

Versions reflect the dependencies declared in the frontend and backend package manifests.

## Project Structure

```text
Linklytics/
├── backend/
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── db.js
│       ├── index.js
│       ├── controllers/
│       │   └── url.controller.js
│       ├── middlewares/
│       │   └── error.middleware.js
│       ├── models/
│       │   ├── click.model.js
│       │   └── url.model.js
│       ├── routes/
│       │   ├── redirect.route.js
│       │   └── url.route.js
│       └── utils/
│           ├── ApiError.js
│           ├── ApiResponse.js
│           └── asyncHandler.js
└── frontend/
    ├── package.json
    ├── index.html
    └── src/
        ├── api.js
        ├── App.jsx
        ├── App.css
        ├── index.css
        └── components/
            ├── LinksTable.jsx
            ├── Sidebar.jsx
            ├── StatCard.jsx
            └── UrlShortener.jsx
```

## Prerequisites

- Node.js and npm compatible with the versions and dependencies in the project.
- A MongoDB Atlas cluster, or another MongoDB instance accessible to the backend.

## Environment Variables

Keep environment files local. Never commit database credentials or other secrets.

### Backend

Create `backend/.env` for local development:

```dotenv
PORT=8000
MONGODB_URI=<YOUR_MONGODB_CONNECTION_URI>
```

`MONGODB_URI` must contain the connection URI for your own MongoDB instance. `PORT` is optional; the backend defaults to port `8000` if it is not set. In the deployed Render service, configure the environment variables in the service settings instead of committing credentials to source control.

### Frontend

Create `frontend/.env.local` for local development:

```dotenv
VITE_API_BASE_URL=http://localhost:8000
```

For the deployed Netlify site, set `VITE_API_BASE_URL` to the backend origin:

```text
https://linklytics-api-cwzx.onrender.com
```

Use only the origin; do not append `/api/v1/urls`, because the frontend builds the API path itself. Vite variables prefixed with `VITE_` are included in client-side code, so do not put secrets in them. Rebuild and redeploy the frontend after changing this value.

## Installation

Install the dependencies separately for the backend and frontend:

```sh
cd backend
npm install
cd ../frontend
npm install
```

Configure `backend/.env` and `frontend/.env.local` as described above. Ensure the MongoDB URI points to an accessible database and that the frontend API origin matches the backend host and port.

## Run Locally

Start the backend from the `backend/` directory:

```sh
npm run dev
```

This runs `nodemon src/index.js`. To start the backend without the development watcher, run `npm start` from the same directory.

In a second terminal, start the frontend from the `frontend/` directory:

```sh
npm run dev
```

Open the local URL printed by Vite. Creating and listing URLs, and redirecting short links, require the backend to be running and connected to MongoDB.

Available frontend scripts, run from `frontend/`:

```sh
npm run dev
npm run lint
npm run build
npm run preview
```

Run `npm run build` before `npm run preview`; the preview command serves the generated production build locally.

## How URL Creation and Click Counting Work

1. The dashboard validates that the destination uses HTTP or HTTPS.
2. The frontend sends the destination in the `originalUrl` field to the backend.
3. The backend validates the URL, generates a seven-character short code, and saves a URL document.
4. The dashboard displays the generated short URL using the configured backend origin.
5. When a visitor opens `/<shortCode>`, the backend looks up the URL, increments and saves `clickCount`, then redirects to `originalUrl`.
6. The dashboard loads URL records from the list endpoint and calculates the total click statistic by summing their click counts. It requests the list again when the browser tab becomes visible.

Each URL document includes Mongoose `createdAt` and `updatedAt` timestamps. Clicks are counted on the URL document; individual click events and click timestamps are not currently recorded by the redirect handler.

## API Reference

The deployed backend origin is `https://linklytics-api-cwzx.onrender.com`. The JSON API is mounted under `/api/v1/urls`.

Successful JSON API responses follow this envelope:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success",
  "success": true
}
```

### Create a Short URL

`POST /api/v1/urls`

Request body:

```json
{
  "originalUrl": "https://example.com/a/long/path"
}
```

Returns HTTP `201`. The `data` field contains the created URL document, including `originalUrl`, `shortCode`, `clickCount`, `createdAt`, `updatedAt`, and MongoDB's `_id`.

### List URLs

`GET /api/v1/urls`

Returns HTTP `200`. The `data` field contains an array of URL documents with the same fields as the create response.

### Redirect to a Destination

`GET /:shortCode`

For an existing code, the backend increments and saves its `clickCount`, then responds with an HTTP redirect to the original URL. This route returns a redirect rather than the JSON API response envelope.

### Backend Status

`GET /`

Returns the plain-text response:

```text
Linklytics is running!
```

## Error Handling

JSON API errors use this response shape:

```json
{
  "success": false,
  "message": "Invalid URL format!",
  "data": null,
  "errors": []
}
```

URL creation returns HTTP `400` when `originalUrl` is missing, malformed, or uses a protocol other than HTTP or HTTPS. An unknown short code returns HTTP `404`. Other handled errors use their specified status code or default to HTTP `500`.

The frontend displays API error messages and provides a retry action when it cannot load the URL list. It also validates the destination before submission and reports success after creating a short link.

## Possible Future Improvements

These are ideas for future development and are not currently implemented:

- Store individual click events and timestamps for click-history analytics.
- Add per-link analytics views and visualizations.
- Add user accounts and private link management.
`
