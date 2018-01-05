# bot-framework-actions-on-google
This tool adds a Microsoft Bot Framework integration to Actions on Google - turning it into an input channel.

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


## Known Issues

### Multiple Responses
 
Actions on Google doesn't play too nicely with multiple messages being sent, ideally keep your responses in one message block.
