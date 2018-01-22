const MessageBuilder = require("../../lib/actions-on-google/MessageBuilder");
const assert = require('assert');

const instance = new MessageBuilder();

xdescribe('MessageBuilder', () => {

  it('should concat activities consisting of purely plain text', () => {
    const PLAIN_TEXT =  [
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
    let processed = instance.constructMessage(PLAIN_TEXT);
    assert.equal(processed.text, `<speak>${PLAIN_TEXT[0].text} <break time="2"/>. ${PLAIN_TEXT[1].text} <break time="2"/>. ${PLAIN_TEXT[2].text}</speak>`);
  });
  
  it('should concat activities consisting of single audio cards', () => {
    const AUDIO_CARD_ACTIVITIES =  [
      {
        text: "This is a test...",
        attachments: [{
          data: {
            contentType: "application/vnd.microsoft.card.audio",
            content: {
              media: [{
                url: "http://test.audio-source.com/audio.mp3"
              }]
            }
          }
        }]
      },
      {
        text: "Of some text."
      },
      {
        text: "Being concatenated.",
        attachments: [{
          data: {
            contentType: "application/vnd.microsoft.card.audio",
            content: {
              media: [{
                url: "http://test.audio-source.com/audio-2.mp3"
              }]
            }
          }
        }]
      }
    ];
    let processed = instance.constructMessage(AUDIO_CARD_ACTIVITIES);
    assert.equal(processed.text, `<speak>${AUDIO_CARD_ACTIVITIES[0].text} <audio src="http://test.audio-source.com/audio.mp3"></audio>  <break time="2"/>. ${AUDIO_CARD_ACTIVITIES[1].text} <break time="2"/>. ${AUDIO_CARD_ACTIVITIES[2].text} <audio src="http://test.audio-source.com/audio-2.mp3"></audio> </speak>`);
  });

});