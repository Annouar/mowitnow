const Position = require('./position');

class Land {
  constructor(height, width, mowers) {
    this.setWidth(width);
    this.setHeight(height);
    this.mowers = mowers;
    this.mowers.forEach((mower) => {
      mower.on('moveTo', (newPosition) => {
        // Block the current mower if another mower is on the future position
        if (this.isPositionBusy(newPosition)) {
          mower.block();
        } else if (mower.isBlocked()) {
          mower.start();
        }

        if (this.isInLand(newPosition) && !mower.isBlocked()) {
          mower.moveTo(newPosition);
        }
      });
    });
    this.generateNewMap();
  }

  setWidth(value) {
    const isValidWidth = value && value >= 0;

    if (!isValidWidth) {
      throw Error(`Land width is an incorrect value: ${value}`);
    }

    this.width = parseInt(+value, 10);
  }

  setHeight(value) {
    const isValidHeight = value && value >= 0;


    if (!isValidHeight) {
      throw Error(`Land height is an incorrect value: ${value}`);
    }

    this.height = parseInt(+value, 10);
  }

  isInLand(position) {
    const { x, y } = position;
    const isInWidthRange = x >= 0 && x <= this.width;
    const isInHeightRange = y >= 0 && y <= this.height;

    return isInWidthRange && isInHeightRange;
  }

  isPositionBusy(futurePosition) {
    const { x, y } = futurePosition;
    const isFuturePositionBusy = this.mowers.some(mower => mower.position.x === x
                                                           && mower.position.y === y);

    return isFuturePositionBusy;
  }

  generateNewMap() {
    const map = [];
    for (let y = 0; y <= this.height; y += 1) {
      map[y] = new Array(this.width);
      for (let x = 0; x <= this.width; x += 1) {
        map[y][x] = new Position(x, y);
      }
    }

    this.mowers.forEach((mower) => {
      const { x, y } = mower.position;
      map[y][x] = mower.position;
    });

    this.map = map;
  }

  toString() {
    const lineSeparator = '-----'.repeat(this.width);
    const parcelSeparator = '|';
    const newLine = '\n';

    let mapRepresentation = lineSeparator;
    for (let y = this.height; y >= 0; y -= 1) {
      let lineRepresentation = newLine;

      this.map[y].forEach((parcel) => {
        lineRepresentation += parcel.getRepresentation() + parcelSeparator;
      });
      mapRepresentation += lineRepresentation + newLine + lineSeparator;
    }

    return mapRepresentation;
  }
}

module.exports = Land;
