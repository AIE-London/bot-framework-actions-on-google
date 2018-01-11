const AttachmentTypes = require("../directline/model/AttachmentTypes.json");

module.exports = class MessageBuilder {

  constructor() {
    this._handleAttachments = this._handleAttachments.bind(this);
  }

  constructMessage(activities) {
    let message = this._handleActivities(activities);
    message.text = `<speak>${message.text}</speak>`;
    return message;
  }

  _handleAttachments(activity) {
    if (activity.attachments) {
      let cards = activity.attachments
        .map(attachment => {
          return attachment.data;
        })
        .map((attachment) => {
          switch (attachment.contentType) {
            case AttachmentTypes.AudioCard:
              return this._renderAudioCard(activity, attachment);
              break;
            default: 
              return attachment;
              break;
          };
        });
      return Object.assign({}, activity, {
        cards
      });
    } else {
      return activity;
    }
  }

  _handleActivities(activities) {
    let cardText = activity => activity.cards ? activity.cards.map(card => card.resolvedText).join("  ") : "";
    return Object.assign({}, activities.reduce(this._flattenActivities), {
      text: activities
        .map(this._handleAttachments)
        .map(activity => activity.text + cardText(activity))
        .join(" <break time=\"2\"/>. ")
    });
  }

  _flattenActivities(result, activity) {
    return Object.assign({}, result, {
      cards: [].concat(result.cards, activity.cards)
    });
  }

  _renderAudioCard(activity, attachment) {
    let text = activity.text;
    let content = attachment.content;
    return Object.assign({}, attachment, {
      resolvedText: ` ${content.media.map(item => `<audio src="${item.url}"></audio>`).join(" ")} `
    });
  }
}