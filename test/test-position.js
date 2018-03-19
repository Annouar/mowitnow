const { expect } = require('chai');
const Position = require('../lib/position');

describe('Position', () => {
  it('should export the class', () => {
    expect(Position).to.be.a('function');
  });

  const [EAST, SOUTH, NORTH, WEST] = ['E', 'S', 'N', 'W'];

  describe('create a position instance', () => {
    const x = '1';
    const y = '2';
    const orientation = NORTH;
    const position = new Position(x, y, orientation);

    it('should create a Position instance', () => {
      expect(position).to.be.a('object');
      expect(position).to.be.a.instanceOf(Position);
    });
    it('should include x, y and orientation properties', () => {
      expect(position).to.have.ownProperty('x');
      expect(position).to.have.ownProperty('y');
      expect(position).to.have.ownProperty('orientation');
    });
    it('should include x, y, orientation well-formated instantiatied value', () => {
      expect(position.x).to.be.a('number');
      expect(position.y).to.be.a('number');
      expect(position.orientation).to.be.a('string');
      expect(position).to.include({ x: parseInt(x, 10) });
      expect(position).to.include({ y: parseInt(y, 10) });
      expect(position).to.include({ orientation });
    });
  });

  describe('representation', () => {
    it('\'N\' should return " ^ "', () => {
      const position = new Position(0, 0, NORTH);
      const representation = position.getRepresentation();

      expect(representation).to.be.a('string');
      expect(representation).to.equal(' ^ ');
    });
    it('\'W\' should return " < "', () => {
      const position = new Position(0, 0, WEST);
      const representation = position.getRepresentation();

      expect(representation).to.be.a('string');
      expect(representation).to.equal(' < ');
    });
    it('\'S\' should return " v "', () => {
      const position = new Position(0, 0, SOUTH);
      const representation = position.getRepresentation();

      expect(representation).to.be.a('string');
      expect(representation).to.equal(' v ');
    });
    it('\'E\' should return \' > \'', () => {
      const position = new Position(0, 0, EAST);
      const representation = position.getRepresentation();

      expect(representation).to.be.a('string');
      expect(representation).to.equal(' > ');
    });
    it('Other value should return "   "', () => {
      const position = new Position(0, 0, null);
      const representation = position.getRepresentation();

      expect(representation).to.be.a('string');
      expect(representation).to.equal('   ');
    });
  });

  describe('rotations', () => {
    describe(NORTH, () => {
      it('turnLeft should rotate the position to W', () => {
        const position = new Position(0, 0, NORTH);
        position.turnLeft();

        expect(position.orientation).to.be.a('string');
        expect(position.orientation).to.equal(WEST);
      });
      it('turnRight should rotate the position to E', () => {
        const position = new Position(0, 0, NORTH);
        position.turnRight();

        expect(position.orientation).to.be.a('string');
        expect(position.orientation).to.equal(EAST);
      });
    });

    describe(WEST, () => {
      it('turnLeft should rotate the position to S', () => {
        const position = new Position(0, 0, WEST);
        position.turnLeft();

        expect(position.orientation).to.be.a('string');
        expect(position.orientation).to.equal(SOUTH);
      });
      it('turnRight should rotate the position to N', () => {
        const position = new Position(0, 0, WEST);
        position.turnRight();

        expect(position.orientation).to.be.a('string');
        expect(position.orientation).to.equal(NORTH);
      });
    });

    describe(SOUTH, () => {
      it('turnLeft should rotate the position to E', () => {
        const position = new Position(0, 0, SOUTH);
        position.turnLeft();

        expect(position.orientation).to.be.a('string');
        expect(position.orientation).to.equal(EAST);
      });
      it('turnRight should rotate the position to W', () => {
        const position = new Position(0, 0, SOUTH);
        position.turnRight();

        expect(position.orientation).to.be.a('string');
        expect(position.orientation).to.equal(WEST);
      });
    });

    describe(EAST, () => {
      it('turnLeft should rotate the position to N', () => {
        const position = new Position(0, 0, EAST);
        position.turnLeft();

        expect(position.orientation).to.be.a('string');
        expect(position.orientation).to.equal(NORTH);
      });
      it('turnRight should rotate the position to S', () => {
        const position = new Position(0, 0, EAST);
        position.turnRight();

        expect(position.orientation).to.be.a('string');
        expect(position.orientation).to.equal(SOUTH);
      });
    });
  });

  describe('future position', () => {
    it('should return next position to North', () => {
      const position = new Position(2, 2, NORTH);
      const futurePosition = position.getNextPosition();

      expect(futurePosition).to.be.an.instanceOf(Position);
      expect(futurePosition).to.include({ y: position.y + 1 });
      expect(futurePosition).to.include({ x: position.x });
      expect(futurePosition).to.include({ orientation: position.orientation });
    });

    it('should return next position to West', () => {
      const position = new Position(2, 2, WEST);
      const futurePosition = position.getNextPosition();

      expect(futurePosition).to.be.an.instanceOf(Position);
      expect(futurePosition).to.include({ y: position.y });
      expect(futurePosition).to.include({ x: position.x - 1 });
      expect(futurePosition).to.include({ orientation: position.orientation });
    });

    it('should return next position to South', () => {
      const position = new Position(2, 2, SOUTH);
      const futurePosition = position.getNextPosition();

      expect(futurePosition).to.be.an.instanceOf(Position);
      expect(futurePosition).to.include({ y: position.y - 1 });
      expect(futurePosition).to.include({ x: position.x });
      expect(futurePosition).to.include({ orientation: position.orientation });
    });

    it('should return next position to East', () => {
      const position = new Position(2, 2, EAST);
      const futurePosition = position.getNextPosition();

      expect(futurePosition).to.be.an.instanceOf(Position);
      expect(futurePosition).to.include({ y: position.y });
      expect(futurePosition).to.include({ x: position.x + 1 });
      expect(futurePosition).to.include({ orientation: position.orientation });
    });
  });
});


// TODO
/*

function add() {
  return Array.prototype.slice.call(arguments).reduce(function(prev, curr) {
    return prev + curr;
  }, 0);
}

describe('add()', function() {
  var tests = [
    {args: [1, 2],       expected: 3},
    {args: [1, 2, 3],    expected: 6},
    {args: [1, 2, 3, 4], expected: 10}
  ];

  tests.forEach(function(test) {
    it('correctly adds ' + test.args.length + ' args', function() {
      var res = add.apply(null, test.args);
      assert.equal(res, test.expected);
    });
  });
});

*/
