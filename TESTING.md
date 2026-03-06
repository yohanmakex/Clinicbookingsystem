# Testing Guide

## Manual Testing Checklist

### Public Website Testing

#### Homepage (/)
- [ ] Page loads without errors
- [ ] Navbar displays correctly
- [ ] Hero section is visible
- [ ] Services load from database
- [ ] All service cards display correctly
- [ ] About section is readable
- [ ] Contact information is correct
- [ ] Footer displays
- [ ] "Book Appointment" button works
- [ ] All links work
- [ ] Responsive on mobile (test at 375px width)
- [ ] Responsive on tablet (test at 768px width)

#### Booking Page (/book)
- [ ] Form displays correctly
- [ ] All input fields are present
- [ ] Service dropdown populates from database
- [ ] Date picker works
- [ ] Cannot select past dates
- [ ] Time slots appear after selecting date
- [ ] Time slots match selected day of week
- [ ] No time slots on Sunday (if not configured)
- [ ] Form validation works:
  - [ ] Name required
  - [ ] Phone required
  - [ ] Email format validated
  - [ ] Service required
  - [ ] Date required
  - [ ] Time required
- [ ] Submit button disabled when form incomplete
- [ ] Loading state shows during submission
- [ ] Success redirect after booking
- [ ] Error message shows if time slot taken
- [ ] Cancel button returns to home

#### Success Page (/success)
- [ ] Success message displays
- [ ] Checkmark icon shows
- [ ] "Back to Home" button works
- [ ] "Book Another" button works

### Admin Testing

#### Login Page (/admin/login)
- [ ] Form displays correctly
- [ ] Email and password fields work
- [ ] Submit button works
- [ ] Error message for wrong credentials
- [ ] Redirects to dashboard on success
- [ ] Token stored in localStorage
- [ ] Remember login on page refresh

#### Admin Dashboard (/admin/dashboard)
- [ ] Redirects to login if not authenticated
- [ ] Header shows admin name
- [ ] Logout button works
- [ ] Three tabs visible: Appointments, Services, Time Slots

#### Appointments Tab
- [ ] All appointments load
- [ ] Appointments sorted by date
- [ ] Service details populate correctly
- [ ] Date filter works
- [ ] Status filter works
- [ ] Clear filters button works
- [ ] Status badges show correct colors
- [ ] "Confirm" button appears for pending appointments
- [ ] "Complete" button appears for confirmed appointments
- [ ] "Cancel" button works
- [ ] Status updates reflect immediately
- [ ] Client email and phone display correctly
- [ ] Empty state shows when no appointments

#### Services Tab
- [ ] All services load (including inactive)
- [ ] "Add Service" button shows form
- [ ] Form validation works:
  - [ ] Name required
  - [ ] Description required
  - [ ] Duration must be positive number
  - [ ] Price must be non-negative
- [ ] New service saves to database
- [ ] Service appears in list immediately
- [ ] Delete button works
- [ ] Deleted service marked as inactive
- [ ] Cancel button hides form

#### Time Slots Tab
- [ ] All time slots load
- [ ] Grouped by day of week
- [ ] "Add Time Slot" button shows form
- [ ] Day dropdown works
- [ ] Time pickers work
- [ ] New slot saves to database
- [ ] Slot appears in list immediately
- [ ] Delete button (✕) works
- [ ] Slot removed from list immediately
- [ ] Cancel button hides form

### API Testing

Use Postman, Thunder Client, or curl to test:

#### Public Endpoints

**Get Services**
```bash
curl http://localhost:5000/api/services
```
Expected: 200 OK with array of services

**Get Time Slots**
```bash
curl http://localhost:5000/api/timeslots
```
Expected: 200 OK with array of time slots

**Book Appointment**
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
Expected: 201 Created with appointment details

**Double Booking Prevention**
```bash
# Book same time slot twice
# Second request should return 409 Conflict
```

#### Auth Endpoints

**Admin Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@clinic.com",
    "password": "admin123"
  }'
```
Expected: 200 OK with token and user object

**Invalid Credentials**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@clinic.com",
    "password": "wrongpassword"
  }'
```
Expected: 401 Unauthorized

#### Admin Endpoints (Protected)

**Get Appointments (No Token)**
```bash
curl http://localhost:5000/api/admin/appointments
```
Expected: 401 Unauthorized

**Get Appointments (With Token)**
```bash
curl http://localhost:5000/api/admin/appointments \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
Expected: 200 OK with appointments array

**Update Appointment Status**
```bash
curl -X PATCH http://localhost:5000/api/admin/appointments/APPOINTMENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}'
```
Expected: 200 OK with updated appointment

**Add Service**
```bash
curl -X POST http://localhost:5000/api/admin/services \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Service",
    "description": "Test description",
    "duration": 60,
    "price": 2000
  }'
```
Expected: 201 Created with service object

### Database Testing

Use MongoDB Compass or mongo shell:

**Check Collections**
```javascript
// Should have 4 collections
show collections
// users, services, timeslots, appointments
```

**Verify Admin User**
```javascript
db.users.findOne({ email: "admin@clinic.com" })
// Should return admin user with hashed password
```

**Check Services**
```javascript
db.services.find({ isActive: true }).count()
// Should return 5 (from seed script)
```

**Check Time Slots**
```javascript
db.timeslots.find().count()
// Should return 48 (6 days × 8 slots)
```

**Verify Appointment**
```javascript
db.appointments.findOne()
// Should have populated service reference
```

**Check Indexes**
```javascript
db.appointments.getIndexes()
// Should have index on appointmentDate, startTime, branch
```

### Performance Testing

#### Load Time
- [ ] Homepage loads in < 2 seconds on 4G
- [ ] Booking page loads in < 1 second
- [ ] Admin dashboard loads in < 2 seconds
- [ ] API responses < 500ms

#### Bundle Size
```bash
cd frontend
npm run build
# Check dist folder size - should be < 500KB
```

#### Lighthouse Score
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit
4. Target scores:
   - Performance: > 90
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 90

### Security Testing

#### Authentication
- [ ] Cannot access admin routes without token
- [ ] Token expires after 7 days
- [ ] Logout clears token
- [ ] Password is hashed in database
- [ ] JWT secret is not exposed

#### Input Validation
- [ ] SQL injection attempts blocked
- [ ] XSS attempts sanitized
- [ ] Invalid email formats rejected
- [ ] Negative prices rejected
- [ ] Invalid time formats rejected

#### CORS
- [ ] API accepts requests from frontend origin
- [ ] API rejects requests from unknown origins (in production)

### Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### Mobile Testing

Test on actual devices or emulators:
- [ ] iPhone SE (375px)
- [ ] iPhone 12 Pro (390px)
- [ ] iPad (768px)
- [ ] Android phone (360px)

Check:
- [ ] Touch targets are large enough (min 44px)
- [ ] Text is readable without zooming
- [ ] Forms are easy to fill
- [ ] Buttons are easy to tap
- [ ] No horizontal scrolling

### Edge Cases

#### Booking System
- [ ] Book appointment for today
- [ ] Book appointment 6 months ahead
- [ ] Select Sunday (should have no slots)
- [ ] Book last available slot
- [ ] Try to book past time today
- [ ] Book with very long name (100+ chars)
- [ ] Book with international phone format

#### Admin Dashboard
- [ ] View appointments with no filters
- [ ] Filter by future date (no results)
- [ ] Update already completed appointment
- [ ] Delete service that has appointments
- [ ] Add time slot with end time before start time
- [ ] Add duplicate time slot

#### Network Issues
- [ ] Slow 3G connection
- [ ] Offline mode (should show error)
- [ ] API timeout (should show error)
- [ ] Server down (should show error)

### Automated Testing (Future)

Consider adding:

#### Unit Tests (Jest)
```javascript
// Example: Test appointment validation
describe('Appointment Validation', () => {
  it('should reject invalid email', () => {
    const result = validateEmail('invalid-email');
    expect(result).toBe(false);
  });
});
```

#### Integration Tests (Supertest)
```javascript
// Example: Test booking endpoint
describe('POST /api/appointments', () => {
  it('should create appointment', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send(validAppointmentData);
    expect(res.status).toBe(201);
  });
});
```

#### E2E Tests (Playwright/Cypress)
```javascript
// Example: Test booking flow
test('complete booking flow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.click('text=Book Appointment');
  await page.fill('[name="clientName"]', 'Test User');
  // ... fill form
  await page.click('text=Book Appointment');
  await expect(page).toHaveURL('/success');
});
```

## Bug Report Template

When you find a bug, report it with:

```markdown
**Bug Description:**
Brief description of the issue

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Screenshots:**
If applicable

**Environment:**
- Browser: Chrome 120
- OS: macOS 14
- Device: Desktop

**Console Errors:**
Any error messages from browser console
```

## Testing Schedule

### Before Each Commit
- [ ] Run the feature you changed
- [ ] Check for console errors
- [ ] Verify no breaking changes

### Before Each Release
- [ ] Run full manual testing checklist
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Check performance
- [ ] Review security

### Weekly
- [ ] Check for dependency updates
- [ ] Review error logs
- [ ] Monitor performance metrics

### Monthly
- [ ] Full security audit
- [ ] Performance optimization review
- [ ] User feedback review
