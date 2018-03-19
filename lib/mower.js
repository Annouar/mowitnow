const { EventEmitter } = require('events');
const Position = require('./position');

class Mower extends EventEmitter {
  constructor(position) {
    super();
    this.position = position;
    this.status = 'off';
  }

  /**
   * Execute the order in parameter (A to move forward, D to turn right, G to turn left)
   * @param {string} transaction the order to execute
   */
  move(transaction) {
    switch (transaction) {
      case 'A': {
        // Compute the next position and send it to subscribers
        const nextPosition = this.position.getNextPosition();
        this.emit('moveTo', nextPosition);
        break;
      }
      case 'D':
        this.position.turnRight();
        break;
      case 'G':
        this.position.turnLeft();
        break;
      default: break;
    }
  }

  /**
   * The the mower to position in parameter
   * @param {Position} position the position to move to
   */
  moveTo(position) {
    this.position = position;
  }

  /**
   * Change status when mower is blocked by another one
   */
  block() {
    this.status = 'stuck';
  }

  /**
   * Change status when mower is mowing
   */
  start() {
    this.status = 'running';
  }

  /**
   * Change status when mower won't move anymore
   */
  end() {
    this.status = 'finished';
  }

  /**
   * Get a boolean to know if mower is blocked by another one
   * @returns {boolean} True if mower is blocked
   */
  isBlocked() {
    return this.status === 'stuck';
  }

  /**
   * Get a boolean to know if mower has reached final position (no new order to execute)
   */
  hasFinished() {
    return this.status === 'finished';
  }

  /**
   * Get an object representing the mower
   * @returns {object} containing current mower state
   */
  getCurrentState() {
    return Object.assign({}, this.position, { status: this.status });
  }

  toString() {
    return `Mower: ${this.position}, status=${this.status}`;
  }
}


const mowerFactory = (x, y, orientation) => {
  const position = new Position(x, y, orientation);
  return new Mower(position);
};

module.exports = mowerFactory;
