# bot-framework-actions-on-google


This NPM Module adds a Microsoft Bot Framework integration to Actions on Google - turning it into an input channel.

[![CircleCI](https://circleci.com/gh/Capgemini-AIE/bot-framework-actions-on-google.svg?style=svg&circle-token=9cc914f06f298c6d0bed0886b943f177b89ad883)](https://circleci.com/gh/Capgemini-AIE/bot-framework-actions-on-google)

## Quickstart

If you know how to create an Actions on Google project with the Actions SDK. Follow the usual process of creating and populating an actions.json file.

This module then acts as a replacement for your fulfilment, simply use the module to construct an express router to be used as the fulfilment URL. You will need to provide a directline secret.

```javascript
const actionsOnGoogleAdapter = require("bot-framework-actions-on-google");
const express = require("express");

const app = express();

// Construct and use router.
app.use(actionsOnGoogleAdapter(<DIRECT_LINE_SECRET>));
```

## Full Guide

### Setting up actions.json
```json
{
	"actions": [{
		"description": "<description-here>",
		"name": "MAIN",
		"fulfillment": {
			"conversationName": "MAIN_CONVERSATION"
		},
		"intent": {
			"name": "actions.intent.MAIN",
			"trigger": {
				"queryPatterns": ["talk to <name-of-your-voice-bot>"]
			}
		}
	}],
	"conversations": {
		"MAIN_CONVERSATION": {
			"name": "MAIN_CONVERSATION",
			"url": "<url-to-your-deployed-bot>"
		}
	}
}
```

### Providing Google with your actions.json file

Now that you've got an actions.json file - you need to update Google on the configuration of your action.

`gactions update --action_package actions.json --project <actions-on-google-project-id>`

### Using the module

#### Router

This module exposes a single function, which returns an object which has an Express Router and a way to register a handler for when a user links their account.

`actionsOnGoogleAdapter(<DIRECT_LINE_SECRET>);`

Simply require() the module, and pass it your Microsoft Bot Framework Directline secret. 

Then pass the resulting router to ExpressJS's `app.use()` middleware registration function.

```javascript
//=========================================================
// Import NPM modules
//=========================================================
const express = require("express");
const actionsOnGoogleAdapter = require("bot-framework-actions-on-google");

const app = express();

app.use(actionsOnGoogleAdapter(<DIRECT_LINE_SECRET>).router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ActionsOnGoogle demo listening on port ${PORT}!`));
```

Now that this is complete. Deploy the express server to the URL you configured in the actions.json file - and your bot should be accessible through Actions on Google/Google Assistant.

#### Sign In Handler

Use the sign in handler to get any additional information about your user or anything else once you have an access token.

The access token is available on the user object passed into the handler.

```javascript
actionsOnGoogleAdapter.onUserSignedInHandlerProvider.registerHandler((user) => {
  // Get additional user details from your API once account is linked and access token is available
  return fetch('https://your-api/user/' + user.userId, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`
      }
    }).then(res => res.json())
    .then(res => ({...res, ...user}))
});
```

## Features

### Controlling the session (should we wait for another message from the user?)

By default this bridge will leave the session open after returning a response to Google and will expect further input from the user, which will allow them to continue their conversation with your action. If you wish to end the session by default following each message, there an environment setting 'DEFAULT_LEAVE_SESSION_OPEN' which you can set to "false" to achieve this.

This bridge also supports InputHint properties on Bot Framework activities when using the SayAsync method (as opposed to PostAsync), which determine if the bot should wait for further input from the user in a voice scenario. 

The bridge looks for an inputHint on the incoming activity from the bot, specifically looking for either the 'ExpectingInput' hint, which will cause the bridge to leave the conversation open, or 'IgnoringInput', which will end the conversation.  So, for example, if you have sessions being left open by default you could use the 'IgnoringInput' InputHint to end the session. Conversely, if you end the session by default, you can send the 'ExpectingInput' InputHint on your bot activity to indicate that we should wait for the user to say something else.

Below is an example of using the above InputHint features in a C# bot. In this example we send a message from the bot to the bridge and also indicate that we are expecting a further message from the user.

```cs
var messageText = "Thanks! Can I help you with something else?";
var messageOptions = new MessageOptions
            {
                InputHint = InputHints.ExpectingInput
            };
await context.SayAsync(messageText, speakText, options: messageOptions);
```

### Audio Cards

This bridge supports Microsoft Bot Framework Audio Cards:
(https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.audiocard.html)

It will simply concatenate the audio file onto the text provided in the response.


### Sign In Cards

This bridge supports Microsoft Bot Framework Signin Cards:
(https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.signincard.html)

If a sign in card is sent back, other cards are ignored and the user will be asked to sign in.

## Known Issues

### Multiple Responses
 
Actions on Google doesn't play too nicely with multiple messages being sent, ideally keep your responses in one message block.
