const fs = require('fs');

module.exports = {
  friendlyName: 'Get test data',

  description: '',

  inputs: {
    levelName: { type: 'string', required: true },
    moduleName: { type: 'string', required: true },
    testName: { type: 'string', required: true },
    sno: { type: 'string', required: true },
  },

  exits: {
    success: {
      description: 'Retrieved data',
    },
  },

  async fn(inputs, exits) {
    const {
      moduleName, testName, sno, levelName,
    } = inputs;

    const testData = fs.readFileSync(
      `./test/fixtures/${levelName}/${moduleName}/${testName}/${sno}.json`,
    );
    return exits.success(JSON.parse(testData));
  },
};
