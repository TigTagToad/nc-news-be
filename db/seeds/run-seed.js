const devData = require('../data/development-data/index.js');
const seed = require('./seed.js');
const db = require('../connection.js');

const runSeed = () => {
  console.log("seeding")
  return seed(devData).then(() => db.end());
};

runSeed();
