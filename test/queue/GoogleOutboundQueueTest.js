process.env.QUEUE_GROUPING_TIMEOUT = 250;
const outboundMessageQueue = require("../../lib/queue/GoogleOutboundQueue");
const assert = require('assert');
const sinon = require('sinon');


const mockMessage = {
  text: "This is my message",
  ask: sinon.spy()
};
const mockMessage2 = {
  text: "This is my second message",
  ask: sinon.spy()
};

describe('GoogleOutboundQueue', () => {
  it('should construct an empty map', () => {
    assert(outboundMessageQueue._queue instanceof Map);
    assert.equal(Array.from(outboundMessageQueue._queue.keys()).length, 0);
    // Clear interval for test purposes
    clearInterval(outboundMessageQueue._interval);    
  });
  it('should enqueue message correctly when no other messages queued for that conversation.', () => {
    // Pre assertions.
    assert(outboundMessageQueue._queue instanceof Map);
    assert.equal(Array.from(outboundMessageQueue._queue.keys()).length, 0);

    outboundMessageQueue.enqueueMessage("TEST_CONV_ID", mockMessage, mockMessage.ask);

    // Post assertions
    assert.equal(Array.from(outboundMessageQueue._queue.keys()).length, 1);
    assert.deepEqual(outboundMessageQueue._queue.get("TEST_CONV_ID"), {
      messages: [
        mockMessage
      ]
    });
  });
  it('should enqueue subsequent messages correctly.', () => {

    // Pre assertions.
    assert(outboundMessageQueue._queue instanceof Map);
    assert.equal(Array.from(outboundMessageQueue._queue.keys()).length, 1);

    assert.deepEqual(outboundMessageQueue._queue.get("TEST_CONV_ID"), {
      messages: [
        mockMessage
      ]
    });

    outboundMessageQueue.enqueueMessage("TEST_CONV_ID", mockMessage2, mockMessage2.ask);

    // Post assertions
    assert.equal(Array.from(outboundMessageQueue._queue.keys()).length, 1);
    assert.deepEqual(outboundMessageQueue._queue.get("TEST_CONV_ID"), {
      messages: [
        mockMessage,
        mockMessage2
      ]
    });
  });

  it('should call most recent ask() once with full message.', () => {
    // Pre assertions.
    assert.equal(Array.from(outboundMessageQueue._queue.keys()).length, 1);
    assert.deepEqual(outboundMessageQueue._queue.get("TEST_CONV_ID"), {
      messages: [
        mockMessage,
        mockMessage2
      ]
    });

    // Build count();
    outboundMessageQueue.queueWorker();
    assert(mockMessage.ask.notCalled);
    assert(mockMessage2.ask.notCalled);

    // Call Ask
    outboundMessageQueue.queueWorker();

    // Post assertions
    assert(mockMessage.ask.notCalled);
    assert(mockMessage2.ask.calledOnce);
  });
});