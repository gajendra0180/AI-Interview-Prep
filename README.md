# Interview Prep Application

A Next.js application for interview preparation with features for user authentication, email verification, and customized interview experiences.

## Features

- User registration and login with email verification
- Interview preferences setup (experience level, focus area, interviewer voice preference)
- Programming language selection for DSA interviews
- Responsive UI with Tailwind CSS
- MVC architecture for scalability

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcryptjs
- **Email**: Nodemailer
- **Form Validation**: Zod, React Hook Form

## Project Structure

```
├── src/
│   ├── app/                  # App router pages
│   │   ├── api/              # API routes
│   │   ├── (auth)/           # Authentication routes
│   │   └── (dashboard)/      # Protected routes
│   ├── components/           # React components
│   ├── controllers/          # Business logic controllers
│   ├── lib/                  # Library functions (DB, etc.)
│   ├── middleware/           # Authentication middleware
│   ├── models/               # Database models
│   ├── services/             # Service layer (email, etc.)
│   └── utils/                # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB (local or Atlas)
- SMTP server for email verification

### Environment Setup

1. Clone the repository
2. Create a `.env.local` file in the root directory with the following variables:

```
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/interview-prep

# JWT Secret
JWT_SECRET=your-secret-key-here

# Email Service Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=noreply@interviewprep.com
EMAIL_SECURE=false

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Deployment

This application can be easily deployed on Vercel:

```bash
npm run build
```

## License

MIT
