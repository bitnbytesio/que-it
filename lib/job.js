const config = require('./config');

/* eslint-disable class-methods-use-this */
class Job {
  constructor() {
    this.setInternalProps({});
  }

  /**
   * set job props
   * @param {*} props
   */
  setProps(props) {
    Object.keys(props).forEach((key) => {
      this[key] = props[key];
    });
  }

  /**
   * set internal properties
   */
  setInternalProps({
    $q = 'default', $queueable = true, $fork = false, $opts = {},
  }) {
    this.$q = `${config.get('queuePrefix')}:${$q}`;
    this.$queueable = $queueable;
    this.$fork = $fork;
    this.$opts = $opts;
  }

  /**
   * get class constructor name
   */
  getConstructorName() {
    return this.constructor.name;
  }

  /**
   * set job queue
   * @param {*} q
   */
  on(q) {
    this.$q = `${config.get('queuePrefix')}:${q}`;

    return this;
  }

  /**
   * should process instead of queue
   */
  now() {
    this.$queueable = false;

    return this;
  }

  /**
   * default method to overcome missing method error
   */
  async run() {
    // abstract function
    this.log('No task to execute.');
  }

  log(message, type = 'info') {
    if (this.logger && this.logger[type]) {
      this.logger[type](`Job#${this.$id}: ${message}`);
    }
  }

  completed() {
    // job completed
  }

  // eslint-disable-next-line no-unused-vars
  error(err) {
    // job error
  }
}

module.exports = Job;
