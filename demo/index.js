//=========================================================
// Import NPM modules
//=========================================================
const express = require("express");
const actionsOnGoogleAdapter = require("../")(process.env.DIRECT_LINE_SECRET);

const PORT = process.env.PORT || 3000;
const app = express();

app.use(actionsOnGoogleAdapter.router);

actionsOnGoogleAdapter.onUserSignedInHandlerProvider.registerHandler((user) => {
  //Get additional user details from your API once account is linked and access token is available
  // return fetch('https://your-api/user/' + user.userId, {
  //   headers: {
  //     Authorization: `Bearer ${user.accessToken}`
  //   }
  // }).then(res => res.json())
  return Promise.resolve({username: 'John87', ...user})
});

app.listen(PORT, () => console.log(`ActionsOnGoogle demo listening on port ${PORT}!`));