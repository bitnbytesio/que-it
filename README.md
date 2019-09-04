# QUE-IT

Background job processing inspired by laravel.

[![build status][travis-image]][travis-url]
[![Coverage Status][codecov-img]][codecov-url]
[![node version][node-image]][node-url]
[![NPM version][npm-image]][npm-url]

[travis-image]: https://api.travis-ci.org/bitnbytesio/que-it.svg?branch=master
[travis-url]: https://travis-ci.org/bitnbytesio/que-it?branch=master

[codecov-img]: https://codecov.io/gh/bitnbytesio/que-it/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/bitnbytesio/que-it

[npm-image]: https://img.shields.io/npm/v/que-it.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/que-it

[node-image]: https://img.shields.io/badge/node.js-%3E=_8.16-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/

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

// will return the object of queues created by worker
const queues = worker.start();

queues['default'].on('completed', () => {
  // bull queue event
});
```

 Adding multiple queues

 ```javascript
 config.addQueue('default');
 config.addQueue('encoder');
 config.addQueue('mailer');
 ```

Process job without queueing.

```javascript
const { dispatch } = require('que-it');
const ContactMail = require('path/test/jobs');

// do some code

dispatch(new ContactMail({ to: 'user@example.com' }).now());
```

Worker will create logs directory in current working directory to save job processing logs.
