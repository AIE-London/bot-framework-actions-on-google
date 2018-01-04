require("dotenv").config();
global.XMLHttpRequest = require("xhr2");

const DirectLine = require("botframework-directlinejs").DirectLine;
const fetch = require("node-fetch");

const DirectLineWrapper = require("./DirectLineWrapper");

// function sendMessage(dlObj, id, name, messageText, handleIDFunction, user) {
//   dlObj
//     .postActivity({
//       from: {
//         id: id,
//         name: name,
//         summary: user
//       },
//       type: "message",
//       text: messageText
//     })
//     .subscribe(
//       id => handleIDFunction(id),
//       error => {
//         logger.error("Error posting activity", error);
//         let fallbackMessage = process.env.FALLBACK_MESSAGE;
//         conversationMap.getSkypeConversationObject(id).then(storedData => {
//           skypeApi.sendMessage(
//             conversationMap.encodeSkypeKey(storedData.skypeConvId),
//             fallbackMessage,
//             storedData.supportedHtml
//           );
//         });
//       }
//     );
// }

// function listenToActivity(dlObj, handleMessagesFunction) {
//   dlObj.activity$.subscribe(activity => handleMessagesFunction(activity));
// }

const DIRECTLINE_ENDPOINT =  "https://directline.botframework.com";

class DirectLineManager {
  constructor(directlineSecret) {
    this.getToken(directlineSecret);
  }
  createConversation() {
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
      .then(json => json.token)
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