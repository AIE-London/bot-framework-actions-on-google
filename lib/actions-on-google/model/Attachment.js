const AttachmentTypes = require("../../directline/model/AttachmentTypes.json");
const Instructions = require("./Instructions");

module.exports = class Activity {

  constructor(attachment) {
    switch (attachment.contentType) {
      case AttachmentTypes.AudioCard:
        this.getGoogleActionsInstructions = () => {
          return this._renderAudioCard(attachment);
        }
        break;
      case AttachmentTypes.SigninCard:
        this.getGoogleActionsInstructions = () => this._renderSigninCard(attachment);
        break;
      default:
        this.getGoogleActionsInstructions = () => {};
        break;
    }
  }

  _renderAudioCard(attachment) {
    return new Instructions().appendText(`${attachment.content.media.map(item => `<audio src="${item.url}"></audio>`).join(" ")}`);
  }

  _renderSigninCard() {
    return new Instructions().mergeSignInRequired(true);
  }

}