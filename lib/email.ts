import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

export const sendPasswordResetEmail = async (email: string, token: string) => {
  // Use AUTH_URL if available, fallback to Vercel production URL, or hardcoded domain
  const baseUrl = process.env.AUTH_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://fastpdfv1.vercel.app');
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset your password - Fast PDF',
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FAFAFA; border-radius: 16px;">
        <h2 style="color: #0F172A; font-family: 'Calistoga', serif; margin-bottom: 16px;">Reset Your Password</h2>
        <p style="color: #475569; line-height: 1.6;">You recently requested to reset your password for your account. Click the button below to set a new password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #0052FF 0%, #4D7CFF 100%); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; margin: 24px 0; box-shadow: 0 4px 14px 0 rgba(0, 82, 255, 0.39);">Reset Password</a>
        <p style="color: #475569; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
};

export const sendVerificationEmail = async (email: string, otp: string) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify your email - Fast PDF',
    html: `
      <div style="font-family: 'Poppins', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #FAFAFA; border-radius: 16px;">
        <h2 style="color: #0F172A; font-family: 'Poppins', serif; margin-bottom: 16px;">Verify Your Email</h2>
        <p style="color: #475569; line-height: 1.6;">Thank you for signing up for Fast PDF! Please use the following 6-digit code to verify your email address. This code will expire in 10 minutes.</p>
        <div style="background-color: #F1F5F9; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
          <span style="font-family: 'JetBrains Mono', monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #0052FF;">${otp}</span>
        </div>
        <p style="color: #475569; font-size: 14px;">If you didn't create an account with us, you can safely ignore this email.</p>
      </div>
    `,
  });
};
