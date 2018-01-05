const directLineClientStorage = require("../../lib/directline/DirectLineClientStorage");
const assert = require('assert');

describe('DirectLineClientStorage', () => {
  it('should return 123 when the value 123 is stored against key "test"', () => {
    directLineClientStorage.storeClient("test", 123);
    assert.equal(directLineClientStorage.getClient("test"), 123);
  });
  it('should be able to store an object against a given key', () => {
    let objectToBeStored = {
      number: new Number()
    };
    directLineClientStorage.storeClient("object-lives-here", objectToBeStored);
    assert.equal(directLineClientStorage.getClient("object-lives-here"), objectToBeStored);
  });
  it('should return undefined when no value is stored for key', () => {
    assert.equal(directLineClientStorage.getClient("should-be-undefined"));
  });
});
