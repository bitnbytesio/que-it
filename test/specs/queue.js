
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Redis = require('ioredis');
const uuid = require('uuid');
const CreateFile = require('../jobs/CreateFile');
const { dispatch, config, worker } = require('../../lib/index');

describe('QueueJobs', () => {
  let client;

  beforeEach(() => {
    client = new Redis();
    return client.flushdb();
  });

  describe('Single Queue', () => {
    it('should create file with given name and data', (done) => {
      const filePath = path.resolve(__dirname, '../jobs/queueTest.log');
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        // skip catch
      }

      const queueName = `test-${uuid()}`;

      const job = new CreateFile({ name: 'queueTest.log', string: 'Queued' }).on(queueName);

      dispatch(job).then(() => {
        config.addQueue(queueName);
        config.setJobsDir(path.resolve(__dirname, '../jobs'));

        const queues = worker.start();

        queues[queueName].on('completed', () => {
          assert.equal(fs.existsSync(filePath), true, 'File should exists.');
          // console.log(job);
          assert.equal(job.$queueable, true, 'Jos should be queueable.');
          fs.unlinkSync(filePath);
          done();
        });
      });
    });
  });
});
