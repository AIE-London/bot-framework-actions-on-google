module.exports = class Instructions {

  constructor() {
    this.signInRequired = false;
    this.text = '';
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

  mergeInstructions(instructions, insertSpeechBreaks) {
    this.appendText(instructions.getInstructions().text, insertSpeechBreaks);
    this.mergeSignInRequired(instructions.getInstructions().signInRequired);
    return this;
  }

  getInstructions() {
    return {
      text: this.text,
      signInRequired: this.signInRequired
    }
  }

}