# Lumea API

A comprehensive skincare and cosmetology appointment management API with skin analysis capabilities.

## Features

- **User Authentication**: Register and login for users and cosmetologists
- **Appointment Management**: Book, view, and manage appointments
- **Skin Analysis**: Upload images for automated skin analysis
- **User Profiles**: Manage user and cosmetologist profiles
- **Role-based Access**: Different permissions for users and cosmetologists

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/lumea_api

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# OpenAI Configuration (for skin analysis)
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication (`/api/auth`)

#### POST `/api/auth/register`
Register a new user or cosmetologist.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // or "cosmetologist"
}
```

#### POST `/api/auth/login`
Login and receive authentication token.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Users (`/api/users`)

#### GET `/api/users?role=cosmetologist`
Get all cosmetologists (for users to browse).

#### GET `/api/users/:id`
Get specific user profile.

#### GET `/api/users/me/profile`
Get current user's profile.

#### PATCH `/api/users/me/profile`
Update current user's profile.

**Body:**
```json
{
  "bio": "Expert in skincare",
  "specialization": "Anti-aging",
  "availability": "Mon-Fri 9AM-5PM",
  "image": "profile_image_url"
}
```

### Appointments (`/api/appointments`)

#### POST `/api/appointments`
Book a new appointment.

**Body:**
```json
{
  "cosmetologist": "cosmetologist_id",
  "date": "2024-01-15",
  "time": "14:00",
  "skinType": "Combination",
  "tone": "Fair",
  "weight": 70,
  "description": "Skin consultation",
  "gender": "Female",
  "age": 25
}
```

#### GET `/api/appointments`
Get all appointments for current user.

#### GET `/api/appointments?status=pending`
Get appointments filtered by status.

#### PATCH `/api/appointments/:id`
Update appointment status.

**Body:**
```json
{
  "status": "accepted", // or "rejected", "completed"
  "notes": "Appointment confirmed"
}
```

### Skin Reports (`/api/skin-reports`)

#### POST `/api/skin-reports`
Upload and analyze skin image.

**Form Data:**
- `image`: Image file (jpg, png, jpeg)

#### GET `/api/skin-reports`
Get all skin reports for current user.

#### GET `/api/skin-reports/:id`
Get specific skin report.

#### GET `/api/skin-reports/:id/download`
Download skin report as PDF.

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Testing with Postman

1. **Register a user**: POST `/api/auth/register`
2. **Login**: POST `/api/auth/login` (save the token)
3. **Use the token**: Add `Authorization: Bearer <token>` header to subsequent requests
4. **Test endpoints**: Follow the endpoint documentation above

## Common Issues and Solutions

### 1. MongoDB Connection Issues
- Ensure MongoDB is running
- Check your `MONGO_URI` in the `.env` file
- Make sure the database name is correct

### 2. JWT Token Issues
- Ensure `JWT_SECRET` is set in your `.env` file
- Make sure the token is included in the Authorization header
- Check token expiration

### 3. Image Upload Issues
- Ensure Cloudinary credentials are correct
- Check file format (jpg, png, jpeg only)
- Verify file size limits

### 4. Skin Analysis Issues
- Ensure OpenAI API key is valid
- Check API quota and billing
- Verify the image URL is accessible

## Development

### Project Structure
```
lumea_api/
├── config/          # Database configuration
├── controllers/     # Route handlers
├── middlewares/     # Authentication and upload middleware
├── models/          # MongoDB schemas
├── routes/          # API routes
├── services/        # External services
└── utils/           # Utility functions
```

### Adding New Features
1. Create/update models in `models/`
2. Add controllers in `controllers/`
3. Define routes in `routes/`
4. Update main `index.js` if needed
5. Test thoroughly with Postman 