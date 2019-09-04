const Bull = require('bull');
const config = require('./config');
const packageJson = require('../package.json');
// eslint-disable-next-line import/order
const debug = require('debug')(`${packageJson.name}:queue`);

const qInstances = {};

function push(job) {
  const q = job.$q;
  if (!qInstances[q]) {
    qInstances[q] = new Bull(q, config.queues.get(q) || {});
  }
  qInstances[q].add({ props: job, name: job.getConstructorName() }, job.$opts);
  debug('Job %s added on queue %s.', job.getConstructorName(), q);
}

module.exports = { push };
