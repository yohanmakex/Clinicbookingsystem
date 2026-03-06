# Project Structure

```
skincare-clinic-booking/
│
├── backend/                          # Node.js + Express API
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   │
│   ├── models/                      # Mongoose schemas
│   │   ├── User.js                  # Admin user model
│   │   ├── Service.js               # Service model
│   │   ├── TimeSlot.js              # Time slot model
│   │   └── Appointment.js           # Appointment model
│   │
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication
│   │   └── validation.js            # Input validation
│   │
│   ├── routes/                      # API routes
│   │   ├── auth.js                  # Login endpoint
│   │   ├── services.js              # Public services
│   │   ├── timeslots.js             # Public time slots
│   │   ├── appointments.js          # Public booking
│   │   └── admin.js                 # Admin endpoints
│   │
│   ├── scripts/
│   │   └── seed.js                  # Database seeding
│   │
│   ├── .env.example                 # Environment template
│   ├── .gitignore
│   ├── package.json
│   └── server.js                    # Entry point
│
├── frontend/                         # React + Vite
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context/                 # React context
│   │   │   └── AuthContext.jsx      # Auth state management
│   │   │
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── BookAppointment.jsx  # Booking form
│   │   │   ├── Success.jsx          # Success page
│   │   │   ├── AdminLogin.jsx       # Admin login
│   │   │   └── AdminDashboard.jsx   # Admin panel
│   │   │
│   │   ├── utils/
│   │   │   └── api.js               # API client
│   │   │
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore                        # Root gitignore
├── setup.sh                          # Setup script
├── README.md                         # Main documentation
├── QUICKSTART.md                     # Quick start guide
├── API.md                            # API documentation
├── DEPLOYMENT.md                     # Deployment guide
├── FEATURES.md                       # Features & roadmap
└── STRUCTURE.md                      # This file
```

## Key Files Explained

### Backend

#### `server.js`
Main entry point. Sets up Express, middleware, routes, and starts the server.

#### `config/db.js`
MongoDB connection configuration using Mongoose.

#### `models/`
Mongoose schemas defining data structure:
- **User**: Admin authentication
- **Service**: Clinic services (facials, treatments)
- **TimeSlot**: Available booking times
- **Appointment**: Customer bookings

#### `middleware/auth.js`
JWT token verification for protected routes.

#### `middleware/validation.js`
Express-validator rules for input validation.

#### `routes/`
API endpoint definitions:
- **auth.js**: Admin login
- **services.js**: Get services (public)
- **timeslots.js**: Get time slots (public)
- **appointments.js**: Book appointment (public)
- **admin.js**: All admin operations (protected)

#### `scripts/seed.js`
Populates database with initial data:
- Default admin user
- Sample services
- Time slots for Mon-Sat

### Frontend

#### `src/main.jsx`
React entry point, renders App component.

#### `src/App.jsx`
Main app component with routing setup.

#### `src/context/AuthContext.jsx`
Global authentication state management using React Context.

#### `src/utils/api.js`
Axios-based API client with interceptors for authentication.

#### `src/components/`
Reusable components:
- **Navbar**: Site navigation
- **ProtectedRoute**: Route guard for admin pages

#### `src/pages/`
Page components:
- **Home**: Landing page with services
- **BookAppointment**: Booking form
- **Success**: Confirmation page
- **AdminLogin**: Admin authentication
- **AdminDashboard**: Admin panel with tabs

#### `tailwind.config.js`
Tailwind CSS configuration with custom colors.

#### `vite.config.js`
Vite build configuration.

## Data Flow

### Booking Flow
```
User → Home Page → Book Appointment
  ↓
Select Service → Select Date → Select Time
  ↓
Enter Details → Submit
  ↓
API validates → Check double booking → Save to DB
  ↓
Success Page
```

### Admin Flow
```
Admin → Login Page → Enter Credentials
  ↓
API validates → Generate JWT → Store token
  ↓
Dashboard → View Appointments
  ↓
Update Status → API call → Update DB
```

## Database Schema

### Collections

#### users
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  role: "admin",
  createdAt: Date,
  updatedAt: Date
}
```

#### services
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  duration: Number (minutes),
  price: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### timeslots
```javascript
{
  _id: ObjectId,
  branch: String,
  dayOfWeek: Number (0-6),
  startTime: String (HH:MM),
  endTime: String (HH:MM),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### appointments
```javascript
{
  _id: ObjectId,
  clientName: String,
  clientPhone: String,
  clientEmail: String,
  service: ObjectId (ref: Service),
  branch: String,
  appointmentDate: Date,
  startTime: String (HH:MM),
  endTime: String (HH:MM),
  status: String (pending/confirmed/completed/cancelled),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## API Routes

### Public Routes
- `GET /api/services` - List services
- `GET /api/timeslots` - List time slots
- `POST /api/appointments` - Book appointment

### Auth Routes
- `POST /api/auth/login` - Admin login

### Admin Routes (Protected)
- `GET /api/admin/appointments` - List appointments
- `PATCH /api/admin/appointments/:id` - Update appointment
- `GET /api/admin/clients/:email` - Client history
- `GET /api/admin/services` - List all services
- `POST /api/admin/services` - Add service
- `PUT /api/admin/services/:id` - Update service
- `DELETE /api/admin/services/:id` - Delete service
- `GET /api/admin/timeslots` - List all time slots
- `POST /api/admin/timeslots` - Add time slot
- `DELETE /api/admin/timeslots/:id` - Delete time slot

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/skincare-clinic
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Dependencies

### Backend
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **cors**: CORS middleware
- **dotenv**: Environment variables
- **express-validator**: Input validation

### Frontend
- **react**: UI library
- **react-dom**: React DOM renderer
- **react-router-dom**: Routing
- **axios**: HTTP client
- **tailwindcss**: CSS framework
- **vite**: Build tool

## Performance Optimizations

1. **MongoDB Indexes**: On appointment date/time for fast queries
2. **Lazy Loading**: Components loaded on demand
3. **Minimal Dependencies**: Only essential packages
4. **Tailwind Purging**: Removes unused CSS
5. **Vite**: Fast build and hot reload
6. **API Response Caching**: Can be added for static data

## Security Features

1. **JWT Authentication**: Secure token-based auth
2. **Password Hashing**: bcrypt with salt rounds
3. **Input Validation**: Express-validator on all inputs
4. **CORS**: Configured for specific origins
5. **Environment Variables**: Sensitive data not in code
6. **Double Booking Prevention**: Database-level checks

## Scalability Considerations

The architecture supports:
- **Horizontal Scaling**: Stateless API design
- **Database Sharding**: MongoDB supports sharding
- **Caching Layer**: Redis can be added
- **Load Balancing**: Multiple backend instances
- **CDN**: Static assets can be served from CDN
- **Microservices**: Can be split into services later
