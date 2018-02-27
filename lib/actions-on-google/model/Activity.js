const Attachment = require('./Attachment')
const Instructions = require('./Instructions')

module.exports = class Activity {

  constructor(data) {
    this.activityData = data;
  }

  getGoogleActionsInstructions() {
    const instructions = new Instructions();
    instructions.appendText(this.activityData.text);

    const defaultLeaveSessionOpen = (process.env.DEFAULT_LEAVE_SESSION_OPEN) 
      ? (process.env.DEFAULT_LEAVE_SESSION_OPEN == 'true') 
      : true;

    const expectingInput = ((this.activityData.inputHint) && (this.activityData.inputHint == 'expectingInput')) ? true : false;
    const ignoringInput = ((this.activityData.inputHint) && (this.activityData.inputHint == 'ignoringInput')) ? true : false;

    let shouldLeaveSessionOpen = defaultLeaveSessionOpen;    

    if(expectingInput) {
      shouldLeaveSessionOpen = true;  
    } else if(ignoringInput) {
      shouldLeaveSessionOpen = false;
    }

    instructions.mergeShouldEndSession(!shouldLeaveSessionOpen);
    
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