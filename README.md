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

This module exposes a single function, which is an Express Router factory.

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

app.use(actionsOnGoogleAdapter(<DIRECT_LINE_SECRET>));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ActionsOnGoogle demo listening on port ${PORT}!`));
```

Now that this is complete. Deploy the express server to the URL you configured in the actions.json file - and your bot should be accessible through Actions on Google/Google Assistant.

## Features

### Audio Cards

This bridge supports Microsoft Bot Framework Audio Cards:
(https://docs.botframework.com/en-us/node/builder/chat-reference/classes/_botbuilder_d_.audiocard.html)

## Known Issues

### Multiple Responses
 
Actions on Google doesn't play too nicely with multiple messages being sent, ideally keep your responses in one message block.
