/* eslint-disable class-methods-use-this */
class Job {
  constructor() {
    this.setProps({});
  }

  setProps({
    $q = 'default', $queueable = true, $fork = false, $opts = {},
  }) {
    this.$q = $q;
    this.$queueable = $queueable;
    this.$fork = $fork;
    this.$opts = $opts;
  }

  getConstructorName() {
    return this.constructor.name;
  }

  on(q) {
    this.$q = q;

    return this;
  }

  now() {
    this.$queueable = false;

    return this;
  }

  async run() {
    // abstract function
  }

  completed() {
    // job completed
  }

  error() {
    // job error
  }
}

module.exports = Job;
