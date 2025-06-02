import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, htmlContent: string) {
  const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASSWORD,
    EMAIL_FROM,
  } = process.env;

  // Validate email configuration
  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || 
      !EMAIL_PASSWORD || !EMAIL_FROM) {
    throw new Error('Email configuration is incomplete. Check your environment variables.');
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: Number(EMAIL_PORT) === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  // Send email
  const emailOptions = {
    from: `Interview Prep <${EMAIL_FROM}>`,
    to,
    subject,
    html: htmlContent,
  };

  await transporter.sendMail(emailOptions);
} 