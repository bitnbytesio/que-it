const Job = require('./job');
const q = require('./queue');
const config = require('./config');
const worker = require('./worker');
const packageJson = require('../package.json');

// eslint-disable-next-line import/order
const debug = require('debug')(packageJson.name);

/**
 * dispatch job
 */
exports.dispatch = async function dispatch(j) {
  // job must be instanse of Job class
  if (!(j instanceof Job)) {
    throw new Error('Invalid job.');
  }

  debug('Dispatching job %s.', j.getConstructorName());

  // if job is not queueable or drivers missin gor set to sync
  if (j.$queueable === false || config.get('driver', 'sync') === 'sync') {
    // process job
    debug('Processing non-queueable job %s.', j.getConstructorName());
    return new Promise((resolve, reject) => {
      // process job in next evn loop
      setImmediate(async () => {
        try {
          // temp, later this will be in seperate process
          await j.run();
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  }
  debug('Adding job %s on queue.', j.getConstructorName());
  // add job on queue
  return q.push(j);
};

exports.Job = Job;
exports.config = config;
exports.worker = worker;
