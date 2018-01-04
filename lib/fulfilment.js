const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;
const DirectLineManager = require("./directline/DirectLineManager");
const directLineClients = require("./directline/DirectLineClientStorage");

const EXIT_TRIGGERS = ["bye", "exit", "quit"];
const EXIT_MESSAGE = "Ok, bye!";
const manager = new DirectLineManager();
const queuedMessages = new Map();

const sendMessageToBot = (app, input) => {
  let user = app.getUserName();
  bot.sendMessage(user, input);  
};

const fulfill = (app) => {
  let state = app.getDialogState();
  let intent = app.getIntent();
   
  let input = app.getRawInput();

  if (intent === app.StandardIntents.PERMISSION) {
    return queuedMessages.get(state.directlineConversationId)(app);
  }

  // If user is trying to exit.
  if (EXIT_TRIGGERS.includes(input.toLowerCase())) {
    app.tell(EXIT_MESSAGE);
  } else {
    // Get an instance of the directline client
    let bot = directLineClients.getClient(state.directlineConversationId);
    if (!bot) {
      // Create a conversation
      bot = manager.createConversation();
      // Update state to contain conversation ID
      state.directlineConversationId = bot.conversationId;
      // Add event listener for responses
      bot.addEventListener(event => {
        app.ask({
          speech: event.text,
          displayText: event.text
        }, state);
      });
      // Store in client storage
      directLineClients.storeClient(bot.conversationId, bot);
    }
    
    // If we can't get the user's name....
    if (!app.getUserName()) {
      const permission = app.SupportedPermissions.NAME;
      // Request permissions
      app.askForPermission('To know who you are', permission);
      // Add a message to the queue, to be sent on permission granted.
      queuedMessages.set(directlineConversationId, (newApp) => sendMessageToBot(newApp, input));
    } else {
      // Else - if we can - Send message to directline
      sendMessageToBot(app, input);
    }
  }
}

module.exports = (req, res) => {
  const app = new ActionsSdkApp({
    request: req,
    response: res
  });

  app.handleRequest(fulfill);
};