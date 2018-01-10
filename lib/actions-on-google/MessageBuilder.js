const AttachmentTypes = require("../directline/model/AttachmentTypes.json");

module.exports = class MessageBuilder {

  _handleAttachments(activity) {
    if (activity.attachments) {
      return activity.attachments.map((attachment) => {
        switch (attachment.contentType) {
          case AttachmentTypes.AudioCard:
            return this._renderAudioCard(activity, attachment);
            break;
          default: 
            return attachment;
            break;
        }
      });
    } else {
      return this._concatText(activity);
    }
  }

  _renderAudioCard(activity, attachment) {
    let text = activity.text;
    let content = attachment.content;
  }
}