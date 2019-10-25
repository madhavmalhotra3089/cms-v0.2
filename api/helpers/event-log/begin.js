const uuid = require('node-uuid');
const RecordDoesNotExistException = require('../../exceptions/RecordDoesNotExistException');
const OperationException = require('../../exceptions/OperationException');

module.exports = {
  friendlyName: 'Begin',

  description: 'Begin event log.',

  inputs: {
    req: {
      type: 'ref',
      description: 'The current incoming request (req).',
      required: true,
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  async fn(inputs, exits) {
    try {
      const { req } = inputs;
      const path = req.url;
      const request = req.allParams();
      delete request.password;

      const status = (await Event_status.findOne({ name: 'begin' })).id;
      if (!status) {
        throw new RecordDoesNotExistException.RecordDoesNotExistException();
      }

      const event = await Events.create({
        id: uuid.v4(),
        path,
        request,
        status,
      }).fetch();
      return exits.success(event.id);
    } catch (err) {
      switch (err.name) {
        case 'RecordDoesNotExistException':
        case 'UnableToCreateException':
          throw err;
        default:
          throw new OperationException.OperationException(err.message);
      }
    }
  },
};
