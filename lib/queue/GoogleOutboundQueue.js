class GoogleOutboundQueue {
  constructor() {
    this._queue = new Map();
    setInterval(this.queueWorker.bind(this), process.env.QUEUE_GROUPING_TIMEOUT || 800)
  }
  queueWorker() {
    Array.from(this._queue.keys())
      .map(key => ({
        key,
        value: Object.assign({}, this._queue.get(key))
      }))
      .map((pair) => {
        let { key, value } = pair;
        if (value.count > 0 && value.count === value.messages.length) {
          let text = value.messages.map(msg => msg.text).join(".");
          console.log("Sending message back for conv id: " + key, text);
          value.messages[value.count - 1].ask(text);
          value.messages = [];
          value.count = 0;
        } else {
          // console.log(`[QUEUE] ${value.count} !== ${value.messages.length} for ${key}`);
          value.count = value.messages.length;
        }
        this._queue.set(key, value);
      })
  }
  enqueueMessage(conversationId, message, ask) {
    let entry = this._queue.get(conversationId) || {};
    entry.messages = [].concat(entry.messages || [], {
      text: message,
      ask
    });
    return this._queue.set(conversationId, entry);
  }
}
module.exports = new GoogleOutboundQueue();