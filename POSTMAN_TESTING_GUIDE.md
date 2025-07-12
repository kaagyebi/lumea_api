# Lumea API - Postman Testing Guide

## Quick Fixes for Your Errors
**Problem 1:** `Cannot POST /api/skinreport/upload`  
**Solution:** Use `POST /api/skin-reports/upload` instead (note the hyphen)

**Problem 2:** `Cannot PATCH /api/users/profile`  
**Solution:** Use `PATCH /api/users/me/profile` or `PATCH /api/users/profile` (both work now)

---

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in your project root:
```env
MONGO_URI=mongodb://localhost:27017/lumea_api
JWT_SECRET=your_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
OPENAI_API_KEY=your_openai_key
PORT=5000
```

### 2. Start the Server
```bash
npm run dev
```

---

## Postman Collection Setup

### Step 1: Create Environment Variables
In Postman, create an environment with these variables:
- `base_url`: `http://localhost:5001`
- `token`: (leave empty, will be filled after login)

### Step 2: Authentication Flow

#### 1. Register a User
**Request:**
- Method: `POST`
- URL: `{{base_url}}/api/auth/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response:** You'll get a JWT token. Copy it to your environment variable `token`.

#### 2. Login (Alternative)
**Request:**
- Method: `POST`
- URL: `{{base_url}}/api/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

## Testing All Endpoints

### Authentication Endpoints

#### POST /api/auth/register
- **Purpose:** Create new account
- **Body:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "user"
}
```

#### POST /api/auth/login
- **Purpose:** Get JWT token
- **Body:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### User Management Endpoints

#### GET /api/users?role=cosmetologist
- **Purpose:** Get all cosmetologists
- **Headers:** `Authorization: Bearer {{token}}`

#### GET /api/users/me/profile
- **Purpose:** Get current user profile
- **Headers:** `Authorization: Bearer {{token}}`

#### PATCH /api/users/me/profile
- **Purpose:** Update user profile
- **Headers:** `Authorization: Bearer {{token}}`
- **Body:**
```json
{
  "bio": "I love skincare!",
  "specialization": "Anti-aging",
  "availability": "Mon-Fri 9AM-5PM"
}
```

#### GET /api/users/me/history
- **Purpose:** Get user skin history
- **Headers:** `Authorization: Bearer {{token}}`

### Appointment Endpoints

#### POST /api/appointments
- **Purpose:** Book appointment
- **Headers:** `Authorization: Bearer {{token}}`
- **Body:**
```json
{
  "cosmetologist": "cosmetologist_id_here",
  "date": "2024-01-15",
  "time": "14:00",
  "skinType": "Combination",
  "tone": "Fair",
  "description": "Skin consultation"
}
```

#### GET /api/appointments
- **Purpose:** Get user appointments
- **Headers:** `Authorization: Bearer {{token}}`

#### GET /api/appointments?status=pending
- **Purpose:** Get filtered appointments
- **Headers:** `Authorization: Bearer {{token}}`

#### PATCH /api/appointments/:id
- **Purpose:** Update appointment status
- **Headers:** `Authorization: Bearer {{token}}`
- **Body:**
```json
{
  "status": "accepted",
  "notes": "Appointment confirmed"
}
```

### Skin Report Endpoints

#### POST /api/skin-reports/upload
- **Purpose:** Upload and analyze skin image
- **Headers:** `Authorization: Bearer {{token}}`
- **Body:** `form-data`
  - Key: `image` (Type: File)
  - Value: Select your image file (jpg, png, jpeg)

#### GET /api/skin-reports
- **Purpose:** Get all skin reports
- **Headers:** `Authorization: Bearer {{token}}`

#### GET /api/skin-reports/:id
- **Purpose:** Get specific skin report
- **Headers:** `Authorization: Bearer {{token}}`
- **URL:** Replace `:id` with actual report ID

#### GET /api/skin-reports/:id/download
- **Purpose:** Download report as PDF
- **Headers:** `Authorization: Bearer {{token}}`
- **URL:** Replace `:id` with actual report ID

### Cosmetologist Endpoints

#### PATCH /api/cosmetologist/availability
- **Purpose:** Update availability
- **Headers:** `Authorization: Bearer {{token}}`
- **Body:**
```json
{
  "availability": "Mon-Fri 9AM-5PM"
}
```

#### GET /api/cosmetologist/appointments
- **Purpose:** Get cosmetologist appointments
- **Headers:** `Authorization: Bearer {{token}}`

### Recommendation Endpoints

#### GET /api/recommendation/user/:userId
- **Purpose:** Get user recommendations
- **Headers:** `Authorization: Bearer {{token}}`

#### POST /api/recommendation/create
- **Purpose:** Create recommendation
- **Headers:** `Authorization: Bearer {{token}}`
- **Body:**
```json
{
  "userId": "user_id_here",
  "products": ["Product 1", "Product 2"],
  "routines": ["Morning routine", "Evening routine"],
  "generatedBy": "cosmetologist"
}
```

---

## Common Issues & Solutions

### 1. "Cannot POST /api/skinreport/upload"
**Solution:** Use `/api/skin-reports/upload` (note the hyphen)

### 2. "Cannot PATCH /api/users/profile"
**Solution:** Use `/api/users/me/profile` or `/api/users/profile` (both work)

### 3. "Not authorized, no token"
**Solution:** Add `Authorization: Bearer {{token}}` header

### 4. "User already exists"
**Solution:** Use a different email or login instead

### 5. Image upload fails
**Solution:** 
- Use `form-data` not `raw JSON`
- Set key as `image` and type as `File`
- Ensure file is jpg, png, or jpeg

### 6. "MongoDB connection failed"
**Solution:** Start MongoDB or check your `MONGO_URI`

---

## Testing Workflow

1. **Start the server:** `npm run dev`
2. **Register a user:** `POST /api/auth/register`
3. **Login:** `POST /api/auth/login` (save token)
4. **Test user endpoints:** Profile, appointments, etc.
5. **Upload skin image:** `POST /api/skin-reports/upload`
6. **Get analysis:** `GET /api/skin-reports`
7. **Download PDF:** `GET /api/skin-reports/:id/download`

---

## Success Indicators

- **Registration/Login:** Returns JWT token
- **Image Upload:** Returns analysis data with report ID
- **PDF Download:** Downloads a PDF file
- **Appointments:** Returns appointment data
- **All endpoints:** Return JSON responses (not HTML errors)

---

## Debugging Tips

1. **Check server logs** for detailed error messages
2. **Verify environment variables** are set correctly
3. **Test with Postman's console** to see request/response details
4. **Use different user accounts** to test role-based access
5. **Check file uploads** with small test images first

---

## CORRECT ROUTES SUMMARY

### Working Routes:
- `POST /api/skin-reports/upload` (not `/api/skinreport/upload`)
- `PATCH /api/users/me/profile` (not `/api/users/profile`)
- `GET /api/users/me/profile`
- `GET /api/users/me/history`

### Alternative Routes (for backward compatibility):
- `PATCH /api/users/profile` (also works now)
- `GET /api/users/profile` (also works now)

---

**Happy Testing!** 