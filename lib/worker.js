const path = require('path');
const Bull = require('bull');
const packageJson = require('../package.json');
// eslint-disable-next-line import/order
const debug = require('debug')(`${packageJson.name}:worker`);
const config = require('./config');

// try loading config
try {
  config.loadConfigFile();
} catch (e) {
  // skip error
}

const qInstances = {};

/**
 * start worker to process jobs
 */
function start({ name, concurrency } = {}) {
  const args = [path.resolve(__dirname, './processor.js')];

  if (concurrency) {
    args.unshift(concurrency);
  }

  if (name) {
    args.unshift(name);
  }

  Array.from(config.queues.keys()).forEach((q) => {
    /* istanbul ignore next */
    if (qInstances[q]) {
      debug('Processor already attached to queue %s.', q);
      return;
    }

    debug('Attaching processor to queue %s.', q);
    qInstances[q] = new Bull(q, config.queues.get(q) || {});
    qInstances[q].process(...args);
    debug('Processor attached to queue %s.', q);
  });

  return qInstances;
}

module.exports = { start, queues: qInstances };
