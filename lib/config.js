const path = require('path');
const fs = require('fs');
const winston = require('winston');
require('winston-daily-rotate-file');
const packageJson = require('../package.json');

let projectJson;

try {
  const projectJsonFile = fs.readFileSync(path.resolve(process.cwd(), 'package.json'));

  projectJson = JSON.parse(projectJsonFile.toString());
} catch (e) {
  // ignore errors
}

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
  projectJson,
};

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

const jobsMap = {};

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
 * get in use job directory;
 * First it will look for config in local scope then attempt to find in package.json
 * fallback to que-it test cases;
 */
function getJobsDir() {
  const dir = config.jobsFolder || packageJson.queit.jobsDir;

  if (projectJson.queit && projectJson.queit.jobsDir) {
    return projectJson.queit.jobsDir;
  }

  return dir;
}

/**
 * add job
 * @param {*} name name of job class
 * @param {string} file absolute path to file that contains job class with name as declared
 */
function addJob(name, file) {
  jobsMap[name] = file;
}

function getJob(name) {
  return jobsMap[name] || false;
}

function getConfigFile() {
  return path.resolve(process.cwd(), '.queit');
}

function saveConfig(overwrite = true) {
  if (overwrite === false && fs.existsSync(getConfigFile())) {
    return;
  }
  fs.writeFileSync(getConfigFile(), JSON.stringify(config));
}

function loadConfigFile() {
  const configFile = fs.readFileSync(getConfigFile());
  const loadedConfig = JSON.parse(configFile.toString());
  Object.keys(loadedConfig).forEach((key) => {
    config[key] = loadedConfig[key];
  });
}

/**
 * get default logger
 * @returns {*} winston logging instance
 */
function defaultLogger() {
  const transport = new (winston.transports.DailyRotateFile)({
    dirname: path.join(process.cwd(), 'logs'),
    filename: `${packageJson.name}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
  });

  return winston.createLogger({
    level: get('logLevel', 'info'),
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

module.exports = {
  get,
  set,
  setJobsDir,
  getJobsDir,
  getConfigFile,
  save: saveConfig,
  saveConfig,
  load: loadConfigFile,
  loadConfigFile,
  addJob,
  getJob,
  addDrivers,
  getDrivers,
  addQueue,
  queues,
  setLogger,
  getLogger,
  defaultLogger,
};
