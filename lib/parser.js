const mowerFactory = require('./mower');
const Transaction = require('./transaction');


/**
 * Parse an initial mower position line into a position (1 2 N)
 * @param {string} initPositionLine the line containing initial position
 * @returns {Position} The initial mower Position
 * @throws {Error} if line is not a correct position line
 */
const parseMowerPosition = (initialPositionLine) => {
  const initPositionLineRegex = /(\d+) (\d+) ([N|E|W|S]$)/;
  const isValidInitPositionLine = initPositionLineRegex.test(initialPositionLine);

  if (!isValidInitPositionLine) {
    throw new Error(`Invalid mower initial position line. Should be 'X Y ORIENTATION'. '${initialPositionLine}' found.`);
  }

  const [, x, y, orientation] = initialPositionLine.match(initPositionLineRegex);

  return mowerFactory(x, y, orientation);
};


/**
 * Parse a mower instructions line into an array of instructions
 * @param {string} instructionLine containing the mower instructions
 * @returns {Array} containing a list of mower instructions
 * @throws {Error} if instructions line in not valid
 */
const parseInstructionsLine = (instructionLine) => {
  const instructionsRegex = /([A|D|G][^\s-]$)/;
  const isValidInstructions = instructionsRegex.test(instructionLine);

  if (!isValidInstructions) {
    throw new Error(`Not Valid instructions: ${isValidInstructions}`);
  }

  return Array.from(instructionLine);
};

/**
 * Parse the two lines describing a mower and its instructions
 * @param {string} initMowerPositionLine the line containing initial position
 * @param {string} mowerInstructionsLine containing the mower instructions
 */
const parseCurrentMower = (initMowerPositionLine, mowerInstructionsLine) => {
  const mower = parseMowerPosition(initMowerPositionLine);
  const mowerInstructions = parseInstructionsLine(mowerInstructionsLine);

  const mowerTransactions = mowerInstructions.map(instruction =>
    new Transaction(mower, instruction));

  return { mower, mowerTransactions };
};


/**
 * Parse the mowItNow specs to create an initial mowItNow environment
 * @param {string} specs the mowItNow specs
 * @returns an object containing a mower and a list of transactions
 */
const parseMowItNowSpecs = (specs) => {
  const isValidSpecs = specs && typeof specs === 'string';
  if (!isValidSpecs) {
    throw Error('MowItNow Specifications to run mowers are invalid. Please check it again and refer to doc.');
  }

  const splitSpecs = specs.split('\n');

  // Extract header representing land specs
  const landSpecsRegex = /(\d+) (\d+)/;
  const [, width, height] = splitSpecs[0].match(landSpecsRegex);
  splitSpecs.shift();


  const mowersDefinition = [];
  for (let line = 0; line < splitSpecs.length; line += 2) {
    const initMowerPositionLine = splitSpecs[line].trim();
    const mowerInstructionsLine = splitSpecs[line + 1].trim();

    const mowerDefinition = parseCurrentMower(initMowerPositionLine, mowerInstructionsLine);

    mowersDefinition.forEach((mowerDef) => {
      const mowerStoredState = mowerDef.mower.getCurrentState();
      const mowerToAddState = mowerDefinition.mower.getCurrentState();
      const isOnSamePosition = mowerStoredState.x === mowerToAddState.x
                               && mowerStoredState.y === mowerToAddState.y;

      if (isOnSamePosition) {
        throw new Error('Two mowers have been found at the same position.');
      }
    });
    mowersDefinition.push(mowerDefinition);
  }

  return {
    landSize: { width, height },
    mowersDefinition,
  };
};

module.exports = parseMowItNowSpecs;
