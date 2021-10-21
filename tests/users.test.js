const app = require('../src/app')
const request = require('supertest')
const User = require('../src/models/user')
const redis = require('../src/db/redis')
const { testUser, testUserTwo, setupDataBase } = require('./utils/db')
jest.mock('redis', () => jest.requireActual('redis-mock'));
beforeEach(setupDataBase)
test('Should sign up new User', async() => {
    const response = await request(app)
        .post('/user/register')
        .send({
            "email": "test123@test.test",
            "username": "test123",
            "password": "testtest1",
            "firstname": "test",
            "lastname": "test"
        })
        .expect(201)
    console.log('h')
    const id = response.body.user.user_id
    const user = await User.findUserById(id)
    expect(user).not.toBeNull()
    const token = await redis.hgetallAsync(`users<${id}>`)
    expect(Object.values(token)).toContain(response.body.token)
})
test('Should not sign with existing Email', async() => {
    delete testUser.id
    await request(app)
        .post('/user/register')
        .send(testUser)
        .expect(400)
})