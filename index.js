//=========================================================
// Import NPM modules
//=========================================================
const express = require("express");
const bodyParser = require("body-parser");
const fulfill = require("./lib/fulfilment");

class OnUserSignedInHandlerProvider {
  constructor() {
    this.handler = (user) => {
      return Promise.resolve(user)
    }
  }

  registerHandler(handler) {
    this.handler = handler
  }

  getHandler() {
    return this.handler
  }
}


module.exports = (directlineSecret, conversationTimeout, shouldGetUsersNameFromGoogle = true) => {
  const onUserSignedInHandlerProvider = new OnUserSignedInHandlerProvider();
  const router = express.Router();
  router.use(bodyParser.json());
  router.use(fulfill(directlineSecret, onUserSignedInHandlerProvider, conversationTimeout, shouldGetUsersNameFromGoogle));

  return {
    onUserSignedInHandlerProvider,
    router
  };
};