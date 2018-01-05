//=========================================================
// Import NPM modules
//=========================================================
const express = require("express");
const fulfill = require("./lib/fulfilment");

module.exports = (directlineSecret) => {
  const router = express.Router();
  router.use(fulfill(directlineSecret));

  return router;
};