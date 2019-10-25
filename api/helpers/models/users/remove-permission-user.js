const { OperationException, RecordDoesNotExistException } = require('../../../exceptions');

module.exports = {
  friendlyName: 'Assign Permission User',
  description: '',
  inputs: {
    addPermission: {
      type: 'ref',
      required: true,
      description: 'The ID`s of the user making the request',
    },
  },
  exits: {
    success: {
      description: 'All done.',
    },
  },
  async fn(inputs, exits) {
    try {
      const {
        userId, stateId, featureId, permission,
      } = inputs.addPermission;

      const feature = await Features.findOne({ id: featureId });
      if (!feature) {
        throw new RecordDoesNotExistException.RecordDoesNotExistException('Feature');
      }

      userId.forEach(async (Id) => {
        const user = await Users.findOne({ id: Id });
        if (!user) return 0;
        if ('featureConfig' in user.config) {
          let stateIndex = -1;
          let featureIndex = -1;
          user.config.featureConfig.find((item, i) => {
            if (item.state === stateId) {
              stateIndex = i;
            }
            return 0;
          });

          if (stateIndex >= 0) {
            user.config.featureConfig[stateIndex].features.find((item, i) => {
              if (item.featureId === featureId) {
                featureIndex = i;
              }
              return 0;
            });

            if (featureIndex >= 0) {
              user.config.featureConfig[stateIndex].features[
                featureIndex
              ].permissions = user.config.featureConfig[stateIndex].features[
                featureIndex
              ].permissions.filter(item => item !== permission);
              if (
                user.config.featureConfig[stateIndex].features[featureIndex].permissions.length
                === 0
              ) {
                user.config.featureConfig[stateIndex].features = user.config.featureConfig[
                  stateIndex
                ].features.filter(item => item.featureId !== featureId);
              }

              if (user.config.featureConfig[stateIndex].features.length === 0) {
                user.config.featureConfig = user.config.featureConfig.filter(
                  item => item.state !== stateId,
                );
              }
            }
          }
        }
        await Users.updateOne({ id: Id }).set({
          config: user.config,
        });
        return 0;
      });
      return exits.success({ msg: 'Data Updated' });
    } catch (err) {
      switch (err.name) {
        case 'RecordDoesNotExistException':
          throw err;
        default:
          throw new OperationException.OperationException(err.message);
      }
    }
  },
};
