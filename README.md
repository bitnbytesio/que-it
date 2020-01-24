# QUE-IT

Background job processing inspired by laravel.

[![build status][travis-image]][travis-url]
[![Coverage Status][codecov-img]][codecov-url]
[![node version][node-image]][node-url]
[![NPM version][npm-image]][npm-url]
[![David deps][david-image]][david-url]

[travis-image]: https://api.travis-ci.org/bitnbytesio/que-it.svg?branch=master
[travis-url]: https://travis-ci.org/bitnbytesio/que-it?branch=master

[codecov-img]: https://codecov.io/gh/bitnbytesio/que-it/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/bitnbytesio/que-it

[npm-image]: https://img.shields.io/npm/v/que-it.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/que-it

[node-image]: https://img.shields.io/badge/node.js-%3E=_8.16-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/

[david-image]: https://david-dm.org/bitnbytesio/que-it.svg?style=flat-square&branch=master
[david-url]: https://david-dm.org/bitnbytesio/que-it?branch=master

## USAGE

Sending contact mail example.

You need to add jobs directory in your projects package.json file.

```json
{
  ...
  "queit": {
    "jobsDir": "path/test/jobs"
  }
}
```

Then create a job class ContactMail.js in decalred directory.

**Note: File name should match the class name.**

```javascript
const { Job } = require('que-it');

class ContactMail extends Job {
  constructor({ to }) {
    this.to = to;
    /*
    bull JobOptions
    this.$opts = {
      attempts: number;

      repeat: {
        tz?: string,
        endDate?: Date | string | number
      }
    };
    */
  }

  async run() {
    // do some fun
    // SomeMailingPackage.to(this.to).send('Hi!');
  }
}

module.exports = ContactMail;
```

In your controller

```javascript
const { dispatch } = require('que-it');
const ContactMail = require('path/test/jobs');

// do some code

dispatch(new ContactMail({ to: 'user@example.com' }));
```

dispatch method will push your job on bull queue.

In order to start processing queue, you need to start worker as background process with forever/pm2 or what ever process manager you like.

Worker file example.

```javascript
const { worker, config } = require('que-it');

// add queue names used in project to worker
config.addQueue('default');

// passing options
// config.addQueue('default', {redis: {port: 6379, host: '127.0.0.1', password: 'foobared'}});

// will return the object of queues created by worker
// Single process:
const queues = worker.start();

// You can use concurrency as well:
// const queues = worker.start({ concurrency : 5 });
// and name your processor
// const queues = worker.start({ name: 'myProcessor', concurrency : 5 });

queues['default'].on('completed', () => {
  // bull queue event
});
```

Worker will create logs directory in current working directory to save job processing logs.

 Adding multiple queues

 ```javascript
 config.addQueue('default');
 config.addQueue('encoder');
 config.addQueue('mailer');
 ```

 Dispatching job on specific queue

```javascript
dispatch(new ContactMail({ to: 'user@example.com' }).on('mailer'));
```

Process job without queueing.

```javascript
const { dispatch } = require('que-it');
const ContactMail = require('path/test/jobs');

// do some code

dispatch(new ContactMail({ to: 'user@example.com' }).now());
```

## Configure

Changing default queue drivers.

```javascript
const { config } = require('que-it');
// every job will be processed immediately instead of queue in case of sync drivers
config.set('driver', 'sync');

// queueable driver
// config.set('driver', 'bull');
```

**Note: Producer, Worker and Processor each runs as seperate process, on fly config in one does not effect another, considure using file based config.**

Creating config file

```javascript
config.set('driver', 'sync');
config.setJobsDir('./app/jobs');
config.save();
```

Adding jobs from different directories

```javascript
config.addJob('PasswordReset', './modules/auth/PasswordReset.js');
```

Que-it considers job as independent module. In case of using database, you have to write a boot file for that.

Example with mongodb:

```javascript
// boot.js
// configure env variables
require('dotenv').config();
const mongoose = require('mongoose');
// db connection
mongoose.connect(process.env.MONGODB, { useNewUrlParser: true }, (err) => {
  if (err) {
    console.error(err);
  }
});
```

You need to register boot file in package.json of your project.

```json
{
  ...
  "queit": {
    "jobsDir": "path/test/jobs",
    "booter": "./boot.js"
  }
}
```

By using this boot file, you will be able to use mongoose models in you jobs. Make sure to require used models (populate models also) in job files otherwise mongoose will throw "MissingSchemaError: Schema hasn't been registered for model" this error.

For more configuration, read <a href="https://github.com/OptimalBits/bull">Bull</a> documentation.
