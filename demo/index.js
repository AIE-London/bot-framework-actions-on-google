//=========================================================
// Import NPM modules
//=========================================================
const express = require("express");
const bodyParser = require("body-parser");
const actionsOnGoogleAdapter = require("../");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(actionsOnGoogleAdapter(process.env.DIRECT_LINE_SECRET));

app.listen(PORT, () => console.log(`ActionsOnGoogle demo listening on port ${PORT}!`));