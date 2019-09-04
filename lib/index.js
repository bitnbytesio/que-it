const Job = require('./job');
const q = require('./queue');
const config = require('./config');
const packageJson = require('../package.json');

// eslint-disable-next-line import/order
const debug = require('debug')(packageJson.name);

exports.dispatch = async function dispatch(j) {
  if (!(j instanceof Job)) {
    throw new Error('Invalid job.');
  }

  debug('Dispatching job %s.', j.getConstructorName());

  if (j.$queueable === false) {
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
  return q.push(j);
};

exports.Job = Job;
exports.config = config;
