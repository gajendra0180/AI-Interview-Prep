# Interview Prep Application

A **Next.js** application designed to help users prepare for interviews, offering features like user authentication, email verification, and customized interview experiences. This application supports a variety of interview preferences, including experience levels, focus areas, and programming languages, offering a smooth and interactive preparation process.

## Key Features

* **User Authentication**: Registration and login with email verification, using JWT and bcryptjs for secure authentication.
* **Customizable Interview Preferences**: Set up preferences such as experience level, focus area, and interviewer voice.
* **Programming Language Selection**: Choose from various programming languages for DSA interview preparation.
* **Responsive UI**: Built with **Tailwind CSS** for a modern, responsive design across devices.
* **Scalable Architecture**: Implements **MVC** architecture to maintain a clean separation of concerns.

## Tech Stack

* **Frontend**: Next.js 14 with App Router, React, TypeScript, Tailwind CSS
* **Backend**: Next.js API Routes (handles backend logic directly within the application)
* **Database**: MongoDB with Mongoose for data modeling and storage
* **Authentication**: JSON Web Tokens (JWT) for session management, bcryptjs for password hashing
* **Email**: Nodemailer for sending emails (including email verification)
* **Form Validation**: Zod and React Hook Form for client-side validation

## Project Structure

Here’s an overview of the project structure, which follows a modular design pattern:

```
├── src/
│   ├── app/                  # App router pages (handles route organization)
│   │   ├── api/              # API routes (handles backend requests)
│   │   ├── (auth)/           # Authentication routes (login, register, etc.)
│   │   └── (dashboard)/      # Protected routes (user dashboard, interview prep)
│   ├── components/           # Reusable React components
│   ├── controllers/          # Business logic for handling requests
│   ├── lib/                  # Helper libraries (for DB connections, etc.)
│   ├── middleware/           # Authentication middleware to secure routes
│   ├── models/               # MongoDB data models (schemas for users, interviews, etc.)
│   ├── services/             # Service layer (for email services, etc.)
│   └── utils/                # Utility functions (for tasks like validation, etc.)
```

## Getting Started

### Prerequisites

To run this application locally, you’ll need:

* **Node.js**: Version 18.x or higher
* **MongoDB**: Local installation or **MongoDB Atlas** for cloud-based DB hosting
* **SMTP Server**: For email verification (any email provider, such as Gmail or SendGrid)

### Environment Setup

1. **Clone the repository** to your local machine:

   ```bash
   git clone https://github.com/your-username/interview-prep.git
   cd interview-prep
   ```

2. **Create a `.env.local` file** in the root directory with the following content:

   ```
   # MongoDB Connection URL
   MONGODB_URI=mongodb://localhost:27017/interview-prep

   # JWT Secret for signing tokens
   JWT_SECRET=your-secret-key-here

   # Email Service Configuration (SMTP for email verification)
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@example.com
   EMAIL_PASSWORD=your-email-password
   EMAIL_FROM=noreply@interviewprep.com
   EMAIL_SECURE=false  # Use true if your SMTP service requires SSL/TLS

   # Application URL (used for email links, etc.)
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Installation

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Run the Development Server**:

   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

### Deployment

To deploy this application to Vercel or another hosting platform:

1. **Build the Application**:

   ```bash
   npm run build
   ```

2. **Deploy**: You can now deploy the application to Vercel, Heroku, or another platform. Simply connect your repository to the platform and it will automatically handle deployment after building the app.

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more information.

