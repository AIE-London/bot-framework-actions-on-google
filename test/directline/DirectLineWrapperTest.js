const DirectLineWrapper = require("../../lib/directline/DirectLineWrapper");
const assert = require('assert');
const sinon = require('sinon');

const mockClient = {
  conversationId: "AB123-00",
  isDirectLineClient: true,
  activity$: {
    filter: () => ({
      subscribe: () => {

      }
    })
  }
};

const mockUser = {
  id: 123912456,
  isChatbotUser: true
};

describe('DirectLineWrapper', () => {
  it('should initialise correctly, storing the client provided on construction', () => {
    let wrapper = new DirectLineWrapper(mockClient, mockUser);
    assert.equal(wrapper.client, mockClient);
    assert.equal(wrapper._user, mockUser);
    assert.deepEqual(wrapper._messagingCallbacks, []);
  });

  it('should correctly subscribe to an event', () => {
    let subscribeCompatibleMock = Object.assign({}, mockClient, {
      activity$: {
        filter: (filterFunction) => {
          assert.equal(filterFunction({
            type: "message"
          }), true)
          assert.equal(filterFunction({
            type: "conversation"
          }), false)
          return ({
            subscribe: (callback) => {
              assert.equal(callback instanceof Function, true);
            }
          })
        }
      }    
    })
    let wrapper = new DirectLineWrapper(subscribeCompatibleMock, mockUser);    
    assert.equal(mockClient.conversationId, wrapper.conversationId);
  });

  it('should call registered event listener on activity', () => {
    // Setup mocks
    let subscriptionFunction;
    let subscribeCompatibleMock = Object.assign({}, mockClient, {
      activity$: {
        filter: (filterFunction) => {
          assert.equal(filterFunction({
            type: "message"
          }), true)
          assert.equal(filterFunction({
            type: "conversation"
          }), false)
          return ({
            subscribe: (callback) => {
              assert.equal(callback instanceof Function, true);
              subscriptionFunction = callback;
            }
          })
        }
      }    
    });
    const mockActivity = {
      id: 12341,
      isActivity: true
    };
    const eventHandler = sinon.spy();
    // Construct wrapper
    let wrapper = new DirectLineWrapper(subscribeCompatibleMock, mockUser);
    // Call event registration
    wrapper.addEventListener(eventHandler);
    // Trigger activity
    subscriptionFunction(mockActivity);
    // Assert
    assert(eventHandler.calledOnce);
    assert(eventHandler.calledWith(mockActivity));
  });
  
  it('should call multiple registered event listeners on activity', () => {
    // Setup mocks
    let subscriptionFunction;
    let subscribeCompatibleMock = Object.assign({}, mockClient, {
      activity$: {
        filter: (filterFunction) => {
          assert.equal(filterFunction({
            type: "message"
          }), true)
          assert.equal(filterFunction({
            type: "conversation"
          }), false)
          return ({
            subscribe: (callback) => {
              assert.equal(callback instanceof Function, true);
              subscriptionFunction = callback;
            }
          })
        }
      }    
    });
    const mockActivity = {
      id: 12341,
      isActivity: true
    };
    const eventHandlerOne = sinon.spy();
    // Construct wrapper
    let wrapper = new DirectLineWrapper(subscribeCompatibleMock, mockUser);
    // Call event registration
    wrapper.addEventListener(eventHandlerOne);
    // Trigger activity
    subscriptionFunction(mockActivity);
    // Assert
    assert(eventHandlerOne.calledOnce);
    assert(eventHandlerOne.calledWith(mockActivity));
    
    /**
     * Second call
     */
    const eventHandlerTwo = sinon.spy();    
    // Call event registration
    wrapper.addEventListener(eventHandlerTwo);
    // Trigger activity
    subscriptionFunction(mockActivity);
    // Handler 1
    assert(eventHandlerOne.callCount, 2);
    assert(eventHandlerOne.called);
    assert(eventHandlerOne.calledWith(mockActivity));
    // Handler 2
    assert(eventHandlerTwo.calledOnce);
    assert(eventHandlerTwo.calledWith(mockActivity));
    
  });
  
  it('should return the correct conversation ID when getter is called', () => {
    let wrapper = new DirectLineWrapper(mockClient, mockUser);    
    assert.equal(mockClient.conversationId, wrapper.conversationId);
  });

  it('should be able to remove registered event listener', () => {
    // Setup mocks
    let subscriptionFunction;
    let subscribeCompatibleMock = Object.assign({}, mockClient, {
      activity$: {
        filter: (filterFunction) => {
          assert.equal(filterFunction({
            type: "message"
          }), true)
          assert.equal(filterFunction({
            type: "conversation"
          }), false)
          return ({
            subscribe: (callback) => {
              assert.equal(callback instanceof Function, true);
              subscriptionFunction = callback;
            }
          })
        }
      }    
    });
    const mockActivity = {
      id: 12341,
      isActivity: true
    };
    const eventHandler = sinon.spy();
    // Construct wrapper
    let wrapper = new DirectLineWrapper(subscribeCompatibleMock, mockUser);
    // Call event registration
    wrapper.addEventListener(eventHandler);
    // Trigger activity
    subscriptionFunction(mockActivity);
    // Remove event listener
    wrapper.removeEventListener(eventHandler);
    // Trigger activity again
    subscriptionFunction(mockActivity);            
    // Assert
    assert(eventHandler.calledOnce);
    assert(eventHandler.calledWith(mockActivity));
  });


  it('should send a well constructed event when sendMessage is called', () => {
    // Mocks
    const user = {
      displayName: "Dan Cotton"
    };
    const userId = "AA-B123-00A";
    const message = "This is a test message";
    const activityMock = {
      from: {
        id: userId,
        name: user.displayName,
        summary: user
      },
      type: "message",
      text: message
    };
    const postActivityMockClient = Object.assign({}, mockClient, {
      postActivity: () => ({
        subscribe: () => {}
      })
    });
    let spy = sinon.spy(postActivityMockClient, "postActivity");
    // Construct Wrapper, perform send message
    let wrapper = new DirectLineWrapper(postActivityMockClient, mockUser);
    wrapper.sendMessage(user, message, userId);
    assert(spy.calledOnce);
    assert(spy.calledWith(activityMock));
  });

});
