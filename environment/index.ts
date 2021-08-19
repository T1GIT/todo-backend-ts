import dotenv from 'dotenv'


const {NODE_ENV} = process.env

let path

switch (NODE_ENV) {
    case 'production':
        path = '.env.production';
        break
    case 'test':
        path = '.env.test';
        break
    default:
        path = '.env';
        break
}

dotenv.config({path})

const {
    HOST, PORT,
    DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD,
    JWT_SECRET, COOKIE_SECRET,
    ACCEPT_ORIGIN,
    VERSION
} = process.env

export {
    NODE_ENV,
    HOST, PORT,
    DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD,
    JWT_SECRET, COOKIE_SECRET,
    ACCEPT_ORIGIN,
    VERSION
}
