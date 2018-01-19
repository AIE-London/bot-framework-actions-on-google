class DirectLineClientStorage {
  constructor() {
    this._clients = new Map();
  }
  getClient(conversationId) {
    return this._clients.get(conversationId);
  }
  storeClient(conversationId, directLineWrapper) {
    return this._clients.set(conversationId, directLineWrapper);
  }
  removeClient(conversationId) {
    return this._clients.delete(conversationId);
  }
}
module.exports = new DirectLineClientStorage();