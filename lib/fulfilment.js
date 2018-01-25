const ActionsSdkApp = require('actions-on-google').ActionsSdkApp;
const DirectLineManager = require("./directline/DirectLineManager");
const directLineClients = require("./directline/DirectLineClientStorage");
const outboundQueue = require("./queue/GoogleOutboundQueue");
const InstructionBuilder = require("./actions-on-google/InstructionBuilder");

const EXIT_TRIGGERS = ["bye", "exit", "quit"];
const EXIT_MESSAGE = "Ok, bye!";
let manager;
const queuedMessages = new Map();
const assistantMessage = new InstructionBuilder();

const sendMessageToBot = (app, bot, input, userId, state, user) => {
  // Add event listener for responses
  let rand = Math.random();
  let responder = event => {
    if (event.from.id !== app.getConversationId()) {
      console.log("[BOT-FRAMEWORK] Got response from bot:" + rand, event);
      outboundQueue.enqueueMessage(bot.conversationId, event, (messages) => {
        console.log("[ASKING] Sending messages: ", messages);
        const instructions = assistantMessage.constructInstructions(messages);
        assistantMessage.actOnInstructions(instructions, app, state);

        bot.removeEventListener(responder);
      });
    } else if (!app.getConversationId()) {
      console.error("No conversation ID provided, cannot send message back.");
    }
  };
  bot.addEventListener(responder);
  if (!user) {
    user = app.getUserName();
  }
  bot.sendMessage(user, input, userId);  
};

const getDirectLineClient = (state, conversationTimeout, conversationId) => {
  // Get an instance of the directline client
  let bot = directLineClients.getClient(state.directlineConversationId);
  // Check for expired conversation if timeout has been provided
  if (conversationTimeout) {
    // Get time delta from state's last interaction
    const delta = new Date() - new Date(state.lastInteraction);
    // If the delta is large enough to be >= the provided timeout
    if (delta >= conversationTimeout) {
      // End the conversation
      bot.endConversation(conversationId);
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

let continueConversation = function (input, app, state, conversationTimeout, user) {
  const conversationId = app.getConversationId();
  // If user is trying to exit.
  if (EXIT_TRIGGERS.includes(input.toLowerCase())) {
    console.log("[EXIT] User requested exit");
    app.tell(EXIT_MESSAGE);
  } else {
    // Get an instance of the directline client
    let bot = getDirectLineClient(state, conversationTimeout, conversationId);
    sendMessageToBot(app, bot, input, conversationId, state, user);
  }
};

const fulfill = (onUserSignedInHandlerProvider, conversationTimeout) => (app) => {
  let state = Object.assign({}, app.getDialogState());
  let intent = app.getIntent();

  let input = app.getRawInput();

  if (intent === app.StandardIntents.PERMISSION) {
    console.log("Executing queued message");
    queuedMessages.get(state.directlineConversationId)(app);
    return queuedMessages.delete(state.directlineConversationId);
  } else if (intent === app.StandardIntents.SIGN_IN) {
    const user = app.getUser();
    if (app.getSignInStatus() === app.SignInStatus.OK) {
      console.log('User has signed in: ', user);
      //Get id token and populate user with it
      const onUserSignedInHandler = onUserSignedInHandlerProvider.getHandler();
      onUserSignedInHandler(user).then((res) => {
        input = 'Hi';
        continueConversation(input, app, state, conversationTimeout, res);
      });
    } else {
      app.tell('You need to sign-in before using the app. Use Google assistant on the Google Home app on your phone to sign in.');
    }
  } else {
    continueConversation(input, app, state, conversationTimeout);
  }
};

module.exports = (directlineSecret, onUserSignedInHandlerProvider, conversationTimeout) => {
  manager = new DirectLineManager(directlineSecret);
  return (req, res) => {
    console.log("Inbound request to: " + req.url)
    const app = new ActionsSdkApp({
      request: req,
      response: res
    });

    app.handleRequest(fulfill(onUserSignedInHandlerProvider, conversationTimeout));
  }
};