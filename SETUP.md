# Blog System Setup Guide

This guide will help you set up the blog system with Clerk authentication and external blog fetching.

## 1. Clerk Authentication Setup

### Step 1: Create a Clerk Account
1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Choose "Next.js" as your framework

### Step 2: Configure Environment Variables
Create a `.env.local` file in your project root with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### Step 3: Get Your Clerk Keys
1. In your Clerk dashboard, go to "API Keys"
2. Copy the "Publishable Key" and "Secret Key"
3. Replace the placeholder values in your `.env.local` file

## 2. Features Implemented

### ✅ Blog System
- **External Blog Fetching**: Fetches blog posts from multiple sources:
  - Dev.to API
  - Hashnode API  
  - Medium RSS (via RSS2JSON)
  - Fallback mock data
- **Blog Categories**: Filter by tech tags (JavaScript, React, Next.js, TypeScript, AI, etc.)
- **Responsive Design**: Mobile-friendly blog layout
- **Blog Detail Pages**: Individual blog post pages with comments

### ✅ Authentication System
- **Clerk Integration**: Complete authentication setup
- **Admin Access**: Only authenticated users can access admin features
- **Public Access**: Blog and comments are publicly accessible

### ✅ Comments System
- **Public Comments**: Anyone can submit comments on blog posts
- **Admin Moderation**: Comments require admin approval before being displayed
- **Admin Dashboard**: Manage and approve/reject comments
- **Comment Validation**: Email validation and content length checks

### ✅ Admin Features
- **Admin Dashboard**: `/admin` route for managing comments
- **Comment Management**: Approve, reject, and view all comments
- **Statistics**: View total, pending, and approved comment counts

## 3. API Routes

### Public Routes
- `GET /api/blogs` - Fetch blog posts from external sources
- `GET /api/comments?postId={id}` - Get approved comments for a post
- `POST /api/comments` - Submit a new comment

### Protected Routes (Admin Only)
- `GET /api/admin/comments` - Get all comments (including unapproved)
- `PATCH /api/admin/comments` - Approve or reject comments

## 4. Pages

### Public Pages
- `/` - Home page
- `/blog` - Blog listing page with filters
- `/blog/[id]` - Individual blog post with comments

### Protected Pages
- `/admin` - Admin dashboard for comment management

## 5. Running the Application

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see Step 2 above)

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## 6. Usage

### For Visitors
1. Browse blog posts on `/blog`
2. Filter posts by category using the tag buttons
3. Click on any blog post to read more
4. Submit comments on blog posts (requires approval)

### For Admins
1. Sign in using the "Admin Login" button in the navbar
2. Access the admin dashboard at `/admin`
3. Review and approve/reject pending comments
4. Manage all comments from the dashboard

## 7. Future Enhancements

### Database Integration
- Replace in-memory storage with Neon Postgres
- Add user management and roles
- Implement comment threading

### Additional Features
- Blog post search functionality
- Newsletter subscription
- Social media sharing
- Analytics dashboard
- Content management system for custom blog posts

## 8. Troubleshooting

### Common Issues

1. **Clerk Authentication Not Working**
   - Verify your environment variables are correct
   - Check that your Clerk application is properly configured
   - Ensure the domain is added to your Clerk application settings

2. **Blog Posts Not Loading**
   - Check the browser console for API errors
   - Verify that external APIs are accessible
   - The system will fall back to mock data if external sources fail

3. **Comments Not Working**
   - Ensure you're signed in as admin to access the admin dashboard
   - Check that the comment API routes are working
   - Verify that comments are being approved in the admin dashboard

### Support
If you encounter any issues, check the browser console for error messages and ensure all environment variables are properly configured. 