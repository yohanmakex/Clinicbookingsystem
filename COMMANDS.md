# Quick Command Reference

## Setup Commands

### Initial Setup
```bash
# Run setup script
./setup.sh

# Or manually
cd backend && cp .env.example .env
cd ../frontend && cp .env.example .env
```

### Install All Dependencies
```bash
# From root
npm run install:all

# Or individually
cd backend && npm install
cd ../frontend && npm install
```

### Seed Database
```bash
# From root
npm run seed

# Or from backend
cd backend && node scripts/seed.js
```

## Development Commands

### Start Backend
```bash
# From root
npm run dev:backend

# Or from backend folder
cd backend && npm run dev
```

### Start Frontend
```bash
# From root
npm run dev:frontend

# Or from frontend folder
cd frontend && npm run dev
```

### Start Both (Use 2 terminals)
```bash
# Terminal 1
npm run dev:backend

# Terminal 2
npm run dev:frontend
```

## Build Commands

### Build Frontend
```bash
# From root
npm run build:frontend

# Or from frontend folder
cd frontend && npm run build
```

### Preview Production Build
```bash
cd frontend && npm run preview
```

## Database Commands

### MongoDB Local

#### Start MongoDB
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

#### Stop MongoDB
```bash
# macOS
brew services stop mongodb-community

# Linux
sudo systemctl stop mongod

# Windows
net stop MongoDB
```

#### Access MongoDB Shell
```bash
mongo
# or
mongosh
```

#### Common MongoDB Commands
```javascript
// Show databases
show dbs

// Use database
use skincare-clinic

// Show collections
show collections

// Find all users
db.users.find()

// Find all services
db.services.find()

// Find all appointments
db.appointments.find()

// Count appointments
db.appointments.countDocuments()

// Find appointments by status
db.appointments.find({ status: "pending" })

// Delete all appointments (careful!)
db.appointments.deleteMany({})

// Drop database (careful!)
db.dropDatabase()
```

## Git Commands

### Initial Commit
```bash
git init
git add .
git commit -m "Initial commit: Skincare clinic booking system"
```

### Create Repository
```bash
# On GitHub, create new repository
# Then:
git remote add origin https://github.com/yourusername/skincare-clinic.git
git branch -M main
git push -u origin main
```

### Regular Commits
```bash
git add .
git commit -m "Your commit message"
git push
```

## Testing Commands

### Test API Endpoints

#### Health Check
```bash
curl http://localhost:5000/api/health
```

#### Get Services
```bash
curl http://localhost:5000/api/services
```

#### Get Time Slots
```bash
curl http://localhost:5000/api/timeslots
```

#### Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@clinic.com","password":"admin123"}'
```

#### Book Appointment
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Test User",
    "clientPhone": "+91 9876543210",
    "clientEmail": "test@example.com",
    "service": "SERVICE_ID_HERE",
    "appointmentDate": "2026-02-15",
    "startTime": "10:00"
  }'
```

## Troubleshooting Commands

### Check Node Version
```bash
node --version
# Should be 18+
```

### Check npm Version
```bash
npm --version
```

### Check MongoDB Version
```bash
mongo --version
# or
mongosh --version
```

### Check Running Processes
```bash
# Check port 5000 (backend)
lsof -i :5000

# Check port 3000 (frontend)
lsof -i :3000

# Check MongoDB port
lsof -i :27017
```

### Kill Process on Port
```bash
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Clear npm Cache
```bash
npm cache clean --force
```

### Reinstall Dependencies
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Clear Vite Cache
```bash
cd frontend
rm -rf node_modules/.vite
npm run dev
```

## Deployment Commands

### Deploy to Vercel (Frontend)
```bash
cd frontend
npm install -g vercel
vercel login
vercel
# Follow prompts
vercel --prod
```

### Deploy to Railway (Backend)
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### Deploy to Netlify (Frontend)
```bash
cd frontend
npm run build
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

## Maintenance Commands

### Update Dependencies
```bash
# Check outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm update package-name
```

### Security Audit
```bash
npm audit
npm audit fix
```

### Check Bundle Size
```bash
cd frontend
npm run build
du -sh dist
```

## Environment Commands

### View Environment Variables
```bash
# Backend
cat backend/.env

# Frontend
cat frontend/.env
```

### Set Environment Variables (Production)
```bash
# Railway
railway variables set MONGODB_URI="your-uri"

# Vercel
vercel env add VITE_API_URL
```

## Backup Commands

### Backup MongoDB
```bash
# Export database
mongodump --db skincare-clinic --out ./backup

# Import database
mongorestore --db skincare-clinic ./backup/skincare-clinic
```

### Backup Code
```bash
# Create archive
tar -czf backup-$(date +%Y%m%d).tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  .
```

## Monitoring Commands

### View Logs

#### Backend Logs
```bash
cd backend
npm run dev
# Watch terminal output
```

#### MongoDB Logs
```bash
# macOS
tail -f /usr/local/var/log/mongodb/mongo.log

# Linux
tail -f /var/log/mongodb/mongod.log
```

#### Production Logs
```bash
# Railway
railway logs

# Vercel
vercel logs
```

## Performance Commands

### Measure Load Time
```bash
# Using curl
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000

# curl-format.txt content:
# time_total: %{time_total}s
```

### Run Lighthouse
```bash
# Install
npm install -g lighthouse

# Run audit
lighthouse http://localhost:3000 --view
```

## Quick Reference

### Default Ports
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: mongodb://localhost:27017

### Default Credentials
- Email: admin@clinic.com
- Password: admin123

### Important URLs
- Frontend: http://localhost:3000
- Admin Login: http://localhost:3000/admin/login
- API Health: http://localhost:5000/api/health
- API Docs: See API.md

### File Locations
- Backend env: `backend/.env`
- Frontend env: `frontend/.env`
- Seed script: `backend/scripts/seed.js`
- API routes: `backend/routes/`
- React pages: `frontend/src/pages/`

## Useful Aliases (Optional)

Add to your `.bashrc` or `.zshrc`:

```bash
# Project aliases
alias clinic-backend="cd ~/path/to/project/backend && npm run dev"
alias clinic-frontend="cd ~/path/to/project/frontend && npm run dev"
alias clinic-seed="cd ~/path/to/project/backend && node scripts/seed.js"
alias clinic-mongo="mongo skincare-clinic"
```

## Emergency Commands

### Reset Everything
```bash
# Stop all servers
# Kill processes on ports 3000, 5000

# Clear database
mongo skincare-clinic --eval "db.dropDatabase()"

# Reinstall dependencies
cd backend && rm -rf node_modules && npm install
cd ../frontend && rm -rf node_modules && npm install

# Reseed database
cd backend && node scripts/seed.js

# Restart servers
cd backend && npm run dev
cd ../frontend && npm run dev
```

### Quick Fix
```bash
# If something's not working:
1. Check if MongoDB is running
2. Check if .env files exist
3. Check if dependencies are installed
4. Check console for errors
5. Try restarting servers
```

## Documentation Commands

### View Documentation
```bash
# Main docs
cat README.md

# Quick start
cat QUICKSTART.md

# API docs
cat API.md

# All docs
ls *.md
```

### Search Documentation
```bash
# Search for keyword
grep -r "keyword" *.md
```

---

**Pro Tip:** Bookmark this file for quick reference during development!
