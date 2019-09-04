
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const CreateFile = require('../jobs/CreateFile');
const { dispatch } = require('../../lib/index');

describe('SyncJobs', () => {
  describe('Process Now', () => {
    it('should create file with given name and data', async () => {
      const filePath = path.resolve(__dirname, '../jobs/test.log');
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        // skip catch
      }
      const job = new CreateFile({ name: 'test.log', string: 'TEST' }).now();
      await dispatch(job);
      assert.equal(fs.existsSync(filePath), true, 'File should exists.');
      // console.log(job);
      assert.equal(job.$queueable, false, 'Jos should be non queueable.');
      fs.unlinkSync(filePath);
    });
  });
});
