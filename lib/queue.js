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
  // if queue was not initiated
  if (!qInstances[q]) {
    qInstances[q] = new Bull(q, config.queues.get(q) || {});
  }
  // add job in queue
  qInstances[q].add({ props: job, name: job.getConstructorName() }, job.$opts);
  debug('Job %s added on queue %s.', job.getConstructorName(), q);
}

module.exports = { push };
