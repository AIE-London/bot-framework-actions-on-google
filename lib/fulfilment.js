const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;
const DirectLineManager = require("./directline/DirectLineManager");
const directLineClients = require("./directline/DirectLineClientStorage");
const outboundQueue = require("./queue/GoogleOutboundQueue");
const MessageBuilder = require("./actions-on-google/MessageBuilder");

const EXIT_TRIGGERS = ["bye", "exit", "quit"];
const EXIT_MESSAGE = "Ok, bye!";
let manager;
const queuedMessages = new Map();
const assistantMessage = new MessageBuilder();

const sendMessageToBot = (app, bot, input, userId, state, user) => {
  // Add event listener for responses
  let rand = Math.random();
  let responder = event => {
    if (event.from.id !== app.getConversationId()) {
      console.log("[BOT-FRAMEWORK] Got response from bot:" + rand, event);
      outboundQueue.enqueueMessage(bot.conversationId, event, (messages) => {
        console.log("[ASKING] Sending messages: ", messages);
        let message = assistantMessage.constructMessage(messages);

        // Ask the user.
        app.ask(message.text, state);
        bot.removeEventListener(responder);
      });
    } else if (!app.getConversationId()) {
      console.error("No conversation ID provided, cannot send message back.");
    }
  }
  bot.addEventListener(responder);
  if (!user) {
    user = app.getUserName();
  }
  bot.sendMessage(user, input, userId);  
};

const getDirectLineClient = (state, conversationTimeout) => {
  // Get an instance of the directline client
  let bot = directLineClients.getClient(state.directlineConversationId);        
  // Check for expired conversation if timeout has been provided
  if (conversationTimeout) {
    // Get time delta from state's last interaction
    const delta = new Date() - new Date(state.lastInteraction);
    // If the delta is large enough to be >= the provided timeout
    if (delta >= conversationTimeout) {
      // End the conversation
      bot.endConversation();
      // Make bot null
      bot = null;
      // Remove the directline client from the store
      directLineClients.removeClient(state.directlineConversationId);
      // Remove conversationId from the state
      delete state.directlineConversationId;
    }
  }
  if (!bot) {
    // Create a conversation
    bot = manager.createConversation();
    // Update state to contain conversation ID
    state.directlineConversationId = bot.conversationId;
    // Store in client storage
    directLineClients.storeClient(bot.conversationId, bot);
  }
  return bot;
}

const fulfill = (conversationTimeout) => (app) => {
  let state = Object.assign({}, app.getDialogState());
  let intent = app.getIntent();
   
  let input = app.getRawInput();

  if (intent === app.StandardIntents.PERMISSION) {
    console.log("Executing queued message");
    queuedMessages.get(state.directlineConversationId)(app);
    return queuedMessages.delete(state.directlineConversationId);
  }

  // If user is trying to exit.
  if (EXIT_TRIGGERS.includes(input.toLowerCase())) {
    console.log("[EXIT] User requested exit");
    app.tell(EXIT_MESSAGE);
  } else {
    // Get an instance of the directline client
    let bot = getDirectLineClient(state, conversationTimeout);

    // Get user name
    let userName = app.getUserName();
    // If we can't get the user's name....
    if (!userName) {
      const permission = app.SupportedPermissions.NAME;
      // Request permissions
      app.askForPermission('To know who you are', permission, state);
      // Add a message to the queue, to be sent on permission granted.
      queuedMessages.set(state.directlineConversationId, (newApp) => sendMessageToBot(newApp, bot, input, app.getConversationId(), state));
    } else {
      // Else - if we can - Send message to directline
      sendMessageToBot(app, bot, input, app.getConversationId(), state, userName);
    }
  }
}

module.exports = (directlineSecret, conversationTimeout) => {
  manager = new DirectLineManager(directlineSecret);
  return (req, res) => {
    console.log("Inbound request to: " + req.url)
    const app = new ActionsSdkApp({
      request: req,
      response: res
    });

    app.handleRequest(fulfill(conversationTimeout));
  }
};