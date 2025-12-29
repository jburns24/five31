# 01 Questions Round 1 - MongoDB Atlas Authentication Integration

Please answer each question below (select one or more options, or add your own notes). Feel free to add additional context under any question.

## 1. What user data should be stored in MongoDB?

What information about authenticated users do you want to persist in the database?

- [x] (A) Basic profile information only (name, email, profile picture from Google)
- [ ] (B) Profile information + authentication metadata (last login, account creation date)
- [ ] (C) Profile information + custom user fields (role, preferences, settings)
- [ ] (D) Full session data including tokens and refresh tokens
- [ ] (E) Other (describe)

## 2. When should user records be created/updated?

When should the system interact with MongoDB during the authentication flow?

- [x] (A) Create user record on first sign-in only, no updates on subsequent logins
- [ ] (B) Create on first sign-in, update last login timestamp on each sign-in
- [ ] (C) Create on first sign-in, update full profile data on each sign-in (sync with Google)
- [ ] (D) Create and update user records, plus store session information
- [ ] (E) Other (describe)

## 3. MongoDB Atlas connection configuration

How should the MongoDB Atlas connection be configured?

- [x] (A) Use environment variable for connection string, manually configured cluster
- [ ] (B) Connection string + additional configuration (database name, collection names via env vars)
- [ ] (C) Full configuration including connection pooling, retry logic, and timeout settings
- [ ] (D) Simple connection for now, can enhance later
- [ ] (E) Other (describe)

## 4. User identification strategy

How should users be uniquely identified in MongoDB?

- [x] (A) Use Google OAuth ID as the primary identifier
- [ ] (B) Generate a custom UUID for each user, store Google ID as reference
- [ ] (C) Use email address as primary identifier
- [ ] (D) Use NextAuth generated user ID
- [ ] (E) Other (describe)

## 5. Database schema and validation

What level of schema validation and structure do you need?

- [ ] (A) Simple JavaScript objects, no formal schema validation
- [ ] (B) TypeScript interfaces for type safety in code only
- [ ] (C) MongoDB schema validation rules + TypeScript types
- [x] (D) Use an ODM/ORM like Mongoose for schema management
- [ ] (E) Other (describe)

## 6. Error handling and fallback behavior

What should happen if MongoDB is unavailable or connection fails?

- [x] (A) Prevent user login - authentication requires database access
- [ ] (B) Allow login but log errors - authentication works without database
- [ ] (C) Graceful degradation - try database, fall back to in-memory session only
- [ ] (D) Retry logic with circuit breaker pattern
- [ ] (E) Other (describe)

## 7. Existing users and migration

Do you have existing users or is this a fresh implementation?

- [x] (A) Fresh implementation - no existing users to migrate
- [ ] (B) Have existing users in another system that need migration
- [ ] (C) Currently using in-memory sessions, need to migrate to persistent storage
- [ ] (D) Not sure yet
- [ ] (E) Other (describe)

## 8. Success demonstration

How would you like to verify this feature is working correctly?

- [ ] (A) Successful login creates a user record visible in MongoDB Atlas dashboard
- [x] (B) Login + user data persists across server restarts
- [ ] (C) View user data in application (admin panel or user profile page)
- [ ] (D) Automated tests verify database operations
- [ ] (E) Other (describe)
