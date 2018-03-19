const { mowItNow } = require('../lib/mowitnow');

const worker = mowItNow().fromFileSync('./instructions.txt');

// Display initial mowers positions
console.log('Initial positions:');
const initialMowers = worker.getMowers();
initialMowers.forEach((mower) => {
  console.log(`${mower.x} ${mower.y} ${mower.orientation}`);
});

// Display final positions
console.log('\nFinal positions:');
const finalMowers = worker.resolve().getMowers();
finalMowers.forEach((mower) => {
  console.log(`${mower.x} ${mower.y} ${mower.orientation}`);
});
