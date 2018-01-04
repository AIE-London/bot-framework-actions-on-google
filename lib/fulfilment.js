const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;
const DirectLineManager = require("./directline/DirectLineManager");

const EXIT_TRIGGERS = ["bye", "exit", "quit"];
const EXIT_MESSAGE = "Ok, bye!";
const manager = new DirectLineManager();

const fulfill = (app) => {
  let state = app.getDialogState();
  let input = app.getRawInput();
  // If user is trying to exit.
  if (EXIT_TRIGGERS.includes(input.toLowerCase())) {
    app.tell(EXIT_MESSAGE);
  } else {
    // Go ahead and talk to the bot
    let bot;
    if (state.directlineConversationId) {
      bot = manager.resumeConversation(state.directlineConversationId);
    } else  {
      bot = manager.createConversation();
    }
    bot.addMessagingListener();
    
    app.ask({
      speech: "",
      displayText: ""
    }, state);
  }
}

module.exports = (req, res) => {
  const app = new ActionsSdkApp({
    request: req,
    response: res
  });

  app.handleRequest(fulfill);
};