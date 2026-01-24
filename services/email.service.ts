import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendVerificationEmail = async (
    to: string,
    verifyUrl: string
) => {
    await transporter.sendMail({
        from: '"Your App" <no-reply@yourapp.com>',
        to,
        subject: "Verify your email",
        html: `
            <p>Please verify your email by clicking the link below:</p>
            <a href="${verifyUrl}">Verify Email</a>
            <p>This link expires in 1 hour.</p>
        `,
    });
};
