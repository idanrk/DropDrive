module.exports = {
    SQL_HOST: process.env.SQL_HOST || 'localhost',
    SQL_USER: process.env.SQL_USER || 'root',
    SQL_PASS: process.env.SQL_PASS || '',
    SQL_DB: process.env.SQL_DB || 'prod',
    REDIS_URL: process.env.REDIS_URL || '127.0.0.1',
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    EXPRESS_PORT: process.env.EXPRESS_PORT || 3000,
    JWT_TOKEN: process.env.JWT_TOKEN || "SecRet!@"
};