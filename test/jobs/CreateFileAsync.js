const fs = require('fs');
const path = require('path');
const { Job } = require('../../lib/index');

class CreateFileAsync extends Job {
  constructor({ name, string }) {
    super();

    this.name = name;
    this.string = string;
  }

  async run() {
    fs.writeFileSync(path.resolve(__dirname, this.name), this.string);
  }
}

module.exports = CreateFileAsync;
