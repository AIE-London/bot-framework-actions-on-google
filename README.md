# bot-framework-actions-on-google
This NPM Module adds a Microsoft Bot Framework integration to Actions on Google - turning it into an input channel.

## Quickstart

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
const bodyParser = require("body-parser");
const actionsOnGoogleAdapter = require("../");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(actionsOnGoogleAdapter(process.env.DIRECT_LINE_SECRET));

app.listen(PORT, () => console.log(`ActionsOnGoogle demo listening on port ${PORT}!`));
```

Now that this is complete. Deploy the express server to the URL you configured in the actions.json file - and your bot should be accessible through Actions on Google/Google Assistant.

## Known Issues

### Multiple Responses
 
Actions on Google doesn't play too nicely with multiple messages being sent, ideally keep your responses in one message block.
