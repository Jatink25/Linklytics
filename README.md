# Linklytics

Linklytics is a deployed full-stack URL shortener. Its React dashboard creates and lists short links, while an Express API backed by MongoDB stores URL records, redirects visitors, and tracks click totals.

## Live demo

- **Frontend (Netlify):** [https://linklytics-v.netlify.app](https://linklytics-v.netlify.app/)
- **Backend (Render):** [https://linklytics-api-cwzx.onrender.com](https://linklytics-api-cwzx.onrender.com/)

> The Netlify URL was not present in the repository and needs to be filled in with the deployed site address.
>
> If the Render service is on a plan that sleeps after inactivity, its first request after an idle period may take longer while the service starts.

## Features

- Create short URLs from validated HTTP and HTTPS destinations.
- Generate unique seven-character short codes.
- Redirect short URLs to their original destinations.
- Increment and persist each URL's click count when its short URL is visited.
- Store URL creation and update timestamps, and display the creation date in the dashboard.
- Display saved URL records, total link count, and the sum of link click counts.
- Copy newly created short URLs.
- Refresh the dashboard link list when its tab becomes visible.
- Provide loading, empty, validation, success, and error states in the frontend.

The backend includes a click model with a `clickedAt` field, but the redirect handler does not currently create click records. Per-click timestamps or click-history analytics are therefore not implemented; the timestamps currently displayed belong to URL records.

## Architecture

- **Frontend:** React and Vite dashboard hosted on Netlify.
- **Backend:** Node.js and Express API hosted on Render.
- **Persistence:** MongoDB Atlas stores URL records.

The frontend sends API requests to the configured backend origin. The backend validates and stores URLs in MongoDB, then serves redirect requests by looking up the short code, incrementing the stored click count, and redirecting to the destination.

## Technology stack

**Frontend**

- React 19 and React DOM
- Vite 8
- Tailwind CSS 4 with the Tailwind Vite plugin
- ESLint

**Backend**

- Node.js with Express 5
- MongoDB with Mongoose 9
- `nanoid` for short-code generation
- `dotenv` for backend environment configuration
- `cors` for cross-origin API requests
- `nodemon` for backend development

Versions reflect the dependencies in the frontend and backend package manifests.

## Project structure

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

- Node.js and npm compatible with the dependencies declared in both package manifests.
- A MongoDB Atlas cluster (or another reachable MongoDB instance) and its connection URI.

## Environment variables

Keep environment files local and never commit database credentials or secrets.

### Backend

Create `backend/.env`:

```dotenv
PORT=8000
MONGODB_URI=<YOUR_MONGODB_ATLAS_CONNECTION_URI>
```

`PORT` is optional; the backend defaults to `8000`. Set `MONGODB_URI` to the connection URI from your own MongoDB Atlas cluster. Keep the real URI private. In the deployed Render service, configure these variables in the service's environment settings instead of placing credentials in source control.

### Frontend

Create `frontend/.env.local` for local development:

```dotenv
VITE_API_BASE_URL=http://localhost:8000
```

For the deployed Netlify site, set `VITE_API_BASE_URL` in the site's environment variables to:

```text
https://linklytics-api-cwzx.onrender.com
```

Use only the backend origin; the frontend appends `/api/v1/urls` for API calls and the short code for redirects. Vite variables prefixed with `VITE_` are included in frontend code, so this value must not contain secrets. Rebuild/redeploy the frontend after changing its environment value.

## Local installation and setup

Install backend and frontend dependencies separately:

```sh
cd backend
npm install
cd ../frontend
npm install
```

Configure `backend/.env` and `frontend/.env.local` as shown above. Ensure the MongoDB URI points to an accessible database and the frontend API origin matches the backend host and port.

## Run locally

In one terminal, start the backend from `backend/`:

```sh
npm run dev
```

This runs `nodemon src/index.js`. To start without the development watcher, use:

```sh
npm start
```

In a separate terminal, start the frontend from `frontend/`:

```sh
npm run dev
```

Open the local URL printed by Vite. URL creation, listing, and redirects require the backend to be running and connected to MongoDB.

Available frontend scripts, run from `frontend/`:

```sh
npm run dev
npm run lint
npm run build
npm run preview
```

`preview` serves the production build locally; run `npm run build` first.

## How URL creation and clicks work

1. The dashboard checks that the destination is a valid HTTP or HTTPS URL.
2. The frontend sends the destination as `originalUrl` to the backend.
3. The backend validates the URL, generates a seven-character short code, and saves the URL document.
4. The dashboard shows the generated short URL using the configured backend origin.
5. When a visitor opens `/<shortCode>`, the backend finds the URL, increments and saves `clickCount`, then redirects to `originalUrl`.
6. The dashboard obtains URL records from the list API and derives its total-click statistic by summing the records' click counts. It requests the list again when its tab becomes visible.

Each URL document includes Mongoose `createdAt` and `updatedAt` timestamps. Clicks are counted on the URL document; individual click events and click timestamps are not currently recorded by the redirect handler.

## API

The backend origin is `https://linklytics-api-cwzx.onrender.com` when deployed. The API is mounted under `/api/v1/urls`.

Successful JSON API responses use this envelope:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success",
  "success": true
}
```

### Create a short URL

`POST /api/v1/urls`

Request body:

```json
{
  "originalUrl": "https://example.com/a/long/path"
}
```

Returns HTTP `201`. `data` is the created URL document, including `originalUrl`, `shortCode`, `clickCount`, `createdAt`, `updatedAt`, and its MongoDB `_id`.

### List URLs

`GET /api/v1/urls`

Returns HTTP `200`. `data` is an array of URL documents with the same fields as the create response.

### Redirect to a destination

`GET /:shortCode`

For an existing code, the backend increments and saves its `clickCount`, then responds with an HTTP redirect to the original URL. This route returns a redirect, not the JSON API response envelope.

### Backend status

`GET /`

Returns the plain-text response `Linklytics is running!`.

## Error handling

JSON API errors use this shape:

```json
{
  "success": false,
  "message": "Invalid URL format!",
  "data": null,
  "errors": []
}
```

URL creation returns HTTP `400` when `originalUrl` is missing, malformed, or uses a protocol other than HTTP or HTTPS. An unknown short code returns HTTP `404`. Other handled errors use their supplied status code or default to HTTP `500`.

The frontend displays API error messages and provides a retry action when it cannot load the link list. It also validates the URL before submission and reports success after creating a link.

## Planned improvements

These are possible future enhancements, not currently implemented:

- Add authentication and per-user link ownership.
- Add link editing and deletion endpoints and dashboard controls.
- Add search, filtering, and pagination for larger link lists.
- Add automated tests for API routes and frontend states.
- Record per-click timestamps and display click-history analytics.
