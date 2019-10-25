const { OperationException } = require('../../../exceptions');

module.exports = {
  friendlyName: 'Get features and permissions',

  description: '',

  inputs: {
    obj: {
      type: 'ref',
      description: 'Object containing the users array data',
    },
    state: {
      type: 'ref',
      description: 'Array containing the state id',
      defaultsTo: [null],
    },
  },

  exits: {
    success: {
      outputFriendlyName: 'Features and permissions',
    },
  },

  async fn(inputs) {
    try {
      let { data } = inputs.obj;
      const stateIds = inputs.state;
      const featuresList = {};
      const statesList = {};
      (await Features.find({ select: ['id', 'name'] })).map(({ id, name }) => {
        featuresList[id] = name;
        return 0;
      });
      (await States.find({ select: ['id', 'name'] })).map(({ id, name }) => {
        statesList[id] = name;
        return 0;
      });
      data = data.map((user) => {
        temp = { ...user };
        temp.states = [];
        if (user.config.featureConfig) {
          user.config.featureConfig.map(({ state, features }) => {
            if (stateIds[0]) {
              if (stateIds.includes(state)) {
                temp.states.push({
                  StateName: statesList[state],
                  StateID: state,
                  features: features.map(({ featureId, permissions }) => ({
                    FeaturesName: featuresList[featureId],
                    FeaturesID: featureId,
                    permissions,
                  })),
                });
              }
            } else {
              temp.states.push({
                StateName: statesList[state],
                StateID: state,
                features: features.map(({ featureId, permissions }) => ({
                  FeaturesName: featuresList[featureId],
                  FeaturesID: featureId,
                  permissions,
                })),
              });
            }
            return 0;
          });
        }
        delete temp.created_at;
        delete temp.updated_at;
        delete temp.config;
        delete temp.password;
        return temp;
      });
      return data;
    } catch (err) {
      throw new OperationException.OperationException(err.message);
    }
  },
};
