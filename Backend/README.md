# CUET Lost & Found Backend (Production Structure)

## Run

1. Copy `.env.example` to `.env`
2. Add MongoDB Atlas + Cloudinary credentials
3. Install dependencies
4. Start server

```bash
npm install
npm run dev
```

Health check: `GET /api/health`

## API: Report Item

`POST /api/items/report`

Content type: `multipart/form-data`

Authorization: `Bearer <JWT_TOKEN>`

Required form fields:
- `title` (text)
- `description` (text)
- `category` (text)
- `type` (`lost` or `found`)
- `image` (file)

### Frontend Example (Fetch + FormData)

```js
const formData = new FormData();
formData.append("title", values.title);
formData.append("description", values.description);
formData.append("category", values.category);
formData.append("type", values.type); // "lost" | "found"
formData.append("reportedBy", loggedInUserId);
formData.append("image", fileInput.files[0]);

const response = await fetch("http://localhost:5000/api/items/report", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

const result = await response.json();
console.log(result);
```

## API: Moderate Item (Admin/Super Admin)

`PATCH /api/items/:id/status`

Authorization: `Bearer <JWT_TOKEN>` (role must be `admin` or `super-admin`)

JSON body:

```json
{
  "status": "approved"
}
```

## Folder Structure

- `server.js` - startup + graceful shutdown
- `app.js` - express app + middleware + route mounting
- `config/` - DB and cloud provider configuration
- `controllers/` - route business logic
- `middleware/` - async wrapper + global error handlers
- `models/` - Mongoose schemas and indexes
- `routes/` - API endpoints
- `services/` - external service actions (Cloudinary upload)
- `utils/` - utility helpers (Multer setup)
