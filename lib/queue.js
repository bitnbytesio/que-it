const Bull = require('bull');
const config = require('./config');
const packageJson = require('../package.json');
// eslint-disable-next-line import/order
const debug = require('debug')(`${packageJson.name}:queue`);

const qInstances = {};

/**
 * add job on queue
 * @param {*} job
 */
function push(job) {
  // get queue name from job
  const q = job.$q;
  debug('Adding job to queue %s.', q);
  debug('Queue config %o', config.queues.get(q));
  // if queue was not initiated
  if (!qInstances[q]) {
    debug('Creating new queue instance for', q);
    qInstances[q] = new Bull(q, config.queues.get(q) || {});
  } else {
    debug('Queue instance exists', q);
  }

  // add job in queue
  qInstances[q].add({ props: job, name: job.getConstructorName() }, job.$opts);
  debug('Job %s added on queue %s.', job.getConstructorName(), q);
}

module.exports = { push };
