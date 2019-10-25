const { OperationException } = require('../../../exceptions');

module.exports = {
  friendlyName: 'Prepare schema',

  inputs: {
    req: {
      type: 'ref',
      description: 'The current incoming request (req).',
      required: true,
    },
  },

  async fn(inputs) {
    try {
      const { req } = inputs;
      const owner = (req.session.user && (req.session.user.email || req.session.user.mobile)) || 'anonymous';
      // ###############################################################################
      // ##                        HERES HOW THE ABOVE WORKS                          ##
      // ##                           for simplification                              ##
      // ##                         user = req.session.user                           ##
      // ##                      email = req.session.user.email                       ##
      // ##                     mobile = req.session.user.mobile                      ##
      // ##                      left side gets evaluated first                       ##
      // ##       for || operation if left side is falsy, owner = (right side)        ##
      // ##       for && operation if left side is truthy, owner = (right side)       ##
      // ##        if email is present, THEN owner = email ELSE owner = mobile        ##
      // ##               if user is falsy, meaning user does not exist               ##
      // ##                            owner = 'anonymous'                            ##
      // ###############################################################################
      // Structure submission data
      return {
        owner,
        data: {
          ...req.allParams(),
        },
      };
    } catch (err) {
      throw new OperationException.OperationException(err.message);
    }
  },
};
