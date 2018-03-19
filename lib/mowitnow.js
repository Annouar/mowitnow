const fs = require('fs');
const Land = require('./land');
const parseInstructions = require('./parser');


class MowItNowWorker {
  constructor(logger = null) {
    this.log = logger;

    this.queues = [];
    this.land = {};
    this.history = [];
  }

  /**
   * Display a debug if a logger has been injected
   * @param {*} toDebug Something to debug
   */
  debug(toDebug = '\n') {
    if (this.log) {
      this.log.debug(toDebug);
    }
  }

  /**
   * Init MowItNowWorker from a string
   * @param {string} text The string containing the instructions
   * @returns current instance
   */
  fromText(text) {
    const mowItNow = parseInstructions(text);

    const mowers = mowItNow.mowersDefinition.map(definition => definition.mower);
    this.queues = mowItNow.mowersDefinition.map(definition => definition.mowerTransactions);

    const { width, height } = mowItNow.landSize;
    this.land = new Land(height, width, mowers);

    return this;
  }

  /**
   * Init MowItNowWorker from an array
   * @param {array} mowItNowArray an array containing all instructions lines
   * @returns current instance
   */
  fromArray(mowItNowArray) {
    const isValidArray = mowItNowArray
                         && mowItNowArray instanceof Array
                         && mowItNowArray.length >= 3;

    if (!isValidArray) {
      throw Error(`Bad mowItNow Array in parameter : ${mowItNowArray}`);
    }
    return this.fromText(mowItNowArray.join('\n'));
  }

  /**
   * Init MowItNowWorker from a file and invoke the callback in parameter
   * @param {string} path instructions file path
   * @param {function} callback function to invoke once done
   * @param {string} encoding the encoding file
   */
  fromFileAsync(path, callback, encoding = 'utf-8') {
    fs.readFile(path, encoding, (err, instructions) => {
      if (err) {
        throw err;
      }
      return this.fromText(instructions);
    });
  }

  /**
   * Init MowItNowWorker from a file
   * @param {*} path instructions file path
   * @param {*} encoding the encoding file
   * @returns the current instance
   */
  fromFileSync(path, encoding = 'utf-8') {
    const instructions = fs.readFileSync(path, encoding);

    return this.fromText(instructions);
  }

  /**
   * Return an object describing the current mowers state
   * @returns an array of object
   */
  getMowers() {
    return this.land.mowers.map(mower => mower.getCurrentState());
  }

  /**
   * Resolve the mowers puzzle by moving mowers by iterations. If all mowers
   * that are still running are all blocked, it's a deadlock case.
   * @throws Error if all mowers that still running are blocked by another one
   * @returns the current instance
   */
  resolve() {
    if (this.queues.length === 0) {
      throw Error('No instructions found. Did you use init helpers functions ?');
    }

    let allQueuesEmpty;
    do {
      allQueuesEmpty = this.queues.reduce((isQueuesEmpty, queue) => {
        const isCurrentQueueEmpty = queue.length === 0;

        if (!isCurrentQueueEmpty) {
          const currentTransaction = queue.shift();
          this.debug(`Transaction: ${currentTransaction}`);

          // Execute order
          currentTransaction.run();
          this.debug(`results on ${currentTransaction.mower}`);

          // If the mower is blocked by another one, put the move on top on queue
          // It will be treated as soon as the other mowers moves
          if (currentTransaction.mower.isBlocked()) {
            queue.unshift(currentTransaction);
          }

          // If no more transaction in queue, mower has reached final position
          if (queue.length === 0) {
            currentTransaction.mower.end();
          }

          this.land.generateNewMap(); // each new run with observer ?
        }
        return isQueuesEmpty && isCurrentQueueEmpty;
      }, true);

      // If mowers all mowers still running are blocked, deadlock
      const blockedMowers = this.land.mowers.filter(mower => mower.isBlocked());
      const finishedMowers = this.land.mowers.filter(mower => mower.hasFinished());
      const isDeadLockCase = blockedMowers.length === (this.land.mowers.length - finishedMowers);
      this.debug(`Mowers blocked: ${blockedMowers}`);
      if (isDeadLockCase) {
        throw Error('All mowers still running are blocked by each other. Deadlock case !');
      }

      this.debug(this.land.toString());
    } while (!allQueuesEmpty);
    this.debug(this.land.mowers.map(mower => mower).join('\n'));

    return this;
  }
}

const mowItNow = (logger = null) => new MowItNowWorker(logger);

module.exports = {
  MowItNowWorker,
  mowItNow,
};
