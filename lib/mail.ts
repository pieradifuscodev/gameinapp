import nodemailer from "nodemailer";

// Creiamo un transporter con Nodemailer. 
// Le credenziali devono essere inserite nel file .env
// Esempio per Gmail:
// SMTP_HOST=smtp.gmail.com
// SMTP_PORT=465
// SMTP_USER=tua_email@gmail.com
// SMTP_PASS=tua_password_per_app

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"GameInApp" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset della password - GameInApp",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #0f172a;">Reset Password</h1>
        <p>Hai richiesto di reimpostare la tua password su GameInApp.</p>
        <p>Clicca sul pulsante qui sotto per creare una nuova password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Reimposta Password</a>
        </div>
        <p>Se non hai richiesto tu il reset, ignora questa email.</p>
        <p>Il link scadrà tra 1 ora.</p>
      </div>
    `,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyLink = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"GameInApp" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verifica la tua email - GameInApp",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #0f172a;">Benvenuto in GameInApp!</h1>
        <p>Grazie per esserti registrato. Per iniziare a organizzare o partecipare a eventi, per favore verifica il tuo indirizzo email.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyLink}" style="background-color: #0f172a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Verifica Email</a>
        </div>
        <p>Se non ti sei registrato tu, ignora questa email.</p>
      </div>
    `,
  });
};
