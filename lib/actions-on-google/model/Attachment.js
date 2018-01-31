const AttachmentTypes = require("../../directline/model/AttachmentTypes.json");
const Instructions = require("./Instructions");

module.exports = class Activity {

  constructor(attachment) {
    switch (attachment.contentType) {
      case AttachmentTypes.AudioCard:
        this.getGoogleActionsInstructions = () => this.getAudioCardInstructions(attachment);
        break;
      case AttachmentTypes.SigninCard:
        this.getGoogleActionsInstructions = () => this.getSignInCardInstructions(attachment);
        break;
      default:
        this.getGoogleActionsInstructions = () => this.getEmptyInstructions();
        break;
    }
  }

  getEmptyInstructions() {
    return new Instructions();
  }

  getAudioCardInstructions(attachment) {
    return new Instructions().appendText(`${attachment.content.media.map(item => `<audio src="${item.url}"></audio>`).join(" ")}`);
  }

  getSignInCardInstructions() {
    return new Instructions().mergeSignInRequired(true);
  }

}