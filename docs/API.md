# API Documentation

**Status**: 🚧 **Coming in v2.0** 🚧

This document outlines the planned REST API for CUET Lost & Found Box backend integration.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## 🌐 Overview

The CUET Lost & Found Box API will be a RESTful API that allows clients to:
- Manage user accounts
- Submit and retrieve lost/found item reports
- Search and filter items
- Handle administrative functions
- Receive notifications

### API Version

- **Current Version**: Not yet available
- **Planned Version**: v1
- **Release Date**: Q2 2026 (v2.0)

### Technology Stack (Planned)

- **Framework**: Django REST Framework or FastAPI
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: AWS S3 or Cloudinary
- **Documentation**: OpenAPI/Swagger

---

## 🔗 Base URL

```
Production:  https://api.cuet-lost-found.com/v1
Development: http://localhost:8000/api/v1
```

---

## 🔐 Authentication

### Registration

**Endpoint**: `POST /auth/register`

**Request Body**:
```json
{
  "email": "student@cuet.ac.bd",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "student_id": "C211001",
  "department": "CSE",
  "phone": "+8801712345678"
}
```

**Response** (201 Created):
```json
{
  "user": {
    "id": 1,
    "email": "student@cuet.ac.bd",
    "full_name": "John Doe",
    "student_id": "C211001",
    "department": "CSE",
    "role": "user",
    "created_at": "2026-02-08T10:00:00Z"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### Login

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "student@cuet.ac.bd",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": 1,
    "email": "student@cuet.ac.bd",
    "full_name": "John Doe",
    "role": "user"
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### Token Refresh

**Endpoint**: `POST /auth/refresh`

**Request Body**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response** (200 OK):
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Logout

**Endpoint**: `POST /auth/logout`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response** (200 OK):
```json
{
  "message": "Logout successful"
}
```

---

## 📌 Endpoints

### Items

#### List All Items

**Endpoint**: `GET /items`

**Query Parameters**:
- `status` (optional): `lost` | `found` | `all`
- `category` (optional): Category ID or name
- `location` (optional): Location name
- `date_from` (optional): ISO date string
- `date_to` (optional): ISO date string
- `search` (optional): Search query
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Example Request**:
```
GET /items?status=lost&category=electronics&page=1&limit=10
```

**Response** (200 OK):
```json
{
  "count": 45,
  "next": "/items?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "type": "lost",
      "name": "iPhone 13 Pro",
      "category": {
        "id": 1,
        "name": "Electronics"
      },
      "description": "Blue iPhone 13 Pro with cracked screen",
      "location": "Central Library",
      "date": "2026-02-05T14:30:00Z",
      "status": "approved",
      "image_url": "https://cdn.example.com/images/item1.jpg",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "student@cuet.ac.bd",
        "phone": "+8801712345678"
      },
      "created_at": "2026-02-05T15:00:00Z",
      "updated_at": "2026-02-05T16:00:00Z"
    }
  ]
}
```

#### Get Single Item

**Endpoint**: `GET /items/{id}`

**Response** (200 OK):
```json
{
  "id": 1,
  "type": "lost",
  "name": "iPhone 13 Pro",
  "category": {
    "id": 1,
    "name": "Electronics"
  },
  "description": "Blue iPhone 13 Pro with cracked screen protector",
  "location": "Central Library, 2nd Floor",
  "date": "2026-02-05T14:30:00Z",
  "status": "approved",
  "image_url": "https://cdn.example.com/images/item1.jpg",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "student@cuet.ac.bd",
    "phone": "+8801712345678",
    "student_id": "C211001"
  },
  "storage_location": null,
  "created_at": "2026-02-05T15:00:00Z",
  "updated_at": "2026-02-05T16:00:00Z",
  "approved_by": {
    "id": 5,
    "name": "Admin User"
  },
  "approved_at": "2026-02-05T16:00:00Z"
}
```

#### Create Lost Item

**Endpoint**: `POST /items/lost`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body** (multipart/form-data):
```json
{
  "name": "Samsung Laptop",
  "category_id": 1,
  "description": "Black Samsung laptop with stickers",
  "location": "Cafeteria",
  "date": "2026-02-07T10:00:00Z",
  "contact_name": "Jane Doe",
  "email": "jane@cuet.ac.bd",
  "phone": "+8801812345678",
  "image": "<file>"
}
```

**Response** (201 Created):
```json
{
  "id": 2,
  "type": "lost",
  "name": "Samsung Laptop",
  "status": "pending",
  "message": "Item submitted for review"
}
```

#### Create Found Item

**Endpoint**: `POST /items/found`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body** (multipart/form-data):
```json
{
  "name": "Blue Backpack",
  "category_id": 3,
  "description": "Blue backpack with CUET logo",
  "location": "Main Gate",
  "date": "2026-02-07T08:30:00Z",
  "storage_location": "Security Office",
  "contact_name": "Mike Smith",
  "email": "mike@cuet.ac.bd",
  "phone": "+8801912345678",
  "image": "<file>"
}
```

**Response** (201 Created):
```json
{
  "id": 3,
  "type": "found",
  "name": "Blue Backpack",
  "status": "pending",
  "message": "Item submitted for review"
}
```

#### Update Item

**Endpoint**: `PUT /items/{id}`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "name": "Updated Item Name",
  "description": "Updated description",
  "location": "Updated location"
}
```

**Response** (200 OK):
```json
{
  "id": 2,
  "message": "Item updated successfully",
  "status": "pending"
}
```

#### Delete Item

**Endpoint**: `DELETE /items/{id}`

**Headers**: `Authorization: Bearer <access_token>`

**Response** (204 No Content)

### Admin Endpoints

#### Review Item (Approve/Reject)

**Endpoint**: `POST /admin/items/{id}/review`

**Headers**: `Authorization: Bearer <admin_access_token>`

**Request Body**:
```json
{
  "action": "approve",  // or "reject"
  "reason": "Optional rejection reason"
}
```

**Response** (200 OK):
```json
{
  "id": 2,
  "status": "approved",
  "message": "Item approved successfully"
}
```

#### Get Pending Items

**Endpoint**: `GET /admin/items/pending`

**Headers**: `Authorization: Bearer <admin_access_token>`

**Response** (200 OK):
```json
{
  "count": 15,
  "results": [...]
}
```

### User Endpoints

#### Get User Profile

**Endpoint**: `GET /users/me`

**Headers**: `Authorization: Bearer <access_token>`

**Response** (200 OK):
```json
{
  "id": 1,
  "email": "student@cuet.ac.bd",
  "full_name": "John Doe",
  "student_id": "C211001",
  "department": "CSE",
  "phone": "+8801712345678",
  "role": "user",
  "items_reported": 5,
  "items_found": 2,
  "created_at": "2026-01-15T10:00:00Z"
}
```

#### Update User Profile

**Endpoint**: `PUT /users/me`

**Headers**: `Authorization: Bearer <access_token>`

**Request Body**:
```json
{
  "full_name": "John M. Doe",
  "phone": "+8801712345679",
  "department": "EEE"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "message": "Profile updated successfully"
}
```

#### Get User's Items

**Endpoint**: `GET /users/me/items`

**Headers**: `Authorization: Bearer <access_token>`

**Response** (200 OK):
```json
{
  "count": 5,
  "results": [...]
}
```

### Categories

#### List Categories

**Endpoint**: `GET /categories`

**Response** (200 OK):
```json
{
  "categories": [
    {"id": 1, "name": "Electronics", "icon": "📱"},
    {"id": 2, "name": "Books", "icon": "📚"},
    {"id": 3, "name": "Bags & Accessories", "icon": "🎒"}
  ]
}
```

### Statistics

**Endpoint**: `GET /stats`

**Response** (200 OK):
```json
{
  "total_items": 250,
  "lost_items": 150,
  "found_items": 100,
  "resolved_items": 45,
  "pending_reviews": 12,
  "users_registered": 500
}
```

---

## 📊 Data Models

### User Model

```json
{
  "id": "integer",
  "email": "string (unique)",
  "full_name": "string",
  "student_id": "string (optional)",
  "department": "string (optional)",
  "phone": "string (optional)",
  "role": "string (user|admin|superadmin)",
  "is_active": "boolean",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Item Model

```json
{
  "id": "integer",
  "type": "string (lost|found)",
  "name": "string",
  "category": "object",
  "description": "text",
  "location": "string",
  "date": "datetime",
  "storage_location": "string (optional, for found items)",
  "status": "string (pending|approved|rejected|resolved)",
  "image_url": "string",
  "user": "object",
  "contact_name": "string",
  "email": "string",
  "phone": "string",
  "rejection_reason": "text (optional)",
  "created_at": "datetime",
  "updated_at": "datetime",
  "approved_by": "object (optional)",
  "approved_at": "datetime (optional)"
}
```

---

## ⚠️ Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

---

## 🚦 Rate Limiting

- **Authenticated users**: 100 requests per minute
- **Unauthenticated**: 20 requests per minute
- **Admin users**: 200 requests per minute

**Rate Limit Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1644318000
```

---

## 📝 Notes

This API documentation is a **work in progress** and will be finalized with the v2.0 release.

For the latest updates, check the [CHANGELOG.md](../CHANGELOG.md).

---

*Last Updated: February 8, 2026*
