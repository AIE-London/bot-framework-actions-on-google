const Attachment = require('./Attachment')
const Instructions = require('./Instructions')

module.exports = class Activity {

  constructor(data) {
    this.activityData = data;
  }

  getGoogleActionsInstructions() {
    const instructions = new Instructions();
    instructions.appendText(this.activityData.text);
    if (this.activityData.attachments) {
      return this.activityData.attachments.reduce((accumulatedInstructions, attachment) => {
        const instructions = new Attachment(attachment).getGoogleActionsInstructions();
        return accumulatedInstructions.mergeInstructions(instructions, false)
      }, instructions);
    } else {
      return instructions;
    }
  }

};