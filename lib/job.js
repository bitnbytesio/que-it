/* eslint-disable class-methods-use-this */
class Job {
  constructor() {
    this.setProps({});
  }

  /**
   * set job props
   * @param {*} props
   */
  setProps({
    $q = 'default', $queueable = true, $fork = false, $opts = {},
  }) {
    this.$q = $q;
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
    this.$q = q;

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
  }

  completed() {
    // job completed
  }

  error() {
    // job error
  }
}

module.exports = Job;
