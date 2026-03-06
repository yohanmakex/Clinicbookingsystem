# Skincare Clinic Appointment Management System

A production-ready full-stack appointment booking system for skincare clinics.

> **🚀 New here? Start with [START_HERE.md](START_HERE.md) for a complete overview!**

## Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: JWT

## Project Structure

```
├── frontend/          # React frontend
├── backend/           # Express API
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Quick Install (All Dependencies)

```bash
npm run install:all
```

### Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

Or from root:
```bash
npm run dev:backend
```

### Frontend Setup

```bash
cd frontend
npm run dev
```

Or from root:
```bash
npm run dev:frontend
```

### Seed Database

```bash
npm run seed
```

### Default Admin Credentials
- Email: admin@clinic.com
- Password: admin123

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skincare-clinic
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

### Public
- `GET /api/services` - Get all services
- `GET /api/timeslots` - Get available time slots
- `POST /api/appointments` - Book appointment

### Admin (Protected)
- `POST /api/auth/login` - Admin login
- `GET /api/admin/appointments` - Get all appointments
- `PATCH /api/admin/appointments/:id` - Update appointment status
- `POST /api/admin/services` - Add service
- `PUT /api/admin/services/:id` - Update service
- `DELETE /api/admin/services/:id` - Delete service
- `POST /api/admin/timeslots` - Add time slot
- `DELETE /api/admin/timeslots/:id` - Delete time slot

## Features

✅ Mobile-first responsive design
✅ JWT authentication
✅ Double-booking prevention
✅ Admin dashboard
✅ Service management
✅ Time slot management
✅ Appointment filtering
✅ Client history tracking
✅ Input validation
✅ Error handling
✅ Performance optimized

## Production Deployment

1. Set production environment variables
2. Build frontend: `cd frontend && npm run build`
3. Serve frontend build from backend or CDN
4. Use MongoDB Atlas for database
5. Deploy backend to Railway/Render/AWS
6. Set up SSL certificate

## Future Enhancements

- WhatsApp/Email reminders
- Multi-clinic support
- Payment integration
- SMS notifications
- Advanced analytics
