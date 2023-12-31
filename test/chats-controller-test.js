const { describe, it } = require('node:test');
const assert = require('assert');
const {
  ChatsController,
  createChatsController,
} = require('../src/chats-controller');

describe('ChatsController', () => {
  it('Should be able to add User', (ctx) => {
    const addUser = ctx.mock.fn();
    const updateDatabase = ctx.mock.fn();
    const chatsStorage = { updateDatabase };
    const chats = { addUser, allChatsDetails: 'Fake Data' };

    const chatsController = new ChatsController(chats, chatsStorage);
    chatsController.addUser('milan', 'Fake Callback');

    assert.strictEqual(addUser.mock.callCount(), 1);
    assert.strictEqual(addUser.mock.calls[0].arguments[0], 'milan');
    assert.strictEqual(updateDatabase.mock.callCount(), 1);
    assert.deepStrictEqual(updateDatabase.mock.calls[0].arguments, [
      'Fake Data',
      'Fake Callback',
    ]);
  });

  it('Should be check is User present', (ctx) => {
    const isUserPresent = ctx.mock.fn();
    const chats = { isUserPresent };
    const chatsStorage = {};

    const chatsController = new ChatsController(chats, chatsStorage);
    chatsController.isUserPresent('milan');

    assert.strictEqual(isUserPresent.mock.callCount(), 1);
    assert.strictEqual(isUserPresent.mock.calls[0].arguments[0], 'milan');
  });

  it('Should be able to give all the chatHeads of a user', (ctx) => {
    const getChatHeads = ctx.mock.fn();
    const chats = { getChatHeads };
    const chatsStorage = {};

    const chatsController = new ChatsController(chats, chatsStorage);
    chatsController.getChatHeads('milan');

    assert.strictEqual(getChatHeads.mock.callCount(), 1);
    assert.strictEqual(getChatHeads.mock.calls[0].arguments[0], 'milan');
  });

  it('Should be able to get all direct messages between 2 users', (ctx) => {
    const getDirectMessages = ctx.mock.fn();
    const chats = { getDirectMessages };
    const chatsStorage = {};

    const chatsController = new ChatsController(chats, chatsStorage);
    chatsController.getDirectMessages('milan', 'raj');

    assert.strictEqual(getDirectMessages.mock.callCount(), 1);
    assert.deepStrictEqual(getDirectMessages.mock.calls[0].arguments, [
      'milan',
      'raj',
    ]);
  });

  it('Should be able to register direct message', (ctx) => {
    const registerDirectMessage = ctx.mock.fn();
    const updateDatabase = ctx.mock.fn();
    const chatsStorage = { updateDatabase };
    const chats = { registerDirectMessage, allChatsDetails: 'Fake Data' };

    const chatsController = new ChatsController(chats, chatsStorage);
    chatsController.registerDirectMessage('Fake Message Details');

    assert.strictEqual(registerDirectMessage.mock.callCount(), 1);
    assert.strictEqual(
      registerDirectMessage.mock.calls[0].arguments[0],
      'Fake Message Details'
    );
  });
});

describe('Create Chats Controller', () => {
  it('Should create chats Controller with empty chats when data from storage is empty', (ctx) => {
    const existsSync = ctx.mock.fn(() => true);
    const readFileSync = ctx.mock.fn(() => '{}');
    const fs = { existsSync, readFileSync };
    const storagePath = {};

    const chatsController = createChatsController(storagePath, fs);

    assert.strictEqual(chatsController.isUserPresent('milan'), false);
  });

  it('Should create chats Controller with the given data when data from storage is not empty', (ctx) => {
    const chatsDetails = {
      messagesDetails: {},
      usersDetails: { milan: [] },
      usersTokenData: {},
    };

    const existsSync = ctx.mock.fn(() => true);
    const readFileSync = ctx.mock.fn(() => JSON.stringify(chatsDetails));
    const fs = { existsSync, readFileSync };
    const storagePath = {};

    const chatsController = createChatsController(storagePath, fs);

    assert.strictEqual(chatsController.isUserPresent('milan'), true);
  });
});
