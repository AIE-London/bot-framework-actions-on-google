const AttachmentTypes = require("../directline/model/AttachmentTypes.json");

module.exports = class MessageBuilder {

  constructor() {
    this._handleAttachments = this._handleAttachments.bind(this);
  }

  actOnMessages(activities, app, state) {
    let message = this._handleActivities(activities, app);
    console.log('Message constructed from activities', message);
    if (message.signInRequired) {
      console.log('Signin required');
      app.askForSignIn();
    } else {
      message.text = `<speak>${message.text}</speak>`;
      // Ask the user.
      app.ask(message.text, state);
    }
  }

  _handleActivities(activities) {
    console.log(`Handling activities ${JSON.stringify(activities)}`);
    let cardText = activity => activity.cards ? activity.cards.map(card => card.resolvedText).join("  ") : "";

    return Object.assign({}, activities.reduce(this._flattenActivityCards), {
      text: activities
      .map(this._handleAttachments)
      .map(activity => activity.text + cardText(activity))
      .join(" <break time=\"2\"/>. ")
    });
  }

  _flattenActivityCards(result, activity) {
    return Object.assign({}, result, {
      cards: [].concat(result.cards, activity.cards)
    });
  }

  _handleAttachments(activity) {
    if (activity.attachments) {
      let cards = activity.attachments
        .map(attachment => {
          return attachment.data || attachment;
        })
        .map((attachmentData) => {
          switch (attachmentData.contentType) {
            case AttachmentTypes.AudioCard:
              return this._renderAudioCard(activity, attachmentData);
              break;
            case AttachmentTypes.SigninCard:
              return this._renderSigninCard(attachmentData);
              break;
            default: 
              return attachmentData;
              break;
          }
        });
      return Object.assign({}, activity, {
        cards
      });
    } else {
      return activity;
    }
  }

  _renderAudioCard(activity, attachment) {
    let text = activity.text;
    let content = attachment.content;
    return Object.assign({}, attachment, {
      resolvedText: ` ${content.media.map(item => `<audio src="${item.url}"></audio>`).join(" ")} `
    });
  }

  _renderSigninCard(attachment) {
    return Object.assign({}, attachment, {
      signInRequired: true
    });
  }
}