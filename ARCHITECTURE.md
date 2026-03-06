# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │    Mobile    │  │    Tablet    │      │
│  │   Desktop    │  │    Phone     │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    Public Pages                       │   │
│  │  • Home (Landing)                                     │   │
│  │  • Book Appointment                                   │   │
│  │  • Success Confirmation                               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    Admin Pages                        │   │
│  │  • Login                                              │   │
│  │  • Dashboard (Protected)                              │   │
│  │    - Appointments Management                          │   │
│  │    - Services Management                              │   │
│  │    - Time Slots Management                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Context & State Management               │   │
│  │  • AuthContext (JWT token, user state)                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└───────────────────────────┬─────────────────────────────────┘
                            │ REST API (JSON)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND (Node.js + Express)                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   Middleware Layer                    │   │
│  │  • CORS                                               │   │
│  │  • Body Parser                                        │   │
│  │  • JWT Authentication                                 │   │
│  │  • Input Validation                                   │   │
│  │  • Error Handling                                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    API Routes                         │   │
│  │                                                        │   │
│  │  Public Routes:                                       │   │
│  │  • GET  /api/services                                 │   │
│  │  • GET  /api/timeslots                                │   │
│  │  • POST /api/appointments                             │   │
│  │                                                        │   │
│  │  Auth Routes:                                         │   │
│  │  • POST /api/auth/login                               │   │
│  │                                                        │   │
│  │  Admin Routes (Protected):                            │   │
│  │  • GET    /api/admin/appointments                     │   │
│  │  • PATCH  /api/admin/appointments/:id                 │   │
│  │  • GET    /api/admin/clients/:email                   │   │
│  │  • CRUD   /api/admin/services                         │   │
│  │  • CRUD   /api/admin/timeslots                        │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  Business Logic                       │   │
│  │  • Double-booking prevention                          │   │
│  │  • Time slot validation                               │   │
│  │  • Status management                                  │   │
│  │  • JWT token generation/verification                  │   │
│  │  • Password hashing                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└───────────────────────────┬─────────────────────────────────┘
                            │ Mongoose ODM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    users     │  │   services   │  │  timeslots   │      │
│  │              │  │              │  │              │      │
│  │ • email      │  │ • name       │  │ • dayOfWeek  │      │
│  │ • password   │  │ • description│  │ • startTime  │      │
│  │ • name       │  │ • duration   │  │ • endTime    │      │
│  │ • role       │  │ • price      │  │ • branch     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  appointments                         │   │
│  │                                                        │   │
│  │  • clientName, clientPhone, clientEmail              │   │
│  │  • service (ref to services)                          │   │
│  │  • appointmentDate, startTime, endTime               │   │
│  │  • status (pending/confirmed/completed/cancelled)    │   │
│  │  • branch, notes                                      │   │
│  │                                                        │   │
│  │  Indexes:                                             │   │
│  │  • appointmentDate + startTime + branch              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. User Booking Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. Visit website
     ▼
┌─────────────────┐
│   Home Page     │
│  (Landing)      │
└────┬────────────┘
     │
     │ 2. Click "Book Appointment"
     ▼
┌─────────────────┐
│ Booking Form    │
└────┬────────────┘
     │
     │ 3. Load services
     ▼
┌─────────────────┐      GET /api/services      ┌──────────┐
│   Frontend      │ ─────────────────────────▶  │ Backend  │
└─────────────────┘                              └────┬─────┘
                                                      │
                                                      │ Query
                                                      ▼
                                                 ┌──────────┐
                                                 │ MongoDB  │
                                                 └────┬─────┘
                                                      │
     ┌────────────────────────────────────────────────┘
     │ Return services
     ▼
┌─────────────────┐
│ Display Services│
└────┬────────────┘
     │
     │ 4. User selects service & date
     ▼
┌─────────────────┐      GET /api/timeslots     ┌──────────┐
│   Frontend      │ ─────────────────────────▶  │ Backend  │
└─────────────────┘                              └────┬─────┘
                                                      │
                                                      │ Query by day
                                                      ▼
                                                 ┌──────────┐
                                                 │ MongoDB  │
                                                 └────┬─────┘
                                                      │
     ┌────────────────────────────────────────────────┘
     │ Return available slots
     ▼
┌─────────────────┐
│ Display Slots   │
└────┬────────────┘
     │
     │ 5. User fills form & submits
     ▼
┌─────────────────┐   POST /api/appointments    ┌──────────┐
│   Frontend      │ ─────────────────────────▶  │ Backend  │
└─────────────────┘   (appointment data)         └────┬─────┘
                                                      │
                                                      │ 1. Validate
                                                      │ 2. Check double booking
                                                      │ 3. Save
                                                      ▼
                                                 ┌──────────┐
                                                 │ MongoDB  │
                                                 └────┬─────┘
                                                      │
     ┌────────────────────────────────────────────────┘
     │ Return success
     ▼
┌─────────────────┐
│ Success Page    │
└─────────────────┘
```

### 2. Admin Authentication Flow

```
┌─────────┐
│  Admin  │
└────┬────┘
     │
     │ 1. Visit /admin/login
     ▼
┌─────────────────┐
│  Login Page     │
└────┬────────────┘
     │
     │ 2. Enter credentials
     ▼
┌─────────────────┐   POST /api/auth/login      ┌──────────┐
│   Frontend      │ ─────────────────────────▶  │ Backend  │
└─────────────────┘   (email, password)          └────┬─────┘
                                                      │
                                                      │ 1. Find user
                                                      ▼
                                                 ┌──────────┐
                                                 │ MongoDB  │
                                                 └────┬─────┘
                                                      │
                                                      │ Return user
                                                      ▼
                                                 ┌──────────┐
                                                 │ Backend  │
                                                 └────┬─────┘
                                                      │
                                                      │ 2. Compare password
                                                      │ 3. Generate JWT
                                                      │
     ┌────────────────────────────────────────────────┘
     │ Return token + user
     ▼
┌─────────────────┐
│   Frontend      │
│ Store in:       │
│ • localStorage  │
│ • AuthContext   │
└────┬────────────┘
     │
     │ 3. Redirect to dashboard
     ▼
┌─────────────────┐
│   Dashboard     │
└─────────────────┘
```

### 3. Admin Appointment Management Flow

```
┌─────────┐
│  Admin  │
└────┬────┘
     │
     │ 1. View dashboard
     ▼
┌─────────────────┐   GET /api/admin/appointments   ┌──────────┐
│   Dashboard     │ ──────────────────────────────▶  │ Backend  │
└─────────────────┘   (with JWT token)                └────┬─────┘
                                                           │
                                                           │ 1. Verify JWT
                                                           │ 2. Check admin role
                                                           │ 3. Query appointments
                                                           ▼
                                                      ┌──────────┐
                                                      │ MongoDB  │
                                                      └────┬─────┘
                                                           │
     ┌─────────────────────────────────────────────────────┘
     │ Return appointments with populated service
     ▼
┌─────────────────┐
│ Display List    │
└────┬────────────┘
     │
     │ 2. Admin updates status
     ▼
┌─────────────────┐  PATCH /api/admin/appointments/:id  ┌──────────┐
│   Dashboard     │ ──────────────────────────────────▶  │ Backend  │
└─────────────────┘  (new status)                         └────┬─────┘
                                                               │
                                                               │ 1. Verify JWT
                                                               │ 2. Update status
                                                               ▼
                                                          ┌──────────┐
                                                          │ MongoDB  │
                                                          └────┬─────┘
                                                               │
     ┌─────────────────────────────────────────────────────────┘
     │ Return updated appointment
     ▼
┌─────────────────┐
│ Refresh List    │
└─────────────────┘
```

## Component Architecture

### Frontend Component Hierarchy

```
App
├── Router
    ├── Home
    │   ├── Navbar
    │   ├── Hero Section
    │   ├── Services Section
    │   ├── About Section
    │   ├── Contact Section
    │   └── Footer
    │
    ├── BookAppointment
    │   ├── Service Selector
    │   ├── Date Picker
    │   ├── Time Slot Selector
    │   ├── Client Info Form
    │   └── Submit Button
    │
    ├── Success
    │   ├── Success Icon
    │   ├── Message
    │   └── Action Buttons
    │
    ├── AdminLogin
    │   └── Login Form
    │
    └── AdminDashboard (Protected)
        ├── Header
        │   ├── Title
        │   ├── User Info
        │   └── Logout Button
        │
        ├── Tabs
        │   ├── Appointments Tab
        │   │   ├── Filters
        │   │   └── Appointment List
        │   │       └── Appointment Card
        │   │           ├── Client Info
        │   │           ├── Service Info
        │   │           ├── Status Badge
        │   │           └── Action Buttons
        │   │
        │   ├── Services Tab
        │   │   ├── Add Service Form
        │   │   └── Service List
        │   │       └── Service Card
        │   │
        │   └── Time Slots Tab
        │       ├── Add Slot Form
        │       └── Slots by Day
        │           └── Slot Item
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Security Layers                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Layer 1: Transport Security                                 │
│  ┌────────────────────────────────────────────────────┐     │
│  │  • HTTPS (TLS/SSL)                                  │     │
│  │  • Secure headers                                   │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  Layer 2: Authentication                                     │
│  ┌────────────────────────────────────────────────────┐     │
│  │  • JWT tokens (7-day expiry)                        │     │
│  │  • bcrypt password hashing (10 rounds)             │     │
│  │  • Token stored in localStorage                     │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  Layer 3: Authorization                                      │
│  ┌────────────────────────────────────────────────────┐     │
│  │  • Role-based access (admin only)                   │     │
│  │  • Protected routes                                 │     │
│  │  • Middleware verification                          │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  Layer 4: Input Validation                                   │
│  ┌────────────────────────────────────────────────────┐     │
│  │  • express-validator                                │     │
│  │  • Type checking                                    │     │
│  │  • Format validation                                │     │
│  │  • Sanitization                                     │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  Layer 5: Application Security                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │  • CORS configuration                               │     │
│  │  • Environment variables                            │     │
│  │  • No sensitive data in code                        │     │
│  │  • Error message sanitization                       │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  Layer 6: Database Security                                  │
│  ┌────────────────────────────────────────────────────┐     │
│  │  • MongoDB authentication                           │     │
│  │  • Connection string in env                         │     │
│  │  • Mongoose schema validation                       │     │
│  │  • Indexes for performance                          │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

### Development Environment

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │     │   Backend    │     │   MongoDB    │
│              │     │              │     │              │
│ localhost:   │────▶│ localhost:   │────▶│ localhost:   │
│   3000       │     │   5000       │     │   27017      │
│              │     │              │     │              │
│ Vite Dev     │     │ Nodemon      │     │ Local DB     │
└──────────────┘     └──────────────┘     └──────────────┘
```

### Production Environment

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
                    ┌─────────┐
                    │   CDN   │
                    │ (Static)│
                    └────┬────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
┌──────────────────┐          ┌──────────────────┐
│    Frontend      │          │     Backend      │
│                  │          │                  │
│  Vercel/Netlify  │◀────────▶│  Railway/Render  │
│                  │   API    │                  │
│  • React Build   │  Calls   │  • Express API   │
│  • Static Files  │          │  • JWT Auth      │
│  • Auto SSL      │          │  • Validation    │
└──────────────────┘          └────────┬─────────┘
                                       │
                                       │ Mongoose
                                       ▼
                              ┌──────────────────┐
                              │  MongoDB Atlas   │
                              │                  │
                              │  • Cloud DB      │
                              │  • Auto Backup   │
                              │  • Scaling       │
                              └──────────────────┘
```

## Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                   Performance Strategy                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Frontend Optimizations:                                     │
│  ┌────────────────────────────────────────────────────┐     │
│  │  • Vite for fast builds                             │     │
│  │  • Code splitting (React.lazy)                      │     │
│  │  • Tailwind CSS purging                             │     │
│  │  • Minimal dependencies                             │     │
│  │  • Image optimization                               │     │
│  │  • Lazy loading components                          │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  Backend Optimizations:                                      │
│  ┌────────────────────────────────────────────────────┐     │
│  │  • Efficient queries                                │     │
│  │  • Database indexing                                │     │
│  │  • Lean queries (select only needed fields)        │     │
│  │  • Connection pooling                               │     │
│  │  • Compression middleware                           │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  Database Optimizations:                                     │
│  ┌────────────────────────────────────────────────────┐     │
│  │  • Compound indexes                                 │     │
│  │  • Query optimization                               │     │
│  │  • Proper schema design                             │     │
│  │  • Avoid N+1 queries (populate)                     │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  Future Optimizations:                                       │
│  ┌────────────────────────────────────────────────────┐     │
│  │  • Redis caching layer                              │     │
│  │  • CDN for static assets                            │     │
│  │  • Database read replicas                           │     │
│  │  • Load balancing                                   │     │
│  │  • Service workers (PWA)                            │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Scalability Path

```
Phase 1: Single Clinic (Current)
┌──────────────────────────────────┐
│  Frontend → Backend → MongoDB    │
│  Simple, monolithic architecture │
└──────────────────────────────────┘

Phase 2: Multi-Clinic
┌──────────────────────────────────────────┐
│  Frontend → Backend → MongoDB            │
│           ↓                               │
│      Clinic Context                       │
│      (tenant isolation)                   │
└──────────────────────────────────────────┘

Phase 3: Microservices
┌────────────────────────────────────────────────┐
│  Frontend → API Gateway                        │
│              ├─→ Auth Service                  │
│              ├─→ Booking Service               │
│              ├─→ Notification Service          │
│              └─→ Analytics Service             │
│                                                 │
│  Each service has its own database             │
└────────────────────────────────────────────────┘

Phase 4: SaaS Platform
┌────────────────────────────────────────────────┐
│  Multi-tenant architecture                     │
│  Load balancers                                │
│  Auto-scaling                                  │
│  Multiple regions                              │
│  Advanced caching                              │
│  Message queues                                │
└────────────────────────────────────────────────┘
```

This architecture provides a solid foundation that can scale from a single clinic to a multi-tenant SaaS platform.
