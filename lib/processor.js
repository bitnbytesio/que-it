const path = require('path');
const fs = require('fs');

// eslint-disable-next-line import/no-dynamic-require
const packageJson = require(path.resolve(process.cwd(), 'package.json'));

const config = require('./config');

const logger = config.getLogger();

function processor(job) {
  try {
    const JOBS_FOLDER = path.resolve(packageJson.queit.jobsDir);

    // timestamp, processedOn
    const {
      id,
      data,
    } = job;

    logger.info(`Job#${id}: Jobs Directory ${JOBS_FOLDER}`);

    const queueName = data.props.$q;

    logger.info(`Job#${id}: Class Name ${data.name}`);
    logger.info(`Job#${id}: Queue Name ${queueName}`);

    const jobClassFile = path.resolve(JOBS_FOLDER, `${data.name}.js`);

    logger.info(`Job#${id}: Class Path ${jobClassFile}`);

    if (!fs.existsSync(jobClassFile)) {
      logger.info(`Job#${id}: Class file ${jobClassFile} missing.`);
      throw new Error(`Job ${data.name} file ${jobClassFile} not found.`);
    }

    logger.info(`Job#${id}: Processing ${data.name}.`);
    // eslint-disable-next-line import/no-dynamic-require,global-require
    const Job = require(jobClassFile);

    const instance = new Job(data.props);
    instance.setProps(data.props);
    const run = instance.run();
    logger.info(`Job#${id}: ${data.name}.run was initiated.`);
    if (run instanceof Promise) {
      return run;
    }

    return Promise.resolve(run);
  } catch (e) {
    logger.error(`Job#${job.id}: Errored.`);
    logger.error(e);
    throw e;
  }
}

module.exports = processor;
