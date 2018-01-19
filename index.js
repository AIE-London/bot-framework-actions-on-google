//=========================================================
// Import NPM modules
//=========================================================
const express = require("express");
const bodyParser = require("body-parser");
const fulfill = require("./lib/fulfilment");


module.exports = (directlineSecret, conversationTimeout) => {
  const router = express.Router();
  router.use(bodyParser.json());
  router.use(fulfill(directlineSecret, conversationTimeout));

  return router;
};