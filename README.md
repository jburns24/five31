# Next.js Google Authentication App

A containerized Next.js SSR application with Google authentication using NextAuth.js.

## Features

- Server-Side Rendering (SSR)
- Google OAuth authentication
- Protected routes
- Docker containerization
- TypeScript support
- Modern Next.js App Router

## Prerequisites

- Node.js 20+ (for local development)
- Docker and Docker Compose (for containerized deployment)
- Google Cloud Console account (for OAuth credentials)

## Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for local development)
   - `https://your-domain.com/api/auth/callback/google` (for production)
7. Copy the Client ID and Client Secret

### 3. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

## Running the Application

### Local Development

```bash
npm run dev
```

Visit `http://localhost:3000`

### Docker Deployment

Build and run with Docker Compose:

```bash
docker-compose up --build
```

Or build and run manually:

```bash
docker build -t nextjs-google-auth .
docker run -p 3000:3000 --env-file .env nextjs-google-auth
```

Visit `http://localhost:3000`

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts        # NextAuth configuration
│   ├── dashboard/
│   │   └── page.tsx                # Protected dashboard page
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Home page
│   └── globals.css                 # Global styles
├── components/
│   ├── SessionProvider.tsx         # Client-side session provider
│   ├── SignInButton.tsx            # Google sign-in button
│   └── SignOutButton.tsx           # Sign-out button
├── Dockerfile                      # Docker configuration
├── docker-compose.yml              # Docker Compose configuration
├── next.config.js                  # Next.js configuration
├── package.json                    # Dependencies
└── tsconfig.json                   # TypeScript configuration
```

## How It Works

1. **Authentication Flow**:
   - User visits the home page
   - Clicks "Sign in with Google"
   - Redirected to Google OAuth consent screen
   - After approval, redirected back to the dashboard

2. **Server-Side Rendering**:
   - Pages are rendered on the server with `getServerSession()`
   - Authentication state is checked server-side
   - Protected routes redirect unauthenticated users

3. **Docker Container**:
   - Multi-stage build for optimized image size
   - Standalone output mode for efficient deployment
   - Runs on port 3000 with non-root user

## Production Deployment

For production:

1. Update `NEXTAUTH_URL` in `.env` to your production domain
2. Add your production domain to Google OAuth redirect URIs
3. Use a strong `NEXTAUTH_SECRET`
4. Consider using a secrets manager for environment variables
5. Set up HTTPS/SSL for your domain

## Troubleshooting

**"Invalid redirect URI"**
- Ensure your redirect URI in Google Console matches exactly: `http://localhost:3000/api/auth/callback/google`

**"NEXTAUTH_SECRET is not set"**
- Generate a secret: `openssl rand -base64 32`
- Add it to your `.env` file

**Docker build fails**
- Ensure Docker is running
- Check that `.env` file exists with all required variables

## License

MIT
