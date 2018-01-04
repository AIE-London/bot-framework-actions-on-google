module.exports = class DirectLineWrapper {
  constructor(directlineClient, user) {
    this._messagingCallbacks = [];
    this._user = user;
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
  sendMessage(user, message) {
    this.client
      .postActivity({
        from: {
          id: this.conversationId,
          name: user.displayName,
          summary: user
        },
        type: "message",
        text: message
      })
  }
}