const { worker, config } = require('../lib/index');

describe('Worker', () => {
  describe('coverage:branch not coveger', () => {
    it('should cover branch of missing queue opts', async () => {
      config.queues.set('custom', null);
      worker.start();
    });
  });
});
