const assert = require('assert');

const { dispatch, Job } = require('../lib/index');

describe('Que-it', () => {
  describe('dispatch', () => {
    it('should throw invalid job exception', async () => {
      try {
        await dispatch({});
        throw new Error('Exception expected.');
      } catch (e) {
        assert.equal(e, 'Error: Invalid job.');
      }
    });

    it('should reject job promise', async () => {
      class TestJob extends Job {
        // eslint-disable-next-line class-methods-use-this
        run() {
          throw new Error('Error in Job.');
        }
      }
      try {
        await dispatch(new TestJob().now());
        throw new Error('Exception expected.');
      } catch (e) {
        assert.equal(e.message, 'Error in Job.');
      }
    });
  });
});
