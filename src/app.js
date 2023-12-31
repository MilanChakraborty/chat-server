const express = require('express');
const { requestLogger } = require('./middlewares/logger.js');
const { attachCookies } = require('./middlewares/attach-cookies.js');
const {
  respondNotFound,
  serveHomePage,
} = require('./handlers/resource-route-handlers');
const {
  handleLoginRequest,
  handleLoginDetailsRequest,
  handleLogoutRequest,
  validateUserLogin,
  handleSignupRequest,
} = require('./handlers/auth-handlers.js');
const {
  handleChatHeadsRequest,
  handleUserExistsRequest,
  handleChatHistoryRequest,
  handleDirectMessageRequest,
} = require('./handlers/chat-handlers.js');

const addChatHandlers = (app) => {
  app.get('/chat-heads', validateUserLogin, handleChatHeadsRequest);
  app.get('/user-exists/:username', validateUserLogin, handleUserExistsRequest);
  app.get(
    '/chat-history/:withUser',
    validateUserLogin,
    handleChatHistoryRequest
  );

  app.post(
    '/direct-message/:to',
    validateUserLogin,
    handleDirectMessageRequest
  );
};

const addAuthHandlers = (app) => {
  app.get('/login-details', handleLoginDetailsRequest);
  app.post('/login', handleLoginRequest);
  app.post('/signup', handleSignupRequest);
  app.post('/logout', handleLogoutRequest);
};

const addMiddlewares = (app) => {
  app.use(requestLogger);
  app.use(attachCookies);
  app.use(express.json());
  app.use(express.urlencoded());
};

const addRouteHandlers = (app) => {
  addAuthHandlers(app);
  addChatHandlers(app);
  app.get('/', validateUserLogin, serveHomePage);
  app.use(express.static('public'));
  app.use(respondNotFound);
};

const createAndSetupApp = () => {
  const app = express();
  addMiddlewares(app);
  addRouteHandlers(app);
  return app;
};

module.exports = { createAndSetupApp };
