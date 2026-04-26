import express from 'express';
import nodemailer from 'nodemailer';
import 'dotenv/config';

const app = express();

const allowedOrigins = new Set([
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://127.0.0.1:5000',
  'http://localhost:5000',
  'https://cuet-lost-found-box.onrender.com',
  'https://cuet-lost-found-box-1.onrender.com'
  'https://cuet-lost-found-box-production.up.railway.app'
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (!origin || allowedOrigins.has(origin)) {
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Vary', 'Origin');
    }
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

app.use(express.json());

// Configure the Brevo Transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 465, // Using 465 to avoid the common 587 university blocks
  secure: true,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

app.post('/api/verify-email', async (req, res) => {
  const { email, userName } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // 1. Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    // 2. Send the Email
    await transporter.sendMail({
      from: `"CUET Box Verification" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Verify your CUET Lost & Found Account",
      html: `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px;">
          <h2 style="color: #2c3e50;">Hello, ${userName || 'Student'}!</h2>
          <p>Thank you for using CUET Lost & Found Box. Use the code below to verify your email:</p>
          <div style="background: #f4f4f4; padding: 10px; font-size: 24px; text-align: center; letter-spacing: 5px; font-weight: bold;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    // 3. Return success (and the OTP so your main backend can save/verify it)
    res.status(200).json({ 
      success: true, 
      message: "Verification email sent",
      otp: otp // In production, don't return this to the frontend! Send it only to your backend.
    });

  } catch (error) {
    console.error("Verification API Error:", error);
    res.status(500).json({ error: "Failed to send verification email" });
  }
});

const PORT = Number(process.env.MAIL_SENDER_PORT) || 5001;
app.listen(PORT, () => console.log(`Verification service running on port ${PORT}`));
