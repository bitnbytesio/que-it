const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');
const packageJson = require('../package.json');

let JOBS_FOLDER = null;

const queues = new Map();

function addQueue(name, options = {}) {
  if (queues.has(name)) {
    throw new Error(`Queue with name ${name} already exists.`);
  }
  queues.set(name, options);
}

function setJobsDir(absolutePath) {
  JOBS_FOLDER = absolutePath;
}

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

let logger = false;

function setLogger(customLogger) {
  logger = customLogger;
}

function getLogger() {
  return logger || defaultLogger();
}

module.exports = {
  setJobsDir, JOBS_FOLDER, addQueue, queues, setLogger, getLogger, defaultLogger,
};
