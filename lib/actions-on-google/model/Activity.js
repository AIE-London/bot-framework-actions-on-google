const Attachment = require('./Attachment')
const Instructions = require('./Instructions')

module.exports = class Activity {

  constructor(data) {
    this.activityData = data;
  }

  getGoogleActionsInstructions() {
    const instructions = new Instructions();
    instructions.appendText(this.activityData.text);

    const leaveSessionOpen = (process.env.DEFAULT_LEAVE_SESSION_OPEN) ? (process.env.DEFAULT_LEAVE_SESSION_OPEN == 'true') : false;
    instructions.mergeShouldEndSession(((this.activityData.inputHint) && (this.activityData.inputHint == 'expectingInput')) ? false : !leaveSessionOpen);
    
    if (this.activityData.attachments && this.activityData.attachments.length > 0) {
      return this.activityData.attachments.reduce((accumulatedInstructions, attachment) => {
        const instructions = new Attachment(attachment).getGoogleActionsInstructions();
        return accumulatedInstructions.mergeInstructions(instructions, false)
      }, instructions);
    } else {
      return instructions;
    }
  }

};