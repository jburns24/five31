# 01-tasks-mongodb-atlas-auth.md

## Tasks

### [x] 1.0 Set up MongoDB Atlas dependencies and connection infrastructure

#### 1.0 Proof Artifact(s)

- **Screenshot**: Application console output showing "MongoDB connected successfully" message demonstrates database connectivity
- **Screenshot**: MongoDB Atlas dashboard showing active connection from the application demonstrates two-way connectivity
- **Screenshot**: Application console output showing connection error when `MONGODB_URI` is invalid or missing demonstrates error handling and fail-secure behavior
- **Diff**: `.env.example` file showing `MONGODB_URI` placeholder with documentation demonstrates configuration is documented

#### 1.0 Tasks

- [x] 1.1 Install mongoose and @types/mongoose dependencies
- [x] 1.2 Create `lib/mongodb.ts` with Mongoose connection singleton pattern for Next.js serverless environment
- [x] 1.3 Update `.env.example` to include `MONGODB_URI` placeholder with documentation
- [x] 1.4 Test connection with valid MongoDB URI and verify console output
- [x] 1.5 Test connection error handling with invalid MongoDB URI

---

### [x] 2.0 Create User model with Mongoose schema and TypeScript types

#### 2.0 Proof Artifact(s)

- **Code**: `models/User.ts` file showing Mongoose schema with fields (googleId, email, name, image) and validation rules demonstrates schema definition
- **TypeScript**: Type definitions with proper TypeScript interfaces matching schema structure demonstrates type safety
- **Code**: Schema includes unique constraint on `googleId` and email validation demonstrates data integrity requirements

#### 2.0 Tasks

- [x] 2.1 Create `models/User.ts` with Mongoose schema including googleId, email, name, and image fields
- [x] 2.2 Add validation rules: unique constraint on googleId, email format validation, required fields
- [x] 2.3 Add automatic timestamps (createdAt, updatedAt) to schema
- [x] 2.4 Define TypeScript interfaces matching schema structure for type safety
- [x] 2.5 Export User model with proper TypeScript types

---

### [x] 3.0 Integrate user creation with NextAuth sign-in callback

#### 3.0 Proof Artifact(s)

- **Screenshot**: MongoDB Atlas dashboard showing a newly created user document after first sign-in with populated fields (googleId, email, name, image) demonstrates user creation
- **Screenshot**: Application successfully displays user information on dashboard after sign-in demonstrates data retrieval and integration
- **Test**: Sign in with same Google account twice and MongoDB Atlas dashboard shows only one user record demonstrates duplicate prevention
- **Screenshot**: Authentication fails with error message when MongoDB is disconnected demonstrates fail-secure behavior

#### 3.0 Tasks

- [x] 3.1 Read existing NextAuth configuration in `app/auth.ts`
- [x] 3.2 Import MongoDB connection and User model in auth configuration
- [x] 3.3 Implement signIn callback to check for existing user by Google OAuth ID
- [x] 3.4 Create new user record if user doesn't exist, using Google profile data
- [x] 3.5 Implement fail-secure behavior: return false if database operation fails
- [x] 3.6 Test user creation on first sign-in and verify MongoDB record
- [x] 3.7 Test duplicate prevention by signing in twice with same account

---

### [x] 4.0 Verify data persistence across server restarts

#### 4.0 Proof Artifact(s)

- **Test Sequence Documentation**:
  1. Sign in with Google and capture screenshot of user record in MongoDB Atlas
  2. Stop the Next.js server (`Ctrl+C` or `docker-compose down`)
  3. Restart the Next.js server (`npm run dev` or `docker-compose up`)
  4. Refresh browser (still authenticated via JWT cookie)
  5. Verify dashboard shows user data and MongoDB Atlas still contains user record

  This demonstrates both session persistence (JWT) and data persistence (MongoDB)
- **Screenshot**: MongoDB Atlas dashboard showing user record exists with same data after server restart demonstrates persistent storage
- **Screenshot**: Application dashboard showing user profile information after server restart demonstrates data retrieval works after restart

#### 4.0 Tasks

- [x] 4.1 Sign in with Google and capture user record in MongoDB Atlas
- [x] 4.2 Stop the Next.js development server
- [x] 4.3 Restart the Next.js development server
- [x] 4.4 Refresh browser and verify user still authenticated via JWT cookie
- [x] 4.5 Verify user data displayed on dashboard after restart
- [x] 4.6 Verify MongoDB Atlas still contains user record with same data
