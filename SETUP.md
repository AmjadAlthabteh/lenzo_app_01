# Enhanced Lenso Application - Setup Guide

This application has been significantly enhanced with:
- Full user authentication with secure password hashing
- Two-factor authentication (2FA) with TOTP
- Role-based access control (RBAC)
- Rate limiting for security
- Real-time collaboration features
- Live editing with WebSocket support
- Encrypted data storage
- Admin panel for user management
- Activity logging

## Prerequisites

- Node.js 18+ and npm
- OpenSSL (for generating secrets)

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env.local
```

Edit `.env.local` and set the following:

#### Required Variables

```env
# OpenAI API key (required for AI features)
OPENAI_API_KEY=your-openai-api-key

# Database URL (SQLite for development)
DATABASE_URL="file:./dev.db"

# NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=http://localhost:3000

# Encryption Secret (generate with: openssl rand -base64 32)
ENCRYPTION_SECRET=your-random-encryption-secret
```

#### Optional Variables

```env
# GitHub OAuth (optional)
GITHUB_ID=your-github-oauth-client-id
GITHUB_SECRET=your-github-oauth-client-secret

# AWS S3 for media storage (optional)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
S3_BUCKET=your-bucket-name

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Setup Database

```bash
# Generate Prisma client
npm run prisma:generate

# Push database schema
npm run db:push
```

### 4. Run the Application

```bash
# Development mode
npm run dev
```

Visit `http://localhost:3000`

## Features Overview

### Authentication

#### Registration
- Navigate to `/register` to create a new account
- Password requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

#### Login
- Navigate to `/login`
- Support for email/password login
- 2FA verification if enabled
- Guest login still available

### Two-Factor Authentication (2FA)

1. Login and go to `/dashboard`
2. In the 2FA section, click "Enable 2FA"
3. Scan the QR code with an authenticator app (Google Authenticator, Authy, etc.)
4. Save the backup codes in a secure location
5. Enter the 6-digit code from your app to verify
6. 2FA is now enabled!

### User Roles

The system supports 4 role levels:

- **USER** - Basic permissions (create/edit own posts)
- **MODERATOR** - Can moderate posts and manage collaborations
- **ADMIN** - Full admin access to user management and settings
- **SUPER_ADMIN** - Complete system access

### Admin Panel

Admins and Super Admins can access the admin panel at `/admin`:

- View all users
- Change user roles
- See user statistics
- Monitor 2FA adoption
- View activity logs

### Real-Time Collaboration

Posts can have real-time collaboration enabled:

- See who's viewing a post
- Live cursor positions
- Synchronized edits
- Real-time notifications

### Security Features

#### Rate Limiting
- Login attempts: 5 per 15 minutes
- API calls: 60 per minute
- Strict endpoints: 10 per minute

#### Account Security
- Failed login attempt tracking
- Account locking after 5 failed attempts
- Encrypted 2FA secrets
- Hashed backup codes
- Activity logging for auditing

#### Data Encryption
- 2FA secrets encrypted at rest
- Backup codes hashed with bcrypt
- Sensitive metadata encrypted
- Password hashing with bcrypt (12 rounds)

### Role-Based Permissions

Example permissions:
- `post:create` - Create posts
- `post:update:any` - Update any post
- `user:manage:roles` - Manage user roles
- `admin:access` - Access admin panel
- `collaboration:manage` - Manage collaborations

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/2fa/setup` - Initiate 2FA setup
- `POST /api/auth/2fa/enable` - Enable 2FA
- `POST /api/auth/2fa/disable` - Disable 2FA

### User Management
- `GET /api/users/me` - Get current user
- `GET /api/admin/users` - List all users (admin)
- `PATCH /api/admin/users/[userId]/role` - Change user role (admin)

### Posts (existing)
- `GET /api/posts` - List posts
- `POST /api/posts/create` - Create post
- `POST /api/ai/summarize` - AI summarization
- `POST /api/ai/moderate` - AI moderation

## Development

### Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate ENCRYPTION_SECRET
openssl rand -base64 32
```

### Reset Database

```bash
rm prisma/dev.db
npm run db:push
```

### View Database

```bash
npx prisma studio
```

## Production Deployment

### Important Security Steps

1. **Change all default secrets** in production
2. **Use a production database** (PostgreSQL, MySQL, etc.)
3. **Enable HTTPS** for all connections
4. **Set secure CORS policies**
5. **Configure proper rate limits**
6. **Set up monitoring and alerts**
7. **Regular security audits**

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL=your-production-database-url
NEXTAUTH_URL=https://yourdomain.com
```

## Testing

### Test User Registration

1. Go to `/register`
2. Create an account with a valid email and strong password
3. Login at `/login`

### Test 2FA

1. Login and navigate to `/dashboard`
2. Enable 2FA and scan QR code
3. Logout and login again
4. Verify 2FA token is required

### Test Admin Features

1. Manually set a user's role to ADMIN in the database
2. Login as that user
3. Access `/admin` to manage users

```sql
-- Using Prisma Studio or SQL
UPDATE User SET role = 'ADMIN' WHERE email = 'your@email.com';
```

## Architecture

### Security Layers

```
User Request
    ↓
Rate Limiter (middleware)
    ↓
Authentication (NextAuth)
    ↓
Authorization (RBAC)
    ↓
Business Logic
    ↓
Data Encryption (for sensitive data)
    ↓
Database
```

### Real-Time Architecture

```
Client (Browser)
    ↓
Socket.IO Connection
    ↓
WebSocket Server
    ↓
Event Handlers
    ↓
Database (Collaboration state)
    ↓
Broadcast to Room Members
```

## Troubleshooting

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Regenerate Prisma client
npm run prisma:generate
```

### Database Errors

```bash
# Reset database
rm prisma/dev.db
npm run db:push
```

### 2FA Issues

If locked out of account with 2FA:
- Use backup codes provided during setup
- Or manually disable 2FA in database:

```sql
UPDATE User SET twoFactorEnabled = false WHERE email = 'your@email.com';
```

## Support

For issues and questions:
- Check the main README.md
- Review the code documentation
- Open an issue on GitHub

## License

ISC
