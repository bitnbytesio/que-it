const assert = require('assert');

const { config } = require('../lib/index');

describe('Config', () => {
  describe('Config:addQueue', () => {
    it('should add to map', (done) => {
      config.addQueue('test');
      assert.equal(config.queues.has('test'), true);
      done();
    });

    it('should throw exception for duplicates', (done) => {
      try {
        config.addQueue('test');
        throw new Error('Exception expected.');
      } catch (e) {
        assert.equal(e, 'Error: Queue with name test already exists.');
      }
      done();
    });
  });
  describe('Config:logger', () => {
    it('should add new logger', (done) => {
      config.setLogger('CustomLogger');
      assert.equal(config.getLogger(), 'CustomLogger');
      config.setLogger(config.defaultLogger());
      done();
    });
  });
});
