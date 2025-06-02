import nodemailer from 'nodemailer';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async ({ to, subject, html }: SendEmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Interview Prep" <${process.env.EMAIL_FROM || 'noreply@interviewprep.com'}>`,
    to,
    subject,
    html,
  });
};

export const sendVerificationEmail = async (email: string, verificationToken: string, name: string) => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;
  
  await sendEmail({
    to: email,
    subject: 'Welcome to Interview Prep!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://64r1xuvnkudsrebo.public.blob.vercel-storage.com/ChatGPT%20Image%20May%2012%2C%202025%2C%2009_28_25%20AM-SfXSADxjuSodX7UvKYrmyMOZo90P4b.png" alt="Interview Prep" style="max-width: 100%; height: 250px;">
        </div>
        <h2 style="color: #333;">Verify Your Email Address</h2>
        <p>Hi ${name},</p>
        <p>Thank you for signing up for Interview Prep. We're thrilled to have you on board! To get started, please click the button below to verify your email address:</p>
        <a href="${verificationUrl}" style="display: inline-block; background-color: #4A46EC; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 15px 0;">Verify Email</a>
        <p>If you did not create an account, you can safely ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,</p>
        <p>Anurag Garg<br/>Founder</p>
        <p>Gajendra Pal<br/>Co-Founder</p>
      </div>
    `,
  });
};

export default sendEmail; 