# Deployment Guide

## Production Deployment Checklist

### 1. Environment Setup

#### Backend Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skincare-clinic
JWT_SECRET=your-strong-random-secret-key-min-32-chars
NODE_ENV=production
```

#### Frontend Environment Variables
```env
VITE_API_URL=https://your-api-domain.com/api
```

### 2. Database Setup (MongoDB Atlas)

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Whitelist your application's IP addresses (or 0.0.0.0/0 for all IPs)
5. Get your connection string and update MONGODB_URI
6. Run the seed script to populate initial data

### 3. Backend Deployment Options

#### Option A: Railway
1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Add environment variables in Railway dashboard
5. Deploy: `railway up`

#### Option B: Render
1. Create account at https://render.com
2. Create new Web Service
3. Connect your GitHub repository
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && npm start`
6. Add environment variables
7. Deploy

#### Option C: AWS EC2
1. Launch Ubuntu EC2 instance
2. Install Node.js and PM2
3. Clone repository
4. Install dependencies
5. Set up environment variables
6. Start with PM2: `pm2 start backend/server.js`
7. Configure nginx as reverse proxy
8. Set up SSL with Let's Encrypt

### 4. Frontend Deployment Options

#### Option A: Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend folder: `cd frontend`
3. Run: `vercel`
4. Add environment variable VITE_API_URL in Vercel dashboard
5. Deploy: `vercel --prod`

#### Option B: Netlify
1. Build frontend: `cd frontend && npm run build`
2. Install Netlify CLI: `npm i -g netlify-cli`
3. Deploy: `netlify deploy --prod --dir=dist`
4. Add environment variables in Netlify dashboard

#### Option C: Serve from Backend
1. Build frontend: `cd frontend && npm run build`
2. Copy dist folder to backend/public
3. Add static serving in backend:
```javascript
import path from 'path';
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

### 5. SSL Certificate

For production, always use HTTPS:
- Vercel/Netlify: Automatic SSL
- Custom domain: Use Let's Encrypt (free)
- AWS: Use AWS Certificate Manager

### 6. Performance Optimization

#### Backend
- Enable compression: `npm install compression`
- Add rate limiting: `npm install express-rate-limit`
- Enable CORS only for your frontend domain
- Use MongoDB indexes (already configured)
- Enable caching for static data

#### Frontend
- Already optimized with Vite
- Lazy loading implemented
- Minimal dependencies
- Tailwind CSS purging enabled

### 7. Monitoring & Logging

- Use PM2 for process management
- Set up error tracking (Sentry)
- Monitor MongoDB performance
- Set up uptime monitoring (UptimeRobot)

### 8. Backup Strategy

- Enable MongoDB Atlas automated backups
- Regular database exports
- Version control for code

### 9. Security Checklist

✅ Environment variables secured
✅ JWT secret is strong and random
✅ CORS configured for specific domains
✅ Input validation on all endpoints
✅ Rate limiting enabled
✅ HTTPS enforced
✅ MongoDB connection secured
✅ No sensitive data in logs
✅ Dependencies updated regularly

### 10. Post-Deployment

1. Test all features in production
2. Verify email/SMS notifications (if implemented)
3. Test booking flow end-to-end
4. Verify admin dashboard functionality
5. Check mobile responsiveness
6. Test on different browsers
7. Monitor error logs for first 24 hours

## Scaling Considerations

### When to Scale
- More than 1000 appointments/month
- Response time > 2 seconds
- Multiple clinic locations

### Scaling Options
1. Upgrade MongoDB cluster
2. Add Redis for caching
3. Use CDN for static assets
4. Implement load balancing
5. Add read replicas for database
6. Implement queue system for notifications

## Cost Estimates (Monthly)

### Minimal Setup (< 500 appointments/month)
- MongoDB Atlas: Free tier
- Railway/Render: $5-10
- Vercel: Free tier
- Total: $5-10/month

### Medium Setup (500-5000 appointments/month)
- MongoDB Atlas: $9-25
- Railway/Render: $20-50
- Vercel: Free tier
- Total: $29-75/month

### Large Setup (5000+ appointments/month)
- MongoDB Atlas: $57+
- AWS EC2: $50-100
- CloudFront CDN: $10-20
- Total: $117-177/month
