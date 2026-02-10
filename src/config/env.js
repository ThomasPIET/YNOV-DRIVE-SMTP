import dotenv from 'dotenv';

dotenv.config();

export const env = {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    smtpServiceToken: process.env.SMTP_SERVICE_TOKEN,
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
    mail: {
        resendApiKey: process.env.RESEND_API_KEY,
        from: process.env.EMAIL_FROM,
    },
};