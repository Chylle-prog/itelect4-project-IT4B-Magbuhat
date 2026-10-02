# GT4 Part 1 Backend

This is the Session 9 Node, Express, MongoDB, and JWT backend for the lost-and-found app. It is kept separate from the Vite frontend; the frontend-to-API connection is scheduled for Session 11.

## Run locally

1. Install Node.js, then run `npm install` in this directory.
2. Create a free MongoDB Atlas cluster and database user. Allow your current IP address and copy the Node.js connection string.
3. Copy `.env.example` to `.env`, set `MONGODB_URI` to the Atlas URI (with a database name such as `gt4_lost_found`), and set `JWT_SECRET` to a private random value.
4. Run `npm run dev`. The API listens on port 4000 after MongoDB connects.

`npm run build` type-checks and compiles the server to `dist/`; `npm start` runs the compiled server. Never commit `.env`.

## Routes

| Method | Path | Access |
| --- | --- | --- |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/health` | Public |
| GET | `/api/items` | Bearer token |
| GET | `/api/items/:id` | Bearer token |
| POST | `/api/items` | Bearer token |
| PATCH | `/api/items/:id` | Bearer token |
| DELETE | `/api/items/:id` | Bearer token |

Every item operation is limited to items whose `postedByUserId` matches the authenticated user. The server sets that owner on creation; clients cannot set or change it. A missing or another user's item returns 404.

New items require `title`, `description`, `category`, `status`, and `location`. Categories are `Accessories` and `Personal Items`; status is `lost` or `found`. The item schema also enforces title and description length limits.