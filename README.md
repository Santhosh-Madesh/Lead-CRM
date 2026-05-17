# Lead Management CRM

A RESTful Lead Management CRM API built with Node.js, Express, MongoDB, and JSON Web Tokens.

This project provides user authentication, lead creation and management, lead note tracking, staff assignment, and dashboard statistics.

## Features

- User registration and login
- JWT-based authentication
- Lead CRUD operations
- Lead note creation and retrieval
- Lead status updates
- Staff assignment for leads
- Dashboard statistics endpoint
- Role-based access control for admin-only actions

## Tech stack

- Node.js
- Express
- MongoDB / Mongoose
- bcrypt
- JSON Web Tokens (JWT)
- dotenv
- CORS
- Zod validation

## Install

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd "Lead Management CRM"
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with the following values:

   ```env
   DB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ORIGIN=http://localhost:3000
   ```

4. Start the server

   ```bash
   npm run dev
   ```

The API will start on `http://localhost:5000` by default.

## Environment variables

- `DB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key used to sign JWT tokens
- `PORT` - Optional server port (default: `5000`)
- `ORIGIN` - Allowed CORS origin

## API Endpoints

### Health check

- `GET /health`

### Authentication

- `POST /auth/register`
  - Body: `{ "name": "...", "email": "...", "password": "..." }`
  - Creates a new user with default role `staff`.

- `POST /auth/login`
  - Body: `{ "email": "...", "password": "..." }`
  - Returns a JWT token and basic user details.

- `GET /auth/me`
  - Protected route
  - Requires `Authorization: Bearer <token>`
  - Returns profile data and lead statistics for the authenticated user.

### Lead management

- `GET /leads`
  - Protected route
  - Query params: `status`, `search`, `sort`, `page`, `limit`
  - Returns a paginated list of leads.

- `GET /leads/:id`
  - Protected route
  - Returns a single lead by ID.

- `POST /leads`
  - Protected route
  - Body: `{ "name": "...", "contact": "..." }`
  - Creates a new lead.

- `PUT /leads/:id`
  - Protected route
  - Body can include `name` and/or `contact`
  - Updates lead data if the user is the assigned staff or an admin.

- `DELETE /leads/:id`
  - Protected route
  - Deletes a lead and its associated notes if the user is the assigned staff or an admin.

### Lead notes

- `POST /leads/:id/notes`
  - Protected route
  - Body: `{ "title": "...", "content": "..." }`
  - Adds a note to a lead.

- `GET /leads/:id/notes`
  - Protected route
  - Retrieves all notes attached to a lead.

### Status and staff endpoints

- `PUT /leads/:id/status`
  - Protected route
  - Body: `{ "status": "..." }`
  - Valid statuses: `not_contacted`, `contacted`, `follow_up_needed`, `success`, `failure`

- `GET /staff`
  - Protected route
  - Returns all users with role `staff`.

- `PUT /staff/assign/:leadId/:staffId`
  - Protected route
  - Admin-only
  - Assigns a lead to a staff member.

- `PUT /currentLeadUpdate/:staffId/:value`
  - Protected route
  - Admin-only
  - Updates the `current_leads` count for a staff user.

- `PUT /successLeadUpdate/:staffId/:value`
  - Protected route
  - Admin-only
  - Updates the `successful_leads` count for a staff user.

- `PUT /failureLeadUpdate/:staffId/:value`
  - Protected route
  - Admin-only
  - Updates the `unsuccessful_leads` count for a staff user.

- `PUT /totalLeadUpdate/:staffId/:value`
  - Protected route
  - Admin-only
  - Updates the `total_leads` count for a staff user.

### Dashboard

- `GET /dashboard/stats`
  - Protected route
  - Admin-only
  - Returns aggregated data for leads and staff.

## Authentication

All protected routes require a Bearer token in the `Authorization` header.

Example:

```http
Authorization: Bearer <token>
```

## Notes

- User roles are defined in the database as `staff` or `admin`.
- New users are created as `staff` by default.
- The login route issues a JWT with a 1-day expiration.

## Scripts

- `npm run dev` - start the server with automatic reload using `node --watch server.js`
- `npm test` - placeholder test script

## Project structure

- `server.js` - application entry point
- `routes/` - route definitions
- `controllers/` - request handlers
- `models/` - Mongoose models and database helper functions
- `middlewares/` - authentication, validation, error handling
- `validators/` - request validation schemas
- `db/` - database connection logic
