module.exports = class DirectLineWrapper {
  constructor(directlineClient) {
    this._messagingCallbacks = [];

    this.client = directlineClient;
    this.client.activity$.subscribe(this._activityHandler);
  }
  _activityHandler(activity) {
    this._messagingCallbacks.map(callback => callback(activity));
  }
  addEventListener(callback) {
    this._messagingCallbacks.push(callback);
  }
  get conversationId() {
    return this.client.conversationId;
  }
  removeEventListener(callback) {
    this._messagingCallbacks.splice(this._messagingCallbacks.indexOf(callback), 1);
  }
}