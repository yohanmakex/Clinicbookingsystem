# Troubleshooting Guide

Common issues and their solutions.

## Installation Issues

### npm install fails

**Error:** `npm ERR! code EACCES`

**Solution:**
```bash
# Fix npm permissions
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

**Error:** `npm ERR! network timeout`

**Solution:**
```bash
# Increase timeout
npm install --timeout=60000

# Or use different registry
npm install --registry=https://registry.npmjs.org/
```

### Node version mismatch

**Error:** `The engine "node" is incompatible`

**Solution:**
```bash
# Check your Node version
node --version

# Install Node 18+ using nvm
nvm install 18
nvm use 18
```

## MongoDB Issues

### Cannot connect to MongoDB

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**

1. **MongoDB not running**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
sudo systemctl enable mongod

# Windows
net start MongoDB
```

2. **MongoDB not installed**
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community

# Ubuntu
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
sudo apt-get install -y mongodb-org

# Windows
# Download from https://www.mongodb.com/try/download/community
```

3. **Wrong connection string**
```bash
# Check your .env file
cat backend/.env

# Should be:
MONGODB_URI=mongodb://localhost:27017/skincare-clinic
# Or for Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skincare-clinic
```

### MongoDB Atlas connection issues

**Error:** `MongooseServerSelectionError: Could not connect to any servers`

**Solutions:**

1. **IP not whitelisted**
   - Go to MongoDB Atlas dashboard
   - Network Access → Add IP Address
   - Add current IP or 0.0.0.0/0 (allow all)

2. **Wrong credentials**
   - Check username and password in connection string
   - Ensure special characters are URL-encoded
   - Example: `p@ssw0rd` becomes `p%40ssw0rd`

3. **Wrong database name**
   - Ensure database name in connection string matches

### Database seeding fails

**Error:** `ValidationError: User validation failed`

**Solution:**
```bash
# Clear existing data first
mongo skincare-clinic --eval "db.dropDatabase()"

# Then run seed again
cd backend
node scripts/seed.js
```

## Backend Issues

### Port already in use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**

1. **Kill process on port**
```bash
# macOS/Linux
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

2. **Change port**
```bash
# Edit backend/.env
PORT=5001
```

### JWT token errors

**Error:** `JsonWebTokenError: invalid token`

**Solutions:**

1. **Token expired**
   - Login again to get new token
   - Token expires after 7 days

2. **Wrong JWT secret**
   - Ensure JWT_SECRET in .env is same as when token was created
   - If changed, all users need to login again

3. **Token format wrong**
   - Ensure Authorization header format: `Bearer <token>`
   - No extra spaces or characters

### CORS errors

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**

1. **Backend not running**
   - Ensure backend server is running on port 5000

2. **Wrong API URL**
   - Check frontend/.env
   - Should be: `VITE_API_URL=http://localhost:5000/api`

3. **Production CORS**
   - Update backend/server.js:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

## Frontend Issues

### Blank white screen

**Solutions:**

1. **Check browser console**
   - Open DevTools (F12)
   - Look for error messages

2. **Clear cache**
```bash
# Stop dev server
# Clear browser cache
# Restart dev server
cd frontend
rm -rf node_modules/.vite
npm run dev
```

3. **Check API connection**
   - Ensure backend is running
   - Check VITE_API_URL in .env

### Vite build fails

**Error:** `[vite]: Rollup failed to resolve import`

**Solution:**
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
```

### Styles not loading

**Solutions:**

1. **Tailwind not configured**
```bash
# Ensure these files exist:
# - tailwind.config.js
# - postcss.config.js
# - src/index.css (with @tailwind directives)
```

2. **Rebuild**
```bash
cd frontend
npm run dev
```

### React Router not working

**Error:** `Cannot GET /admin/dashboard` on refresh

**Solution:**

For production, configure server to serve index.html for all routes:

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Express:**
```javascript
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
```

## Booking Issues

### Time slots not showing

**Possible causes:**

1. **No time slots for selected day**
   - Check if time slots exist for that day of week
   - Sunday (0) might not have slots

2. **Date not selected**
   - Time slots only show after selecting date

3. **API error**
   - Check browser console
   - Check backend logs

**Solution:**
```bash
# Add time slots via admin dashboard
# Or check database:
mongo skincare-clinic
db.timeslots.find({ dayOfWeek: 1 })  # Monday
```

### Double booking not prevented

**Possible causes:**

1. **Time zone mismatch**
   - Ensure dates are in same timezone

2. **Index not created**
```bash
# Check indexes
mongo skincare-clinic
db.appointments.getIndexes()

# Create index if missing
db.appointments.createIndex({ 
  appointmentDate: 1, 
  startTime: 1, 
  branch: 1 
})
```

### Appointment not saving

**Check validation errors:**

1. **Invalid email format**
2. **Invalid time format** (must be HH:MM)
3. **Invalid date** (must be ISO format)
4. **Service not found**

**Debug:**
```bash
# Check backend logs
# Look for validation errors
# Verify service ID exists
```

## Admin Dashboard Issues

### Cannot login

**Error:** `Invalid credentials`

**Solutions:**

1. **Wrong password**
   - Default: admin@clinic.com / admin123
   - If changed, use new password

2. **Admin user not created**
```bash
cd backend
node scripts/seed.js
```

3. **Database connection issue**
   - Check MongoDB is running
   - Check connection string

### Appointments not loading

**Solutions:**

1. **Check authentication**
   - Ensure logged in
   - Check token in localStorage
   - Token might be expired

2. **Check API**
```bash
# Test endpoint
curl http://localhost:5000/api/admin/appointments \
  -H "Authorization: Bearer YOUR_TOKEN"
```

3. **Check filters**
   - Clear all filters
   - Try without date filter

### Cannot update appointment status

**Solutions:**

1. **Invalid status**
   - Must be: pending, confirmed, completed, or cancelled

2. **Network error**
   - Check backend is running
   - Check browser console

3. **Permission error**
   - Ensure logged in as admin
   - Token might be expired

## Performance Issues

### Slow page load

**Solutions:**

1. **Large bundle size**
```bash
cd frontend
npm run build
# Check dist folder size
```

2. **Too many API calls**
   - Check Network tab in DevTools
   - Implement caching if needed

3. **Slow database queries**
   - Check MongoDB indexes
   - Optimize queries

### High memory usage

**Solutions:**

1. **Memory leak in React**
   - Check for missing cleanup in useEffect
   - Ensure event listeners are removed

2. **Too many documents**
   - Implement pagination
   - Add limits to queries

## Production Issues

### Environment variables not working

**Solutions:**

1. **Vite env vars**
   - Must start with `VITE_`
   - Rebuild after changing: `npm run build`

2. **Backend env vars**
   - Check .env file exists
   - Check dotenv is loaded in server.js

3. **Deployment platform**
   - Set env vars in platform dashboard
   - Restart service after changes

### API calls failing in production

**Solutions:**

1. **Wrong API URL**
   - Update VITE_API_URL to production URL
   - Rebuild frontend

2. **CORS issues**
   - Update CORS origin in backend
   - Allow production domain

3. **HTTPS mixed content**
   - Ensure both frontend and backend use HTTPS
   - Or both use HTTP (not recommended)

### Database connection fails in production

**Solutions:**

1. **IP not whitelisted** (MongoDB Atlas)
   - Add server IP to whitelist
   - Or allow all IPs: 0.0.0.0/0

2. **Connection string wrong**
   - Check MONGODB_URI env var
   - Ensure special characters are encoded

3. **Network restrictions**
   - Check firewall rules
   - Check security groups (AWS)

## Debugging Tips

### Enable debug logging

**Backend:**
```javascript
// Add to server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

**Frontend:**
```javascript
// Add to api.js
api.interceptors.response.use(
  response => {
    console.log('API Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error.response);
    return Promise.reject(error);
  }
);
```

### Check logs

**Backend logs:**
```bash
cd backend
npm run dev
# Watch terminal for errors
```

**Frontend logs:**
```bash
# Browser console (F12)
# Look for errors and warnings
```

**MongoDB logs:**
```bash
# macOS
tail -f /usr/local/var/log/mongodb/mongo.log

# Linux
tail -f /var/log/mongodb/mongod.log
```

### Test API directly

```bash
# Health check
curl http://localhost:5000/api/health

# Get services
curl http://localhost:5000/api/services

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@clinic.com","password":"admin123"}'
```

## Getting Help

If you're still stuck:

1. **Check error message carefully**
   - Read the full error
   - Google the error message
   - Check Stack Overflow

2. **Check documentation**
   - README.md
   - API.md
   - QUICKSTART.md

3. **Verify setup**
   - Node version: `node --version` (should be 18+)
   - MongoDB running: `mongo --version`
   - Dependencies installed: `npm list`

4. **Start fresh**
```bash
# Backend
cd backend
rm -rf node_modules
rm package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
```

5. **Check GitHub Issues**
   - Search for similar issues
   - Create new issue with details

## Common Error Messages

| Error | Likely Cause | Solution |
|-------|--------------|----------|
| ECONNREFUSED | Service not running | Start the service |
| EADDRINUSE | Port already in use | Kill process or change port |
| ValidationError | Invalid data | Check input format |
| UnauthorizedError | Missing/invalid token | Login again |
| CastError | Invalid ObjectId | Check ID format |
| CORS error | Wrong origin | Update CORS config |
| 404 Not Found | Wrong URL/route | Check API endpoint |
| 500 Server Error | Backend crash | Check backend logs |

## Prevention Tips

1. **Always check logs** when something doesn't work
2. **Use environment variables** for configuration
3. **Test locally** before deploying
4. **Keep dependencies updated** but test after updates
5. **Use version control** to track changes
6. **Document custom changes** for future reference
7. **Monitor production** with error tracking tools
8. **Backup database** regularly
