const InstructionBuilder = require("../../lib/actions-on-google/InstructionBuilder");
const assert = require('assert');

const instance = new InstructionBuilder();

describe('MessageBuilder', () => {

  it('should concat activities consisting of purely plain text', () => {
    const PLAIN_TEXT = [
      {
        text: "This is a test..."
      },
      {
        text: "Of some text."
      },
      {
        text: "Being concatenated."
      }
    ];
    let processed = instance.constructInstructions(PLAIN_TEXT);
    assert.equal(processed.text, `${PLAIN_TEXT[0].text} <break time="2"/>. ${PLAIN_TEXT[1].text} <break time="2"/>. ${PLAIN_TEXT[2].text}`);
  });

  it('should concat activities consisting of single audio cards', () => {
    const AUDIO_CARD_ACTIVITIES = [
      {
        text: "This is a test...",
        attachments: [{
          contentType: "application/vnd.microsoft.card.audio",
          content: {
            media: [{
              url: "http://test.audio-source.com/audio.mp3"
            }]
          }
        }]
      },
      {
        text: "Of some text."
      },
      {
        text: "Being concatenated.",
        attachments: [{
          contentType: "application/vnd.microsoft.card.audio",
          content: {
            media: [{
              url: "http://test.audio-source.com/audio-2.mp3"
            }]
          }
        }]
      }
    ];
    let processed = instance.constructInstructions(AUDIO_CARD_ACTIVITIES);
    assert.equal(processed.text, `${AUDIO_CARD_ACTIVITIES[0].text} <audio src="http://test.audio-source.com/audio.mp3"></audio> <break time="2"/>. ${AUDIO_CARD_ACTIVITIES[1].text} <break time="2"/>. ${AUDIO_CARD_ACTIVITIES[2].text} <audio src="http://test.audio-source.com/audio-2.mp3"></audio>`);
  });

  it('should concat activities consisting of single audio cards', () => {
    const AUDIO_CARD_ACTIVITIES = [
      {
        attachments: [{
          contentType: "application/vnd.microsoft.card.signin",
          content: {
            text: "BotFramework Sign-in Card",
            buttons: [{
              type: "signin",
              title: "Sign-in",
              value: "http://esurelogin-hosting-mobilehub-769067525.s3-website.eu-west-2.amazonaws.com/"
            }]
          }
        }],
      }
    ];
    let processed = instance.constructInstructions(AUDIO_CARD_ACTIVITIES);
    assert.equal(processed.signInRequired, true);
  });

});