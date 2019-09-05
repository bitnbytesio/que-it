const assert = require('assert');
const path = require('path');
const fs = require('fs');

const processor = require('../lib/processor');

// eslint-disable-next-line import/no-dynamic-require
const packageJson = require(path.resolve(process.cwd(), 'package.json'));

describe('Processor', () => {
  it('should throw job file missin gexception', (done) => {
    try {
      processor({ id: 1, data: { name: 'MissingJob', props: { $q: 'default' } } });
      throw new Error('Exception expected.');
    } catch (e) {
      const JOBS_FOLDER = path.resolve(packageJson.queit.jobsDir);
      const jobClassFile = path.resolve(JOBS_FOLDER, 'MissingJob.js');
      assert.equal(e, `Error: Job MissingJob file ${jobClassFile} not found.`);
    }
    done();
  });

  it('should returns promise resolver', async () => {
    const filePath = path.resolve(__dirname, './jobs/asyncFile.log');
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      // skip catch
    }
    const returns = processor({
      id: 420,
      data: {
        name: 'CreateFileAsync',
        props: { $q: 'default', name: 'asyncFile.log', string: 'asyncFile' },
      },
    });
    if (!(returns instanceof Promise)) {
      throw new Error('Promise was expected.');
    }

    await returns;
    assert.equal(fs.existsSync(filePath), true, 'File should exists.');
    fs.unlinkSync(filePath);
  });
});
