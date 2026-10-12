# Linklytics

Linklytics is a URL shortener with a React dashboard and an Express/MongoDB API. Create short links, copy and share them, and view the links and click totals returned by the backend.

## Key features

- Create short links from valid HTTP or HTTPS URLs.
- Generate seven-character short codes.
- View saved links with their destination, short code, click count, and creation date.
- See total link and click counts in the dashboard.
- Copy a newly created short URL from the dashboard.
- Redirect short URLs to their destinations and increment the corresponding link's click count.
- Refresh the dashboard link list when its browser tab becomes visible again.
- Show loading, empty, and error states in the frontend.

## Tech stack

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

Versions listed above reflect the project's package manifests.

## How it works

1. The dashboard sends the destination URL to the backend.
2. The backend validates that it is an HTTP or HTTPS URL, generates a short code, and saves the URL document in MongoDB.
3. The frontend displays the short URL using the configured backend origin and the generated code.
4. A request to `/<shortCode>` finds the corresponding document, increments and saves its `clickCount`, then redirects to the original URL.
5. The dashboard reads saved URL documents from the API. Its total-click statistic is calculated by summing their `clickCount` values. The list is fetched again when the dashboard tab becomes visible.

The click counter is stored on each URL document. Although a click model is present in the backend source, the redirect handler updates the URL's counter directly.

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

- Node.js and npm versions compatible with the dependencies in both package manifests.
- A MongoDB instance, either local or hosted, and its connection URI.

## Installation and setup

Clone the repository, then install dependencies for each application in its own directory:

```sh
cd backend
npm install
cd ../frontend
npm install
```

### Backend environment

Create `backend/.env` with the following variables:

```dotenv
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/linklytics
```

`PORT` is optional and defaults to `8000`. `MONGODB_URI` must point to a reachable MongoDB instance. For a hosted database, put your own connection URI in this local environment file; do not commit credentials or share the URI.

### Frontend environment

Create `frontend/.env.local`:

```dotenv
VITE_API_BASE_URL=http://localhost:8000
```

Set this to the backend's origin (scheme, host, and optional port), without the `/api/v1/urls` path. The frontend appends the API path itself. Vite exposes `VITE_` variables to client-side code, so this variable must contain only the non-secret backend URL, never credentials or other secrets.

Both environment files are intended to remain local and are covered by the repository's ignore rules.

## API

The backend serves the URL API under `/api/v1/urls`. JSON API responses use this envelope:

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

On success, the endpoint returns HTTP `201`. `data` is the created URL document, including `originalUrl`, `shortCode`, `clickCount`, `createdAt`, and `updatedAt`.

### List URLs

`GET /api/v1/urls`

On success, the endpoint returns HTTP `200`. `data` is an array of URL documents with the same fields as the created URL document.

### Redirect and record a click

`GET /:shortCode`

For a known code, the backend increments and saves that URL's `clickCount`, then responds with an HTTP redirect to `originalUrl`. This route returns a redirect rather than the JSON API envelope.

### Backend status

`GET /`

Returns the plain-text response `Linklytics is running!`.

## Error handling

JSON API errors use this structure:

```json
{
  "success": false,
  "message": "Invalid URL format!",
  "data": null,
  "errors": []
}
```

Creating a URL returns HTTP `400` when the URL is missing, malformed, or uses a protocol other than HTTP or HTTPS. Redirecting an unknown short code returns HTTP `404`. Other errors handled by the backend middleware use the error's status code when available, or HTTP `500` otherwise.

The frontend displays backend error messages for failed API requests and provides a retry action if the link list cannot be loaded.

## Run locally

Start the backend from the `backend` directory:

```sh
npm run dev
```

This uses `nodemon` to run `src/index.js`. To run without the development watcher, use:

```sh
npm start
```

In a separate terminal, start the frontend from the `frontend` directory:

```sh
npm run dev
```

Open the local address printed by Vite. The backend must be running and connected to MongoDB for URL creation, listing, and redirects to work.

Other frontend package scripts:

```sh
npm run lint
npm run build
npm run preview
```

`preview` serves the production build locally; run `npm run build` first.

## Planned improvements

The following are ideas for future development and are not implemented features:

- Add authentication and per-user link ownership.
- Add link editing and deletion endpoints and dashboard controls.
- Add search, filtering, and pagination for larger link lists.
- Add automated tests for API routes and frontend states.
- Record and display richer per-click analytics, such as click history.
