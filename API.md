# API Documentation

Base URL: `http://localhost:5000/api` (development)

## Authentication

Admin endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Public Endpoints

### Get All Services
```http
GET /services
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Basic Facial",
    "description": "Deep cleansing facial with steam and extraction",
    "duration": 60,
    "price": 1500,
    "isActive": true
  }
]
```

### Get Time Slots
```http
GET /timeslots?branch=Main%20Branch
```

**Query Parameters:**
- `branch` (optional): Filter by branch name

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "branch": "Main Branch",
    "dayOfWeek": 1,
    "startTime": "09:00",
    "endTime": "10:00",
    "isActive": true
  }
]
```

### Book Appointment
```http
POST /appointments
```

**Request Body:**
```json
{
  "clientName": "John Doe",
  "clientPhone": "+91 9876543210",
  "clientEmail": "john@example.com",
  "service": "507f1f77bcf86cd799439011",
  "branch": "Main Branch",
  "appointmentDate": "2026-02-15",
  "startTime": "10:00"
}
```

**Response:**
```json
{
  "message": "Appointment booked successfully",
  "appointment": {
    "_id": "507f1f77bcf86cd799439011",
    "clientName": "John Doe",
    "clientPhone": "+91 9876543210",
    "clientEmail": "john@example.com",
    "service": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Basic Facial",
      "price": 1500
    },
    "appointmentDate": "2026-02-15T00:00:00.000Z",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "pending"
  }
}
```

**Error Responses:**
- `409 Conflict`: Time slot already booked
- `404 Not Found`: Service not found
- `400 Bad Request`: Validation errors

## Authentication Endpoints

### Admin Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "admin@clinic.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "admin@clinic.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

## Admin Endpoints (Protected)

### Get All Appointments
```http
GET /admin/appointments?date=2026-02-15&status=pending&branch=Main%20Branch
```

**Query Parameters:**
- `date` (optional): Filter by date (YYYY-MM-DD)
- `status` (optional): Filter by status (pending, confirmed, completed, cancelled)
- `branch` (optional): Filter by branch name

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "clientName": "John Doe",
    "clientPhone": "+91 9876543210",
    "clientEmail": "john@example.com",
    "service": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Basic Facial",
      "duration": 60,
      "price": 1500
    },
    "branch": "Main Branch",
    "appointmentDate": "2026-02-15T00:00:00.000Z",
    "startTime": "10:00",
    "endTime": "11:00",
    "status": "pending",
    "notes": "",
    "createdAt": "2026-02-03T10:00:00.000Z"
  }
]
```

### Update Appointment Status
```http
PATCH /admin/appointments/:id
```

**Request Body:**
```json
{
  "status": "confirmed",
  "notes": "Confirmed via phone"
}
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "status": "confirmed",
  "notes": "Confirmed via phone"
}
```

### Get Client History
```http
GET /admin/clients/:email
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "clientName": "John Doe",
    "service": {
      "name": "Basic Facial"
    },
    "appointmentDate": "2026-02-15T00:00:00.000Z",
    "status": "completed"
  }
]
```

### Get All Services (Admin)
```http
GET /admin/services
```

**Response:** Same as public endpoint but includes inactive services

### Add Service
```http
POST /admin/services
```

**Request Body:**
```json
{
  "name": "New Treatment",
  "description": "Description of the treatment",
  "duration": 90,
  "price": 3000
}
```

### Update Service
```http
PUT /admin/services/:id
```

**Request Body:**
```json
{
  "name": "Updated Treatment",
  "description": "Updated description",
  "duration": 90,
  "price": 3500,
  "isActive": true
}
```

### Delete Service
```http
DELETE /admin/services/:id
```

**Response:**
```json
{
  "message": "Service deleted successfully"
}
```

### Get All Time Slots (Admin)
```http
GET /admin/timeslots
```

### Add Time Slot
```http
POST /admin/timeslots
```

**Request Body:**
```json
{
  "branch": "Main Branch",
  "dayOfWeek": 1,
  "startTime": "09:00",
  "endTime": "10:00"
}
```

**Note:** `dayOfWeek` is 0-6 (0 = Sunday, 1 = Monday, etc.)

### Delete Time Slot
```http
DELETE /admin/timeslots/:id
```

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": [
    {
      "field": "clientEmail",
      "message": "Valid email is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Access token required"
}
```

### 403 Forbidden
```json
{
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error",
  "error": "Error details"
}
```

## Rate Limiting

To prevent abuse, consider implementing rate limiting in production:
- Public endpoints: 100 requests per 15 minutes per IP
- Admin endpoints: 1000 requests per 15 minutes per token

## Webhooks (Future Enhancement)

For notification systems, you can add webhook endpoints:
- `/webhooks/appointment-created`
- `/webhooks/appointment-updated`
- `/webhooks/appointment-reminder`
