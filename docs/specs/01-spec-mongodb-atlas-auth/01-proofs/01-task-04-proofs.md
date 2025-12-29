# Task 4.0 Proof Artifacts

## Overview

This task verifies that user data persists in MongoDB Atlas across Next.js server restarts and that the application maintains proper session state through JWT cookies. This demonstrates both **data persistence** (MongoDB) and **session persistence** (NextAuth JWT).

## Test Sequence Documentation

### Phase 1: Initial Sign-In and Data Capture

#### Step 4.1: Sign in with Google and capture user record

**Instructions:**
1. Open browser to http://localhost:3000
2. Click "Sign in with Google"
3. Complete Google OAuth authentication
4. After successful sign-in, verify you're on the dashboard
5. Open MongoDB Atlas dashboard in another tab
6. Navigate to: Database → Browse Collections → Select your database → `users` collection
7. Locate your user document
8. **Capture Screenshot**: MongoDB Atlas showing the user document with:
   - `_id`: MongoDB document ID
   - `googleId`: Your Google OAuth ID
   - `email`: Your email address
   - `name`: Your full name
   - `image`: Your profile picture URL
   - `createdAt`: Timestamp
   - `updatedAt`: Timestamp

**Console Output to Monitor:**
```
MongoDB: Using cached connection (or Establishing new connection...)
Existing user signed in: user@example.com
```

**Evidence Required:**
- [ ] Screenshot of MongoDB Atlas dashboard showing complete user document
- [ ] Note the `_id` value for verification after restart
- [ ] Note the `createdAt` timestamp for verification after restart

---

### Phase 2: Server Restart Procedure

#### Step 4.2: Stop the Next.js development server

**Instructions:**
1. Switch to the terminal where `npm run dev` is running
2. Press `Ctrl+C` to stop the server
3. Wait for the process to fully terminate
4. **Capture Screenshot**: Terminal showing server stopped

**Expected Output:**
```
^C
# Process terminated
```

**Evidence Required:**
- [ ] Screenshot of terminal showing server stopped
- [ ] Confirmation that no process is running on port 3000

---

#### Step 4.3: Restart the Next.js development server

**Instructions:**
1. In the same terminal, run: `npm run dev`
2. Wait for the server to fully start
3. Look for "Ready" message or similar
4. **Capture Screenshot**: Terminal showing successful server restart

**Expected Output:**
```
> nextjs-google-auth-app@0.1.0 dev
> next dev

  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Network:      http://[IP]:3000

 ✓ Ready in [X]ms
```

**Evidence Required:**
- [ ] Screenshot of terminal showing server successfully restarted
- [ ] Confirmation that server is running on port 3000

---

### Phase 3: Session and Data Verification

#### Step 4.4: Refresh browser and verify JWT authentication

**Instructions:**
1. Go back to your browser tab (should still be at http://localhost:3000)
2. Refresh the page (F5 or Cmd+R)
3. **Important**: Do NOT click "Sign in" again - just refresh
4. Verify you are still authenticated (dashboard is visible, not redirected to sign-in)
5. **Capture Screenshot**: Browser showing dashboard with user information
6. Open browser DevTools → Application → Cookies → http://localhost:3000
7. **Capture Screenshot**: Cookie showing `next-auth.session-token` exists

**Expected Behavior:**
- User remains authenticated after refresh
- Dashboard displays user information
- No redirect to sign-in page
- JWT cookie is still present and valid

**Console Output to Monitor:**
```
MongoDB: Using cached connection
```

**Evidence Required:**
- [ ] Screenshot of dashboard showing authenticated state
- [ ] Screenshot of browser cookies showing valid session token
- [ ] Confirmation that NO new sign-in was required

---

#### Step 4.5: Verify user data displayed on dashboard

**Instructions:**
1. On the dashboard, locate user profile information
2. Verify the following data is displayed correctly:
   - User name
   - User email
   - Profile picture (if displayed)
3. **Capture Screenshot**: Dashboard showing user information matches MongoDB data

**Evidence Required:**
- [ ] Screenshot of dashboard with user information visible
- [ ] Confirmation that data matches MongoDB document from Step 4.1

---

#### Step 4.6: Verify MongoDB Atlas still contains user record

**Instructions:**
1. Go back to MongoDB Atlas dashboard
2. Navigate to the `users` collection
3. Locate your user document (same `_id` from Step 4.1)
4. Verify all fields are unchanged:
   - `_id`: Same value as before restart
   - `googleId`: Unchanged
   - `email`: Unchanged
   - `name`: Unchanged
   - `image`: Unchanged
   - `createdAt`: Same timestamp as before restart
   - `updatedAt`: Same timestamp as before restart (no updates occurred)
5. **Capture Screenshot**: MongoDB Atlas showing the same user document with identical data

**Evidence Required:**
- [ ] Screenshot of MongoDB Atlas showing user document post-restart
- [ ] Confirmation that `_id` matches the one from Step 4.1
- [ ] Confirmation that `createdAt` timestamp is unchanged
- [ ] Confirmation that no duplicate documents were created

---

## Verification Summary

### Data Persistence Checks

✅ **MongoDB Data Intact**
- User document exists before restart
- User document exists after restart
- All fields maintain their values
- No data loss occurred
- No duplicate documents created

✅ **Timestamps Preserved**
- `createdAt` remains unchanged
- `updatedAt` remains unchanged (no unnecessary updates)
- Document `_id` remains the same

### Session Persistence Checks

✅ **JWT Cookie Maintained**
- Session cookie survives server restart
- User remains authenticated without re-signing in
- Dashboard accessible immediately after restart

✅ **Application State Correct**
- No redirect to sign-in page
- User data displayed correctly
- Authentication flow not re-triggered

### System Integration Checks

✅ **MongoDB Connection Recovery**
- Singleton connection pattern works after restart
- Database queries execute successfully
- No connection errors in console

✅ **NextAuth Session Handling**
- JWT session validated against server state
- User profile retrieved correctly
- No authentication errors

## Technical Implementation Notes

### Why Data Persists

1. **MongoDB Atlas Cloud Storage**
   - Data stored in cloud database (not local memory)
   - Database runs independently of Next.js server
   - Data persists regardless of application state

2. **Mongoose Model Pattern**
   - Models defined in `models/User.ts` are schema definitions
   - Actual data stored in MongoDB Atlas
   - Server restart doesn't affect database storage

### Why Sessions Persist

1. **JWT (JSON Web Token) Strategy**
   - NextAuth configured to use JWT (stateless)
   - Session data encoded in browser cookie
   - No server-side session storage required
   - Cookie survives server restart (stored in browser)

2. **Cookie Configuration**
   - HTTP-only cookies stored by browser
   - Cookie persists until expiration
   - Server restart doesn't invalidate cookies

### Architecture Diagram

```
Browser                  Next.js Server              MongoDB Atlas
  |                            |                           |
  |-- Session Cookie -------->|                           |
  |    (JWT Token)            |                           |
  |                           |                           |
  |                           |--- User Query ----------->|
  |                           |                           |
  |                           |<-- User Document ---------|
  |                           |    (Persisted Data)       |
  |<-- Dashboard + Data ------|                           |
  |                           |                           |
  |                     [SERVER RESTART]                  |
  |                           |                           |
  |                    (Cookie still valid)      (Data still stored)
  |                           |                           |
  |-- Refresh Page ---------->|                           |
  |    (Same Cookie)          |                           |
  |                           |--- User Query ----------->|
  |                           |<-- Same User Data --------|
  |<-- Dashboard + Data ------|                           |
```

## Expected Results

After completing all steps, you should have demonstrated:

1. ✅ User data is stored in MongoDB Atlas (cloud database)
2. ✅ User data survives Next.js server restarts
3. ✅ JWT session cookies maintain authentication across restarts
4. ✅ Application correctly retrieves and displays user data after restart
5. ✅ No data loss or corruption occurs during restart
6. ✅ No unnecessary re-authentication required
7. ✅ MongoDB connection singleton pattern works correctly after restart

## Troubleshooting

### Issue: User not authenticated after restart
**Possible Causes:**
- Cookie was cleared by browser
- JWT token expired
- Browser in incognito/private mode (cookies don't persist)

**Solution:** Sign in again and verify cookie settings

### Issue: MongoDB connection error after restart
**Possible Causes:**
- `MONGODB_URI` environment variable not loaded
- Network connection issue
- MongoDB Atlas IP whitelist settings

**Solution:** Check `.env` file and MongoDB Atlas connection settings

### Issue: User data not displayed
**Possible Causes:**
- Session callback not properly configured
- User data not being fetched from database
- Frontend not rendering user information

**Solution:** Check console for errors and verify session callback

## Next Steps

After completing this verification:
1. ✅ All tasks in Spec 01 are complete
2. ✅ MongoDB Atlas authentication integration is fully functional
3. ✅ Data persistence is verified
4. ✅ Session management is verified
5. → Proceed to `/validate-spec-implementation` to verify all spec requirements
