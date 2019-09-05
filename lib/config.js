const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');
const packageJson = require('../package.json');

/**
 * drivers collection
 */
const drivers = {
  sync: {
    driver: 'sync',
  },
  bull: {
    driver: 'bull',
  },
  redis: {
    driver: 'bull',
  },
};

/**
 * config holder
 */
const config = {
  jobsFolder: null,
  driver: 'bull',
  logger: false,
};

/**
 * queues collection
 */
const queues = new Map();

function addQueue(name, options = {}) {
  if (queues.has(name)) {
    throw new Error(`Queue with name ${name} already exists.`);
  }
  queues.set(name, options);
}

/**
 * change or set jobs folder
 * @param {string} absolutePath
 */
function setJobsDir(absolutePath) {
  config.jobsFolder = absolutePath;
}

/**
 * get default logger
 * @returns {*}
 */
function defaultLogger() {
  const transport = new (winston.transports.DailyRotateFile)({
    dirname: path.join(process.cwd(), 'logs'),
    filename: `${packageJson.name}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
  });

  return winston.createLogger({
    transports: [
      transport,
    ],
  });
}

/**
 * set default logger
 * @param {*} customLogger
 */
function setLogger(customLogger) {
  config.logger = customLogger;
}

/**
 * get logger
 * @returns {*}
 */
function getLogger() {
  return config.logger || defaultLogger();
}

/**
 * get drivers
 * @param {*} name
 * @returns {*}
 */
function getDrivers(name = null) {
  if (name === null) {
    return drivers;
  }
  return drivers[name] || null;
}

/**
 * add new drivers
 * @param {*} name
 * @param {*} opts
 */
function addDrivers(name, opts) {
  drivers[name] = opts;
}

/**
 * get config attribute value
 * @param {*} name
 * @param {*} missing
 * @returns {*}
 */
function get(name, missing = null) {
  return config[name] || missing;
}

/**
 * chnage/set config
 * @param {*} name
 * @param {*} value
 */
function set(name, value) {
  config[name] = value;
}

module.exports = {
  get,
  set,
  setJobsDir,
  addDrivers,
  getDrivers,
  addQueue,
  queues,
  setLogger,
  getLogger,
  defaultLogger,
};
