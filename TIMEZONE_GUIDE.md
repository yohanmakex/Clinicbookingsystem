# Timezone Configuration Guide

## How Time Works in the System

### Current Implementation ✅
The system now uses **timezone-aware time** instead of just server system time.

### Time Sources:
1. **Server System Time** - Base time from server
2. **Timezone Conversion** - Converts to clinic's local timezone
3. **Environment Variable** - `CLINIC_TIMEZONE` controls the timezone

## Configuration

### Backend Environment Variable
```env
CLINIC_TIMEZONE=Asia/Kolkata
```

### Supported Timezones (Examples)

#### India
```env
CLINIC_TIMEZONE=Asia/Kolkata    # Mumbai, Delhi, Bangalore
CLINIC_TIMEZONE=Asia/Calcutta   # Same as Kolkata (alias)
```

#### Other Countries
```env
CLINIC_TIMEZONE=America/New_York        # US Eastern
CLINIC_TIMEZONE=America/Los_Angeles     # US Pacific
CLINIC_TIMEZONE=Europe/London           # UK
CLINIC_TIMEZONE=Australia/Sydney        # Australia
CLINIC_TIMEZONE=Asia/Dubai              # UAE
CLINIC_TIMEZONE=Asia/Singapore          # Singapore
CLINIC_TIMEZONE=Europe/Paris            # France/Germany
```

### Full List
See: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

## How It Works

### 1. Time Checking Logic
```javascript
// Get current time in clinic's timezone
const clinicTimezone = process.env.CLINIC_TIMEZONE || 'Asia/Kolkata';
const now = new Date();
const clinicTime = new Date(now.toLocaleString("en-US", {timeZone: clinicTimezone}));
```

### 2. Slot Availability
- Server gets current UTC time
- Converts to clinic's timezone
- Compares with slot times
- Hides past slots based on clinic time

### 3. Booking Validation
- Prevents booking past appointments
- Uses clinic's local time for validation
- 30-minute buffer for current time

## Examples

### Scenario 1: Indian Clinic
```env
CLINIC_TIMEZONE=Asia/Kolkata
```
- Server in US (UTC-5) shows 2:00 AM
- Clinic time: 12:30 PM (IST)
- System uses 12:30 PM for slot availability

### Scenario 2: US Clinic
```env
CLINIC_TIMEZONE=America/New_York
```
- Server in Europe (UTC+1) shows 7:00 PM
- Clinic time: 1:00 PM (EST)
- System uses 1:00 PM for slot availability

### Scenario 3: Multi-Location (Future)
```env
# Can be extended to support multiple clinics
CLINIC_TIMEZONE_MAIN=Asia/Kolkata
CLINIC_TIMEZONE_BRANCH=Asia/Dubai
```

## Testing Timezone

### 1. Check Current Time
```bash
# Test endpoint to see what time the system thinks it is
curl http://localhost:5001/api/health
```

### 2. Test Slot Availability
```bash
# Check available slots for today
curl "http://localhost:5001/api/timeslots/available?date=$(date +%Y-%m-%d)"
```

### 3. Verify Time Logic
```javascript
// In browser console or Node.js
const clinicTimezone = 'Asia/Kolkata';
const now = new Date();
const clinicTime = new Date(now.toLocaleString("en-US", {timeZone: clinicTimezone}));

console.log('Server time:', now.toString());
console.log('Clinic time:', clinicTime.toString());
```

## Production Deployment

### Railway/Render
```env
CLINIC_TIMEZONE=Asia/Kolkata
```

### Vercel (if using serverless)
```env
TZ=Asia/Kolkata
CLINIC_TIMEZONE=Asia/Kolkata
```

### Docker
```dockerfile
ENV TZ=Asia/Kolkata
ENV CLINIC_TIMEZONE=Asia/Kolkata
```

## Troubleshooting

### Issue: Wrong time showing
**Solution:** Check `CLINIC_TIMEZONE` environment variable

### Issue: Slots not hiding properly
**Solution:** Verify timezone format (use underscore, not spaces)

### Issue: Server in different timezone
**Solution:** This is fine! The system converts automatically

### Issue: Daylight Saving Time
**Solution:** Timezone database handles DST automatically

## Advanced Configuration

### Multiple Branches (Future Enhancement)
```javascript
// In backend/routes/timeslots.js
const getBranchTimezone = (branch) => {
  const timezones = {
    'Main Branch': 'Asia/Kolkata',
    'Dubai Branch': 'Asia/Dubai',
    'London Branch': 'Europe/London'
  };
  return timezones[branch] || process.env.CLINIC_TIMEZONE || 'Asia/Kolkata';
};
```

### Custom Time API (Alternative)
```javascript
// Use external time API for guaranteed accuracy
const getAccurateTime = async (timezone) => {
  const response = await fetch(`http://worldtimeapi.org/api/timezone/${timezone}`);
  const data = await response.json();
  return new Date(data.datetime);
};
```

## Best Practices

### 1. Always Set Timezone
- Never rely on server's default timezone
- Always set `CLINIC_TIMEZONE` explicitly

### 2. Test in Production
- Verify time logic works on deployed server
- Test with different timezones if needed

### 3. Document for Team
- Include timezone in deployment docs
- Train staff on time-related features

### 4. Monitor Time Accuracy
- Check if appointments are being blocked correctly
- Verify slot availability matches expectations

## Current Status ✅

The system now:
- ✅ Uses clinic's local timezone
- ✅ Handles server timezone differences
- ✅ Automatically manages DST
- ✅ Configurable via environment variable
- ✅ Defaults to India timezone (Asia/Kolkata)

**No more timezone confusion!** 🕐✨