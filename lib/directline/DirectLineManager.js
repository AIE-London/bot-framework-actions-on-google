global.XMLHttpRequest = require("xhr2");

const DirectLine = require("botframework-directlinejs").DirectLine;
const fetch = require("node-fetch");
const DirectLineWrapper = require("./DirectLineWrapper");

const DIRECTLINE_ENDPOINT =  "https://directline.botframework.com";

class DirectLineManager {
  constructor(directlineSecret) {
    this.getToken(directlineSecret);
  }
  createConversation() {
    console.log(this._token);
    return new DirectLineWrapper(new DirectLine({
      token: this._token,
      webSocket: true
    }));
  }
  getToken(directlineSecret) {
    return fetch(`${DIRECTLINE_ENDPOINT}/v3/directline/tokens/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${directlineSecret}`
      }
    })
      .then(response => response.json())
      .then(json => console.log(json) || json.token)
      .then(token => this._token = token);
  }
  resumeConversation(conversationId) {
    return new DirectLineWrapper(new DirectLine({
      token: this._token,
      webSocket: true,
      conversationId
    }));
  }
}

module.exports = DirectLineManager;