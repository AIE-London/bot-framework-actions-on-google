module.exports = class Instructions {

  constructor() {
    this.signInRequired = false;
    this.text = '';
    this.shouldEndSession = false;
  }

  appendText(newText, requiresBreak) {
    if (this.text && requiresBreak) {
      this.text = `${this.text} <break time="2"/>. ${newText}`
    } else {
      if (this.text) {
        this.text = `${this.text} ${newText}`
      } else {
        this.text = newText
      }
    }
    return this;
  }

  mergeSignInRequired(signInRequired) {
    if (!this.signInRequired) {
      this.signInRequired = signInRequired
    }
    return this;
  }

  mergeShouldEndSession(shouldEndSession) {
    if (!this.shouldEndSession) {
      this.shouldEndSession = shouldEndSession
    }
    return this;
  }

  mergeInstructions(instructions, insertSpeechBreaks) {
    this.appendText(instructions.getInstructions().text, insertSpeechBreaks);
    this.mergeSignInRequired(instructions.getInstructions().signInRequired);
    this.mergeShouldEndSession(instructions.getInstructions().shouldEndSession);
    return this;
  }

  getInstructions() {
    return {
      text: this.text,
      signInRequired: this.signInRequired,
      shouldEndSession: this.shouldEndSession
    }
  }

}