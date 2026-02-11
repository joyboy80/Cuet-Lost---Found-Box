# CUET Lost & Found Box

A modern, responsive web-based Lost and Found Management System for Chittagong University of Engineering & Technology (CUET). Built with HTML, CSS, and Vanilla JavaScript.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [Admin Guide](#admin-guide)
- [API Documentation (Planned)](#api-documentation-planned)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)
- [FAQ](#faq)
- [Changelog](#changelog)
- [License](#license)

---

## Overview

CUET Lost & Found Box helps students and staff report, search, and recover lost items through a centralized platform. The current version (v1.0) is a fully functional frontend using browser LocalStorage for data persistence. Backend integration is planned for v2.0.

### Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Storage:** Browser LocalStorage (demo)
- **Planned Backend:** Django REST Framework / FastAPI, PostgreSQL, JWT Auth

---

## Features

- **Home Page** — Hero section, feature showcase, statistics, recent items grid
- **Report Lost Item** — Comprehensive form with validation, optional image upload with preview
- **Report Found Item** — Required image upload, storage location field
- **Search & Filter** — Keyword search, category/date/location filters, grid/list view toggle, item detail modal
- **Community Feed** — Real-time updates, filter by type, infinite scroll
- **User Dashboard** — View reported items, track status, edit/delete, statistics
- **Admin Panel** — Pending reviews, approve/reject items, rejection reasons, search & filter
- **Super Admin** — User management, promote/demote admins, account suspension, system stats
- **Authentication** — Login, registration, form validation, role-based access control

### Design

- Vibrant gradients and soft color palettes
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Card-based layouts with shadow effects

---

## Project Structure

```
├── index.html              # Home page
├── login.html              # Login page
├── register.html           # Registration page
├── report-lost.html        # Report lost item
├── report-found.html       # Report found item
├── search.html             # Search and filter
├── feed.html               # Community feed
├── user-dashboard.html     # User dashboard
├── super-admin.html        # Super admin panel
├── QUICKSTART.html         # Quick start guide
├── css/
│   ├── style.css           # Main stylesheet
│   └── auth.css            # Auth page styles
├── js/
│   ├── main.js             # Common functionality & utilities
│   ├── auth.js             # Login/logout/registration logic
│   ├── report.js           # Form validation & submission
│   ├── search.js           # Search and filter logic
│   ├── feed.js             # Feed rendering & updates
│   ├── user-dashboard.js   # Dashboard operations
│   ├── admin.js            # Admin panel functionality
│   └── super-admin.js      # Super admin features
└── resources/              # Images & assets
```

---

## Installation

### Requirements

- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- 50 MB disk space

### Quick Start

```bash
git clone https://github.com/yourusername/cuet-lost-found-box.git
cd cuet-lost-found-box
```

Open `index.html` directly in your browser, or use a local server:

**Python:**
```bash
python -m http.server 8000
```

**Node.js:**
```bash
npx http-server -p 8000
```

**VS Code:** Install the "Live Server" extension, right-click `index.html` → "Open with Live Server"

Then navigate to `http://localhost:8000`.

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@cuet.ac.bd | admin123 |
| Super Admin | superadmin@cuet.ac.bd | superadmin123 |

> These are demo credentials. Production will use proper authentication.

### Configuration

The app uses CSS custom properties for theming. Edit `css/style.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #10b981;
    --accent-color: #f59e0b;
}
```

Mock data can be changed in the `mockItems` array in `js/main.js`.

---

## Usage Guide

### Report a Lost Item

1. Register/login to your account
2. Click "Report Lost Item" on the home page
3. Fill in all required fields (item name, category, description, date/time, location, contact info)
4. Optionally upload an image
5. Submit — wait for admin approval

### Report a Found Item

1. Login and click "Report Found Item"
2. Fill in item details + upload a clear image (required)
3. Specify the current storage location
4. Submit for admin review

### Search for Items

1. Go to "Search Items" page
2. Use the search bar for keywords
3. Apply filters: category, date range, location, status
4. Click any item card for full details
5. Contact the reporter if you find a match

### Tips

- Be as detailed as possible when reporting
- Include unique identifiers (serial numbers, marks)
- Upload clear, well-lit photos
- Report lost items immediately
- Respond quickly to potential matches
- Meet in safe, public locations for item recovery

---

## Admin Guide

### Reviewing Items

1. Login with admin credentials → Admin Panel
2. Click "Pending Reviews" tab
3. Review each item for completeness and appropriateness
4. Click "Approve" or "Reject" (provide reason if rejecting)

### What to Check

- Complete and accurate information
- Appropriate images (no offensive content)
- Realistic descriptions
- Proper category selection

### Super Admin Powers

- All admin capabilities
- Manage user accounts (promote/demote/suspend)
- View system-wide statistics
- Access system settings

---

## API Documentation (Planned)

> Coming in v2.0 (planned Q2 2026)

### Base URL

```
Production:  https://api.cuet-lost-found.com/v1
Development: http://localhost:8000/api/v1
```

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register new user |
| `/auth/login` | POST | Login, returns JWT tokens |
| `/auth/refresh` | POST | Refresh access token |
| `/auth/logout` | POST | Logout, invalidate token |

### Items

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/items` | GET | List all items (with filters, pagination) |
| `/items/{id}` | GET | Get single item |
| `/items/lost` | POST | Submit lost item report |
| `/items/found` | POST | Submit found item report |
| `/items/{id}` | PUT | Update item |
| `/items/{id}` | DELETE | Delete item |

### Admin

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/admin/items/{id}/review` | POST | Approve or reject item |
| `/admin/items/pending` | GET | Get pending items |

### User

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/users/me` | GET | Get current user profile |
| `/users/me` | PUT | Update profile |
| `/users/me/items` | GET | Get user's items |

### Other

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/categories` | GET | List categories |
| `/stats` | GET | Get system statistics |

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| UNAUTHORIZED | 401 | Invalid/missing authentication |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid request data |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |

### Rate Limits

- Authenticated: 100 req/min
- Unauthenticated: 20 req/min
- Admin: 200 req/min

### Data Models

**Item:**
```json
{
  "id": "integer",
  "type": "lost | found",
  "name": "string",
  "category": "object",
  "description": "text",
  "location": "string",
  "date": "datetime",
  "status": "pending | approved | rejected | resolved",
  "image_url": "string",
  "user": "object",
  "storage_location": "string (found items only)",
  "created_at": "datetime"
}
```

---

## Deployment

### Static Hosting Options (Current Frontend-Only)

| Platform | Cost | Notes |
|----------|------|-------|
| GitHub Pages | Free | Integrated with GitHub |
| Netlify | Free tier | Easy drag & drop |
| Vercel | Free tier | Great performance |
| Cloudflare Pages | Free | Global CDN |
| AWS S3 + CloudFront | Pay-as-you-go | Scalable |

### GitHub Pages

1. Push repo to GitHub
2. Settings → Pages → Branch: `main`
3. Access at `https://username.github.io/repo-name/`

### Netlify

1. Sign up at [netlify.com](https://netlify.com) with GitHub
2. Drag & drop the project folder, or connect the repo
3. Site goes live instantly

**`netlify.toml`:**
```toml
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel

```bash
npm install -g vercel
vercel        # deploy preview
vercel --prod # deploy production
```

### Docker (Future)

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Production Checklist

- [ ] Remove `console.log()` statements
- [ ] Minify CSS and JavaScript
- [ ] Optimize images
- [ ] Enable HTTPS
- [ ] Configure caching headers
- [ ] Test on multiple browsers and devices
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Set up uptime monitoring

---

## Security

### Reporting Vulnerabilities

**Do NOT open public GitHub issues for security vulnerabilities.**

Email: **security@cuet-lost-found.com**

Include: type of issue, affected files, steps to reproduce, potential impact.

- Acknowledgment within 48 hours
- Critical vulnerabilities addressed within 7 days

### Current Protections (v1.0)

- Input sanitization and validation
- Output encoding (XSS prevention)

### Current Limitations (v1.0)

- Data stored in browser LocalStorage (not encrypted)
- Client-side only — no server-side validation
- Passwords not securely hashed

### Planned for v2.0

- JWT-based authentication
- Secure password hashing (bcrypt)
- Server-side input validation
- HTTPS enforcement
- CSRF protection
- Rate limiting
- Security headers (Strict-Transport-Security, X-Frame-Options, CSP, etc.)

### Best Practices for Users

- Use strong, unique passwords
- Keep your browser updated
- Don't share login credentials
- Log out on shared devices
- Report suspicious activity

---

## Contributing

### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/cuet-lost-found-box.git
   cd cuet-lost-found-box
   ```
3. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Make changes, test thoroughly
5. Commit:
   ```bash
   git commit -m "feat(scope): description"
   ```
6. Push and create a Pull Request

### Commit Message Format

```
feat(search): add date range filter
fix(auth): resolve login validation issue
docs(readme): update installation instructions
style(css): format navbar styles
refactor(report): simplify form validation logic
```

### Coding Standards

**HTML:** Semantic HTML5, 4-space indentation, lowercase elements, alt text on images

**CSS:** Use CSS custom properties, meaningful class names, mobile-first approach, no `!important`

**JavaScript:** Use `const`/`let` (no `var`), camelCase naming, JSDoc comments, small focused functions, proper error handling

### Pull Request Checklist

- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested responsive design on mobile
- [ ] No console errors or `console.log()` left
- [ ] Code follows style guidelines
- [ ] Documentation updated if needed

### Code of Conduct

Be respectful, welcoming, and constructive. No harassment, trolling, or discriminatory behavior.

---

## FAQ

### General

**What is CUET Lost & Found Box?**
A platform for CUET students and staff to report and find lost items.

**Is it free?**
Yes, completely free.

**Do I need to register?**
Browsing the home page — no. Searching, reporting, or using the dashboard — yes.

**Is there a mobile app?**
Not yet. The website is fully responsive and works great on mobile browsers. A mobile app is planned for v3.0.

### Data & Privacy

**Where is my data stored?**
Currently in your browser's LocalStorage. v2.0 will use a secure backend database.

**Will clearing my browser delete my data?**
Yes, in v1.0. This is solved with backend integration in v2.0.

**Can I access my account from different devices?**
Not in v1.0 (browser-specific). v2.0 will support cross-device access.

**Is my information safe?**
Contact info is only visible to logged-in users. No data is shared with third parties.

### Troubleshooting

**Blank page?**
Check console (F12), ensure JavaScript is enabled, clear cache, try another browser.

**Forms not submitting?**
Check all required fields, verify email/phone format, check console for errors.

**Images not uploading?**
Max 5MB recommended. Supported formats: JPEG, PNG, GIF. Try compressing large images.

**Search not returning results?**
Clear all filters, try broader keywords, refresh the page.

**Page looks broken?**
Hard refresh (Ctrl+Shift+R), clear cache, disable browser extensions.

---

## Changelog

### v1.0.0 — 2026-02-08 (Initial Release)

**Core Features:**
- Home page with hero section, feature showcase, statistics
- Authentication (login, register, role-based access)
- Report lost/found items with form validation and image upload
- Advanced search with filters (category, date, location)
- Community feed with real-time updates
- User dashboard (view, edit, delete items, track status)
- Admin panel (review, approve/reject items)
- Super admin (user management, promote/demote, system stats)

**Design:**
- 1500+ lines of custom CSS
- CSS custom properties theming
- Gradient color schemes, smooth animations
- Responsive breakpoints (mobile < 768px, tablet 768-1023px, desktop 1024px+)

**Known Issues:**
- LocalStorage only (data not persistent across browsers)
- No backend integration yet
- Images stored as base64 (temporary)
- No email notifications

### v0.2.0 — 2026-01-20

- Super admin functionality
- User management system
- Role-based access control
- Improved mobile responsiveness

### v0.1.0 — 2026-01-05

- Initial project structure
- Basic HTML pages and CSS styling
- JavaScript foundations
- Mock data for testing

### Roadmap

| Version | Target | Key Features |
|---------|--------|--------------|
| v1.1.0 | Mar 2026 | PWA, offline support, accessibility (WCAG 2.1) |
| v2.0.0 | Jun 2026 | Backend API, database, auth, email notifications |
| v2.1.0 | Sep 2026 | Real-time chat, SMS, AI image matching |
| v3.0.0 | Dec 2026 | Mobile app, multi-language, campus map integration |

---

## Contributors

### Core Team

- **Project Lead** — Architecture, frontend, UI/UX design
- **Frontend Developer** — HTML/CSS, responsive design, animations
- **JavaScript Developer** — Interactive features, data handling
- **UI/UX Designer** — Color scheme, user flows, wireframes

### Advisors

- **CUET** — Inspiration and use case
- Alpha testers — CUET students, faculty, and staff

Want to contribute? See the [Contributing](#contributing) section above.

---

## License

MIT License — Copyright (c) 2026 CUET Lost & Found Box Project

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to the conditions in the [LICENSE](LICENSE) file.

---

## Support

- **Email:** support@cuet-lost-found.com
- **Security:** security@cuet-lost-found.com
- **GitHub Issues:** [Open an issue](https://github.com/yourusername/cuet-lost-found-box/issues)

---

> **Note:** This is a frontend-only implementation (v1.0). For production use, integrate with a backend API for data persistence, authentication, and notifications.
