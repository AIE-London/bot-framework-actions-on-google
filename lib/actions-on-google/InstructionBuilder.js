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
    console.log(`User: ${JSON.stringify(app.getUser())}`);
    if (instructions.signInRequired) {
      console.log(`Asking for sign in`);
      app.askForSignIn();
    } else {
      if(instructions.shouldEndSession)
      {
        app.tell(`<speak>${instructions.text}</speak>`, state)
      }
      else
      {
        app.ask(`<speak>${instructions.text}</speak>`, state)
      }
    }
  }
}