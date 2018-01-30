global.XMLHttpRequest = require("xhr2");

const { DirectLine, ConnectionStatus } = require("botframework-directlinejs");
const fetch = require("node-fetch");
const DirectLineWrapper = require("./DirectLineWrapper");

const DIRECTLINE_ENDPOINT =  "https://directline.botframework.com";

class DirectLineManager {
  constructor(directlineSecret) {
    this._secret = directlineSecret;
  }
  createConversation() {
    return this.getToken(this._secret)
      .then(token => new Promise((resolve, reject) => {
        console.log("New client with given token: ");
        let wrapper = new DirectLineWrapper(new DirectLine({
          token: token,
          webSocket: true
        }));
        wrapper.client.connectionStatus$
        .subscribe(connectionStatus => {
            switch(connectionStatus) {
                case ConnectionStatus.Online:
                  console.log("Client ONLINE. ");
                  resolve(wrapper);
                  break;
                default:
                  console.log("Conn Status: " + connectionStatus + "" + ConnectionStatus[connectionStatus]);
                  break;
            }
        });
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
  }
}

module.exports = DirectLineManager;