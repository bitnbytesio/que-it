const path = require('path');
const fs = require('fs');

const config = require('./config');
// get logger
const logger = config.getLogger();

// try loading config
try {
  logger.info('Loading config.');
  config.loadConfigFile();
  logger.info('Loaded.');
} catch (e) {
  // skip error
  logger.info('Config loading errored.');
}

try {
  const projectJson = config.get('projectJson');
  if (projectJson && projectJson.queit && projectJson.queit.booter) {
    logger.info('Loading booter.');
    const booterMod = path.resolve(projectJson.queit.booter);
    logger.info(`Booter ${projectJson.queit.booter} resooved to ${booterMod}`);
    const booter = require.resolve(booterMod);
    logger.info(booter);
    // eslint-disable-next-line import/no-dynamic-require,global-require
    require(booter);
    logger.info('Booted.');
  }
} catch (e) {
  // skip error
  logger.info('Booting failed.');
  logger.error(e);
}

/**
 * job processor
 * @param {*} job
 */
async function processor(job) {
  // job instance
  let jobInstance = null;
  try {
    // timestamp, processedOn
    const {
      id,
      data,
    } = job;

    const queueName = data.props.$q;

    logger.info(`Job#${id}: Class Name ${data.name}`);
    logger.info(`Job#${id}: Queue Name ${queueName}`);

    let jobClassFile = config.getJob(data.name);

    if (!jobClassFile) {
      logger.info(`Job#${id}: ${data.name} not registered, searching in configured directory.`);
      // resolve jobs directory path
      const JOBS_FOLDER = path.resolve(config.getJobsDir());

      logger.info(`Job#${id}: Jobs Directory ${JOBS_FOLDER}`);

      // resolve job class file path
      jobClassFile = path.resolve(JOBS_FOLDER, `${data.name}.js`);

      logger.info(`Job#${id}: Class Path ${jobClassFile}`);

      // if file not found or incorrect path
      if (!fs.existsSync(jobClassFile)) {
        logger.info(`Job#${id}: Class file ${jobClassFile} missing.`);
        throw new Error(`Job ${data.name} file ${jobClassFile} not found.`);
      }

      logger.info(`Job#${id}: Processing ${data.name}.`);
    }

    // require current job file
    // eslint-disable-next-line import/no-dynamic-require,global-require
    const Job = require(jobClassFile);

    // create job class inatance
    const instance = new Job(data.props);
    jobInstance = instance;
    // set props of class as dispatched
    instance.setProps(data.props);
    instance.setInternalProps(data.props);
    instance.logger = logger;
    // process job
    const run = instance.run();
    logger.info(`Job#${id}: ${data.name}.run was initiated.`);

    // if process returns promise
    if (run instanceof Promise) {
      logger.info(`Job#${id}: ${data.name}.run returns promise.`);
      return await run;
    }
    logger.info(`Job#${id}: ${data.name}.run output resolved to promise.`);
    // resolve results as promise
    return run;
  } catch (e) {
    logger.error(`Job#${job.id}: Errored.`);
    logger.error(e);
    if (jobInstance) {
      jobInstance.error(e);
    }
    throw e;
  }
}

module.exports = processor;
