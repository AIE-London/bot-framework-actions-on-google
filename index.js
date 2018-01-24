//=========================================================
// Import NPM modules
//=========================================================
const express = require("express");
const bodyParser = require("body-parser");
const fulfill = require("./lib/fulfilment");

const onUserSignedInHandlerProvider = {
  registerHandler: (handler) => this.handler = handler,
  getHandler: () => this.handler,
};


module.exports = (directlineSecret) => {
  const router = express.Router();
  router.use(bodyParser.json());
  router.use(fulfill(directlineSecret, onUserSignedInHandlerProvider));

  return {
    onUserSignedInHandlerProvider,
    router
  };
};