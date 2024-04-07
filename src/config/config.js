import dotenv from 'dotenv';

dotenv.config();

export default {
    persistenci: process.env.PERSISTENCE,
    mongoURL: process.env.MONGO_URL,
    mongoDBName: process.env.MONGO_DBNAME,
    mailUser: process.env.MAIL_USER,
    mailPass: process.env.MAIL_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    CALLBACK_URL: process.env.callbackURL,
    USER_ADMIN_GMAIL: process.env.USER_ADMIN_GMAIL,
    USER_ADMIN_PASSW: process.env.USER_ADMIN_PASSW,
    MERCADO_PAGO_SAMPLE_PUBLIC_KEY: process.env.MERCADO_PAGO_SAMPLE_PUBLIC_KEY,
    MERCADO_PAGO_ACCESS_TOKEN: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    URL_PRODUCCION: process.env.URL_PRODUCCION,
    PORT: process.env.PORT || 8080,
}