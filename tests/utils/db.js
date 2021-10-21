const User = require('../../src/models/user')
const sql = require('../../src/db/mysql')
const redis = require('../../src/db/redis')
const util = require('util');

const query = util.promisify(sql.query).bind(sql);
const execute = util.promisify(sql.execute).bind(sql);

const testUser = new User({
    "id": "1",
    "email": "test@testing.com",
    "username": "testuser",
    "password": "testtest",
    "firstname": "test",
    "lastname": "test"
})

const testUserTwo = new User({
    "id": "2",
    "email": "test2@testing.com",
    "username": "testuser2",
    "password": "testtest",
    "firstname": "test",
    "lastname": "test"
})

const setupDataBase = async() => {
    await redis.expireAsync('users<1>', 0)
    await redis.expireAsync('users<2>', 0)
    await query('SET FOREIGN_KEY_CHECKS = 0');
    await query('SET SQL_SAFE_UPDATES = 0;')
    await query("TRUNCATE drive")
    await query("TRUNCATE files")
    await query("TRUNCATE users")
    await query(`INSERT INTO users (user_id,username,password,email,firstname,lastname) VALUES(?,?,?,?,?,?);`, ["1", "testuser", "testtest", "test@testing.com", "test", "test"])
    await query(`INSERT INTO users (user_id,username,password,email,firstname,lastname) VALUES(?,?,?,?,?,?);`, ["2", "testuser2", "testtest", "test2@testing.com", "test", "test"])
    await query('SET FOREIGN_KEY_CHECKS = 1');



}

module.exports = {
    testUser,
    testUserTwo,
    setupDataBase
}