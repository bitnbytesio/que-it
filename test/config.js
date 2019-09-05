const assert = require('assert');
require('should');

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

  describe('Config:set', () => {
    it('should set new property', (done) => {
      config.set('custom', 'custom');
      assert.equal(config.get('custom'), 'custom');
      done();
    });
  });

  describe('Config:get', () => {
    it('should return existsing property', (done) => {
      assert.equal(config.get('driver'), 'bull');
      done();
    });

    it('should return missing property', (done) => {
      assert.equal(config.get('missing', '404'), '404');
      done();
    });

    it('should return missing null as default', (done) => {
      assert.equal(config.get('missing'), null);
      done();
    });
  });

  describe('Config:addDrivers', () => {
    it('should add new driver', (done) => {
      config.addDrivers('custom', 'custom');
      assert.equal(config.getDrivers('custom'), 'custom');
      done();
    });
  });

  describe('Config:getDrivers', () => {
    it('should return list of drivers', (done) => {
      const drivers = config.getDrivers();
      assert.equal(typeof drivers, 'object');
      drivers.should.have.keys('sync', 'redis', 'bull');
      done();
    });

    it('should return null if no driver exists', (done) => {
      const driver = config.getDrivers('kujv');
      assert.equal(driver, null);
      done();
    });
  });

  describe('Config:addJob', () => {
    it('should add new driver', (done) => {
      config.addJob('custom', 'custom');
      assert.equal(config.getJob('custom'), 'custom');
      done();
    });
  });
});
