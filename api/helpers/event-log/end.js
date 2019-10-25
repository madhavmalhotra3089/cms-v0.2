const RecordDoesNotExistException = require('../../exceptions/RecordDoesNotExistException');
const OperationException = require('../../exceptions/OperationException');

module.exports = {
  friendlyName: 'End',

  description: 'End event log.',

  inputs: {
    res: {
      type: 'ref',
      description: 'The outgoing response data.',
      required: true,
    },
    event: {
      type: 'string',
      description: 'The event id.',
    },
    initiator: {
      type: 'string',
      description: 'The user id making the request.',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  async fn(inputs) {
    try {
      const { res, initiator, event } = inputs;

      const status = (await Event_status.findOne({ name: 'end' })).id;
      if (!status) {
        throw new RecordDoesNotExistException.RecordDoesNotExistException();
      }

      await Events.update({ id: event }).set({
        status,
        response: { ...res },
        error: null,
        initiator: initiator || null,
      });
    } catch (err) {
      switch (err.name) {
        case 'RecordDoesNotExistException':
        case 'UnableToUpdateException':
          throw err;
        default:
          throw new OperationException.OperationException(err.message);
      }
    }
  },
};
