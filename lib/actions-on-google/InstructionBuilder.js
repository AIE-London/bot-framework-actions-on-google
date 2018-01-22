const Activity = require("./model/Activity");
const Instructions = require("./model/Instructions");

module.exports = class MessageBuilder {

  constructInstructions(activities) {
    const startingInstructions = new Instructions();
    const instructions = activities.reduce((accumulatedInstructions, activity) => {
        const instructions = new Activity(activity).getGoogleActionsInstructions();
        return accumulatedInstructions.mergeInstructions(instructions, true);
      }, startingInstructions);
    return instructions.getInstructions()
  }

  actOnInstructions(instructions, app, state) {
    if (instructions.signInRequired) {
      app.askForSignIn()
    } else {
      app.ask(`<speak>${instructions.text}</speak>`, state)
    }
  }
}