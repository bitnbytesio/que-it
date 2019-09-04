const fs = require('fs');
const path = require('path');
const { Job } = require('../../lib/index');

class CreateFile extends Job {
  constructor({ name, string }) {
    super();

    this.name = name;
    this.string = string;
  }

  run() {
    fs.writeFileSync(path.resolve(__dirname, this.name), this.string);
  }
}

module.exports = CreateFile;
