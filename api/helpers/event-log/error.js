const RecordDoesNotExistException = require('../../exceptions/RecordDoesNotExistException');
const OperationException = require('../../exceptions/OperationException');

module.exports = {
  friendlyName: 'Error',

  description: 'Error event log.',

  inputs: {
    error: {
      type: 'ref',
      description: 'Error details',
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
      const { event, initiator, error } = inputs;

      const status = (await Event_status.findOne({ name: 'error' })).id;
      if (!status) {
        throw new RecordDoesNotExistException.RecordDoesNotExistException();
      }
      await Events.update({ id: event }).set({
        status,
        error: { ...error },
        initiator: initiator || null,
      });
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
