const { describe, it, beforeEach } = require('node:test');
const request = require('supertest');
const { createAndSetupApp } = require('../../src/app');

let app = null;

describe('POST /login', () => {
  beforeEach(() => (app = createAndSetupApp()));
  it('Should give invalidPassword as true if password entered is invalid', (ctx, done) => {
    const isUserPresent = ctx.mock.fn(() => true);
    const validateUserLogin = ctx.mock.fn(() => false);
    const getUserHash = ctx.mock.fn(() => 'userHash');
    const authController = { isUserPresent, validateUserLogin, getUserHash };

    const userDetails = { username: 'milan', password: 1234 };

    app.context = { authController };
    request(app)
      .post('/login')
      .send(userDetails)
      .set('Content-type', 'application/json')
      .expect(401)
      .expect('Content-Type', /application\/json/)
      .expect({ invalidPassword: true, userNotExists: false })
      .end(done);
  });

  it('Should give userNotExists as true when user is not present', (ctx, done) => {
    const isUserPresent = ctx.mock.fn(() => false);
    const validateUserLogin = ctx.mock.fn();
    const getUserHash = ctx.mock.fn(() => 'userHash');
    const authController = { isUserPresent, validateUserLogin, getUserHash };

    const userDetails = { username: 'milan', password: 1234 };

    app.context = { authController };
    request(app)
      .post('/login')
      .send(userDetails)
      .set('Content-type', 'application/json')
      .expect(401)
      .expect('Content-Type', /application\/json/)
      .expect({ invalidPassword: null, userNotExists: true })
      .end(done);
  });

  it('Should set auth cookie and redirect to home page, when existing user logs in', (ctx, done) => {
    const isUserPresent = ctx.mock.fn(() => true);
    const validateUserLogin = ctx.mock.fn(() => true);
    const getUserHash = ctx.mock.fn(() => 'userHash');
    const authController = { isUserPresent, validateUserLogin, getUserHash };

    const userDetails = { username: 'milan', password: 1234 };

    app.context = { authController };
    request(app)
      .post('/login')
      .send(userDetails)
      .set('Content-type', 'application/json')
      .expect(302)
      .expect('location', '/')
      .expect('Set-Cookie', 'auth=userHash; Path=/')
      .end(done);
  });
});

describe('GET /login-details', () => {
  it('Should give username and login status', (ctx, done) => {
    const getUsername = ctx.mock.fn(() => 'milan');
    const isUserPresent = ctx.mock.fn(() => true);
    const authController = { getUsername, isUserPresent };

    const app = createAndSetupApp();
    app.context = { authController };

    request(app)
      .get('/login-details')
      .set('Cookie', 'auth=userHash')
      .expect(200)
      .expect({ isLoggedIn: true, username: 'milan' })
      .end(done);
  });
});

describe('POST /logout', () => {
  it('Should set the cookie with old expiry date', (_, done) => {
    const todoController = {};
    const app = createAndSetupApp(todoController);

    request(app)
      .post('/logout')
      .expect(
        'set-cookie',
        'auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
      )
      .expect(302)
      .expect('location', '/')
      .end(done);
  });
});
