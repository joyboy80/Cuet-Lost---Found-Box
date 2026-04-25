# CUET Lost & Found Box

A full-stack Lost and Found platform for CUET students, teachers, and staff.

This repository contains:
- `Backend/` - Express + MongoDB API with auth, reporting, moderation, matching, notifications, and role management.
- `Frontend/` - Multi-page HTML/CSS/JavaScript UI for users, admins, and super-admins.
- `Mail Sender/` - Dedicated email verification OTP microservice using Brevo SMTP.

## 1. Project Goals

The platform helps users:
- Report lost and found items.
- Browse/search reported items.
- Track personal reports.
- Verify account emails via OTP.
- Support admin moderation and match confirmation workflows.

## 2. Tech Stack

- Frontend: HTML5, CSS3, Vanilla JavaScript
- Backend: Node.js, Express, Mongoose, JWT, Multer, Cloudinary
- Database: MongoDB (Atlas preferred, local fallback supported)
- Email Service: Nodemailer + Brevo SMTP

## 3. Repository Structure

```text
Cuet Lost & Found Box/
|- package.json
|- README.md
|- Backend/
|  |- app.js
|  |- server.js
|  |- .env.example
|  |- config/
|  |- controllers/
|  |- middleware/
|  |- models/
|  |- routes/
|  |- services/
|  |- utils/
|- Frontend/
|  |- index.html
|  |- login.html
|  |- register.html
|  |- feed.html
|  |- report-lost.html
|  |- report-found.html
|  |- search.html
|  |- user-dashboard.html
|  |- admin.html
|  |- super-admin.html
|  |- verify-email.html
|  |- css/
|  |- js/
|- Mail Sender/
|  |- index.js
|  |- package.json
```

## 4. Main Features

### User Features
- Register and login with CUET domain restrictions.
- OTP-based email verification.
- Report lost/found items with image upload.
- View own items and successful posts.
- Upload avatar image.

### Admin/Super Admin Features
- Moderate item status.
- Review pending matches.
- Confirm/reject/notify matches.
- Super-admin user management (list/block/delete users).

### Platform Features
- JWT authentication (cookie and bearer token support).
- Role-based authorization.
- Cloudinary-based image storage support.
- MongoDB connection fallback (`MONGO_URI` -> `MONGO_URI_LOCAL`).

## 5. Prerequisites

Install before running locally:
- Node.js (18+ recommended)
- npm (comes with Node.js)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for production-grade image hosting)
- Brevo account credentials (for OTP email sending)

## 6. Environment Variables

### Backend (`Backend/.env`)

Copy `Backend/.env.example` to `Backend/.env` and update values.

Required/important keys:
- `NODE_ENV`
- `PORT` (default: `5000`)
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `DEFAULT_SUPER_ADMIN_NAME`
- `DEFAULT_SUPER_ADMIN_EMAIL`
- `DEFAULT_SUPER_ADMIN_PASSWORD`
- `CORS_ORIGIN` (comma-separated origins)
- `MONGO_URI`
- `MONGO_URI_LOCAL` (optional fallback)
- `MONGO_MAX_POOL_SIZE`
- `MONGO_MIN_POOL_SIZE`
- `MONGO_SERVER_SELECTION_TIMEOUT_MS`
- `MONGO_SOCKET_TIMEOUT_MS`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Mail Sender (`Mail Sender/.env`)

Create `Mail Sender/.env` with:

```env
BREVO_USER=your_brevo_smtp_user
BREVO_PASS=your_brevo_smtp_password
SENDER_EMAIL=no-reply@your-domain.com
MAIL_SENDER_PORT=5001
```

## 7. Installation and Run (Local)

### Option A: Run each service directly (recommended for development)

1. Install root dependencies (minimal scripts helper):

```bash
npm install
```

2. Install backend dependencies:

```bash
cd Backend
npm install
```

3. Install mail sender dependencies:

```bash
cd ../Mail Sender
npm install
```

4. Run backend:

```bash
cd ../Backend
npm run dev
```

5. Run mail sender (optional unless you wire backend to local mail URL):

```bash
cd ../Mail Sender
npm run dev
```

6. Serve frontend:
- You can open `Frontend/*.html` with a static server (for example VS Code Live Server), OR
- Start backend and visit `http://localhost:5000/` because backend serves `Frontend/` statically.

### Option B: Use root scripts for backend only

From repository root:

```bash
npm run dev:backend
```

## 8. Runtime URLs

- Backend local: `http://localhost:5000`
- Health check: `GET http://localhost:5000/api/health`
- Mail sender local: `http://localhost:5001`

Frontend API base is set in `Frontend/js/config.js` and defaults to:
- `https://cuet-lost-found-box.onrender.com/api`

For local backend testing, set `window.API_BASE_URL` before loading the frontend scripts (or update config behavior according to your deployment strategy).

## 9. Backend API Overview

### Auth Routes (`/api/auth`)
- `POST /register`
- `POST /verify-email`
- `POST /login`
- `POST /logout`

### Item Routes (`/api/items`)
- `POST /report` (protected, multipart image upload)
- `GET /` (protected)
- `GET /my-items` (protected)
- `PATCH /:id/status` (admin/super-admin)

### User Routes (`/api/users` and `/api/user`)
- `GET /profile` (protected)
- `GET /successful-posts` (protected)
- `POST /upload-avatar` (protected)
- `GET /admin/users` (super-admin)
- `PATCH /admin/users/:id/status` (super-admin)
- `DELETE /admin/users/:id` (super-admin)

### Admin Match Routes (`/api/admin`)
- `GET /matches` (admin/super-admin)
- `PUT /match/confirm/:id` (admin/super-admin)
- `PUT /match/reject/:id` (admin/super-admin)
- `PUT /match/notify/:id` (admin/super-admin)

## 10. Authentication and Roles

- Access token: JWT signed with `JWT_SECRET`.
- Token can be used via:
  - `Authorization: Bearer <token>` header, or
  - `authToken` HTTP-only cookie.
- Effective role check uses `systemRole` first (if present), then `role`.

Role model in current codebase:
- Domain role: `student`, `teacher`, `staff`
- System role: `user`, `admin`, `super-admin`

## 11. Image Upload Notes

- Upload middleware accepts only image MIME types.
- Max file size is 5MB.
- Cloudinary is enabled only when all required Cloudinary env vars are present.

## 12. Email Verification Notes

- `Mail Sender` provides `POST /api/verify-email` and sends a 6-digit OTP.
- OTP expiry in backend logic is 10 minutes.
- Current backend registration flow calls a fixed hosted verification URL in code (`authController.js`).
  - If you want fully local OTP flow, point that call to your local mail sender URL.

## 13. Deployment Notes

Common deployment split:
- Frontend: Vercel/static hosting
- Backend API: Render/Node host
- Mail Sender API: Render/Node host
- MongoDB: Atlas
- Image storage: Cloudinary

Make sure all production origins are included in CORS settings (`CORS_ORIGIN`) and frontend API base configuration.

## 14. Known Gaps / Future Improvements

- Add automated tests (unit/integration).
- Add API docs (OpenAPI/Swagger).
- Remove hardcoded mail-service URL and move to env variable.
- Add centralized logging and monitoring.
- Add CI/CD pipeline with lint/test checks.

## 15. Useful Commands

From repository root:

```bash
npm run start:backend
npm run dev:backend
```

From `Backend/`:

```bash
npm start
npm run dev
```

From `Mail Sender/`:

```bash
npm start
npm run dev
```

---

If you want, a follow-up update can add a compact `README.quickstart.md` focused only on 5-minute local setup.