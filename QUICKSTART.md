# Quick Start Guide

Get your skincare clinic appointment system running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- Terminal/Command prompt

## Step 1: Clone and Setup (1 minute)

```bash
# Run the setup script
./setup.sh

# Or manually:
cd backend && cp .env.example .env
cd ../frontend && cp .env.example .env
```

## Step 2: Configure Environment (1 minute)

### Option A: Local MongoDB
Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/skincare-clinic
JWT_SECRET=your-secret-key-min-32-characters-long
```

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Edit `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skincare-clinic
JWT_SECRET=your-secret-key-min-32-characters-long
```

## Step 3: Install Dependencies (2 minutes)

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

## Step 4: Seed Database (30 seconds)

```bash
cd backend
node scripts/seed.js
```

This creates:
- Admin user (admin@clinic.com / admin123)
- 5 sample services
- Time slots for Mon-Sat, 9 AM - 6 PM

## Step 5: Start Servers (30 seconds)

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Backend runs on http://localhost:5000

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:3000

## Step 6: Test the Application

### Public Site
1. Open http://localhost:3000
2. Click "Book Appointment"
3. Fill in the form and book an appointment

### Admin Dashboard
1. Go to http://localhost:3000/admin/login
2. Login with:
   - Email: admin@clinic.com
   - Password: admin123
3. View and manage appointments

## Common Issues & Solutions

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill the process or change port in .env

```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in backend/.env
PORT=5001
```

### Module Not Found
```
Error: Cannot find module 'express'
```
**Solution:** Install dependencies
```bash
cd backend
npm install
```

## Next Steps

### Customize Your Clinic
1. Update clinic name in `frontend/src/pages/Home.jsx`
2. Update contact information
3. Add your logo
4. Customize colors in `frontend/tailwind.config.js`

### Add Your Services
1. Login to admin dashboard
2. Go to "Services" tab
3. Add your actual services with pricing

### Configure Time Slots
1. Go to "Time Slots" tab
2. Add your clinic's working hours
3. Delete default slots if needed

### Production Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guide

## Testing Checklist

- [ ] Homepage loads correctly
- [ ] Services display from database
- [ ] Booking form works
- [ ] Time slots show based on selected date
- [ ] Appointment saves to database
- [ ] Success page displays
- [ ] Admin login works
- [ ] Appointments show in admin dashboard
- [ ] Can update appointment status
- [ ] Can add/edit/delete services
- [ ] Can add/delete time slots

## Development Tips

### Hot Reload
Both frontend and backend support hot reload. Changes are reflected automatically.

### Database GUI
Use MongoDB Compass to view your database:
1. Download from https://www.mongodb.com/products/compass
2. Connect to your MongoDB URI
3. Browse collections and documents

### API Testing
Use Postman or Thunder Client to test API endpoints.
Import the API documentation from [API.md](API.md)

### Debug Mode
Add console.logs or use VS Code debugger:
```json
// .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Backend",
  "program": "${workspaceFolder}/backend/server.js"
}
```

## Support

If you encounter issues:
1. Check the error message carefully
2. Verify environment variables are set correctly
3. Ensure MongoDB is running
4. Check that all dependencies are installed
5. Review the logs in terminal

## What's Next?

- [ ] Add email notifications (see FEATURES.md)
- [ ] Integrate payment gateway
- [ ] Add WhatsApp reminders
- [ ] Deploy to production
- [ ] Add more services
- [ ] Customize branding
- [ ] Set up analytics

Happy coding! 🚀
