
class Position {
  constructor(x, y, orientation = null) {
    this.x = Number.parseInt(x, 10);
    this.y = Number.parseInt(y, 10);
    this.orientation = orientation;
  }


  getRepresentation() {
    switch (this.orientation) {
      case 'N': return ' ^ ';
      case 'E': return ' > ';
      case 'W': return ' < ';
      case 'S': return ' v ';
      default: return '   ';
    }
  }

  turnLeft() {
    switch (this.orientation) {
      case 'N':
        this.orientation = 'W';
        break;
      case 'W':
        this.orientation = 'S';
        break;
      case 'S':
        this.orientation = 'E';
        break;
      case 'E':
        this.orientation = 'N';
        break;
      default: break;
    }
  }

  turnRight() {
    switch (this.orientation) {
      case 'N':
        this.orientation = 'E';
        break;
      case 'W':
        this.orientation = 'N';
        break;
      case 'S':
        this.orientation = 'W';
        break;
      case 'E':
        this.orientation = 'S';
        break;
      default: break;
    }
  }

  getNextPosition() {
    const newPosition = Object.assign(Object.create(Object.getPrototypeOf(this)), this);

    switch (this.orientation) {
      case 'N':
        newPosition.y += 1;
        break;
      case 'W':
        newPosition.x -= 1;
        break;
      case 'S':
        newPosition.y -= 1;
        break;
      case 'E':
        newPosition.x += 1;
        break;
      default: break;
    }
    return newPosition;
  }

  toString() {
    return `${this.x} ${this.y} ${this.orientation}`;
  }
}

// //console.log(new Position(1, 2, null))

module.exports = Position;
