const fs = require('fs');
const { expect } = require('chai');
const { mowItNow, MowItNowWorker } = require('../lib/mowitnow');

describe('mowItNow', () => {
  it('should export the mowItNow factory helper', () => {
    expect(mowItNow).to.be.a('function');
  });

  describe('factory create a new MowItNowWorker', () => {
    before(() => {
      this.worker = mowItNow();
    });

    it('should return a MowItNowWorker', () => {
      expect(this.worker).to.be.an.instanceof(MowItNowWorker);
      expect(this.worker.queues).to.be.empty;
      expect(this.worker.land).to.be.empty;
      expect(this.worker.history).to.be.empty;
    });
    it('should create a new instance per call', () => {
      const anotherWorker = mowItNow();
      expect(this.worker).to.be.not.equal(anotherWorker);
    });
  });

  describe('init with helpers functions', () => {
    before(() => {
      this.instructionPath = './test/simple-instructions.txt';
      this.instructions = fs.readFileSync(this.instructionPath, 'utf-8');
      this.arrayInstructions = this.instructions.split('\n');
    });

    beforeEach(() => {
      this.worker = mowItNow();
    });

    it('should init with plain text and return current instance', () => {
      const returnedValue = this.worker.fromText(this.instructions);

      expect(this.worker.queues).to.be.not.empty;
      expect(this.worker.land).to.be.not.empty;
      expect(this.worker.history).to.be.empty;

      expect(returnedValue).to.be.an.instanceof(MowItNowWorker);
      expect(returnedValue).to.equal(this.worker);
    });

    it('should init from array and return current instance', () => {
      const returnedValue = this.worker.fromArray(this.arrayInstructions);

      expect(this.worker.queues).to.be.not.empty;
      expect(this.worker.land).to.be.not.empty;
      expect(this.worker.history).to.be.empty;

      expect(returnedValue).to.be.an.instanceof(MowItNowWorker);
      expect(returnedValue).to.equal(this.worker);
    });

    it('should init from file - async', () => {
      this.worker.fromFileAsync(this.instructionPath, (worker) => {
        expect(worker.queues).to.be.not.empty;
        expect(worker.land).to.be.not.empty;
        expect(worker.history).to.be.empty;

        expect(worker).to.be.an.instanceof(MowItNowWorker);
      });
    });

    it('should init from file - sync', () => {
      const returnedValue = this.worker.fromFileSync(this.instructionPath);
      expect(this.worker.queues).to.be.not.empty;
      expect(this.worker.land).to.be.not.empty;
      expect(this.worker.history).to.be.empty;

      expect(returnedValue).to.be.an.instanceof(MowItNowWorker);
      expect(returnedValue).to.equal(this.worker);
    });

    it('raise Exception if two mowers have been found at the same position', () => {
      const filePath = './test/same-position-mowers-instructions.txt';
      const initWorker = () => { this.worker.fromFileSync(filePath); };

      expect(initWorker).to.throw(Error);
    });
  });

  describe('getMowers()', () => {
    before(() => {
      const instructionPath = './test/simple-instructions.txt';
      this.worker = mowItNow().fromFileSync(instructionPath);
    });

    it('it should be a MowItNowWorker function', () => {
      expect(this.worker.getMowers).to.be.a('function');
    });

    it('should return an array', () => {
      const mowers = this.worker.getMowers();

      expect(mowers).to.be.an('array').that.is.not.empty;
    });
    it('should containing current mowers states (position, isStuck)', () => {
      const mowers = this.worker.getMowers();

      mowers.forEach((mower) => {
        expect(mower).to.have.property('x').that.is.not.null;
        expect(mower).to.have.property('y').that.is.not.null;
        expect(mower).to.have.property('orientation').that.is.not.null;
        expect(mower).to.have.property('status').that.is.not.null;
      });
    });
  });

  describe('resolve()', () => {
    beforeEach(() => {
      this.worker = mowItNow();
    });

    // it('should return the current instance to make it chainable');
    it('should resolve a simple case', () => {
      const filePath = './test/simple-instructions.txt';
      const mowers = this.worker
        .fromFileSync(filePath)
        .resolve()
        .getMowers();

      const expectedMower = [{
        x: 0,
        y: 3,
        orientation: 'N',
        status: 'finished',
      }];

      expect(mowers).to.have.deep.members(expectedMower);
    });

    it('should resolve a mower trying to go out of zone case', () => {
      const filePath = './test/out-of-zone-instructions.txt';
      const mowers = this.worker
        .fromFileSync(filePath)
        .resolve()
        .getMowers();

      const expectedMower = [{
        x: 0,
        y: 2,
        orientation: 'N',
        status: 'finished',
      }];

      expect(mowers).to.have.deep.members(expectedMower);
    });

    it('should resolve the project case', () => {
      const filePath = './test/project-instructions.txt';
      const mowers = this.worker
        .fromFileSync(filePath)
        .resolve()
        .getMowers();

      const expectedMower = [{
        x: 1,
        y: 3,
        orientation: 'N',
        status: 'finished',
      },
      {
        x: 4,
        y: 1,
        orientation: 'E',
        status: 'finished',
      },
      {
        x: 5,
        y: 4,
        orientation: 'N',
        status: 'finished',
      }];

      expect(mowers).to.have.deep.members(expectedMower);
    });

    it('should raise an exception if deadlock (mowers blocked by each others)', () => {
      const filePath = './test/deadlock-instructions.txt';
      const resolve = this.worker
        .fromFileSync(filePath)
        .resolve;

      expect(resolve).to.throw(Error);
    });
  });
});
