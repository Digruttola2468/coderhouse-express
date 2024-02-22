import dotenv from 'dotenv';

dotenv.config();

export default {
    persistenci: process.env.PERSISTENCE,
    mongoURL: process.env.MONGO_URL,
    mongoDBName: process.env.MONGO_DBNAME,
    mailUser: process.env.MAIL_USER,
    mailPass: process.env.MAIL_PASSWORD
}