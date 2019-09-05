const path = require('path');
const fs = require('fs');

const config = require('./config');
// get logger
const logger = config.getLogger();

/**
 * job processor
 * @param {*} job
 */
function processor(job) {
  try {

    // timestamp, processedOn
    const {
      id,
      data,
    } = job;

    const queueName = data.props.$q;

    logger.info(`Job#${id}: Class Name ${data.name}`);
    logger.info(`Job#${id}: Queue Name ${queueName}`);

    let Job = config.getJob(data.name);

    if (!Job) {
      logger.info(`Job#${id}: ${data.name} not registered, searching in configured directory.`);
      // resolve jobs directory path
      const JOBS_FOLDER = path.resolve(config.getJobsDir());

      logger.info(`Job#${id}: Jobs Directory ${JOBS_FOLDER}`);

      // resolve job class file path
      const jobClassFile = path.resolve(JOBS_FOLDER, `${data.name}.js`);

      logger.info(`Job#${id}: Class Path ${jobClassFile}`);

      // if file not found or incorrect path
      if (!fs.existsSync(jobClassFile)) {
        logger.info(`Job#${id}: Class file ${jobClassFile} missing.`);
        throw new Error(`Job ${data.name} file ${jobClassFile} not found.`);
      }

      logger.info(`Job#${id}: Processing ${data.name}.`);

      // require current job file
      // eslint-disable-next-line import/no-dynamic-require,global-require
      Job = require(jobClassFile);
    }

    // create job class inatance
    const instance = new Job(data.props);
    // set props of class as dispatched
    instance.setProps(data.props);
    instance.log = logger;
    // process job
    const run = instance.run();
    logger.info(`Job#${id}: ${data.name}.run was initiated.`);

    // if process returns promise
    if (run instanceof Promise) {
      return run;
    }

    // resolve results as promise
    return Promise.resolve(run);
  } catch (e) {
    logger.error(`Job#${job.id}: Errored.`);
    logger.error(e);
    throw e;
  }
}

module.exports = processor;
