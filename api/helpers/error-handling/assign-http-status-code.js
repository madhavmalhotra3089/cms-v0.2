module.exports = {
  friendlyName: 'Assign http status code',

  description: '',

  inputs: {
    error: {
      type: 'ref',
      description: 'An error object',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  async fn(inputs) {
    const { error } = inputs;
    switch (error.name) {
      case 'ValidationException':
        return 400;
      case 'IncorrectPasswordException':
      case 'UnauthorisedException':
        return 401;
      case 'RecordDoesNotExistException':
        return 404;
      case 'RecordAlreadyExistsException':
      case 'UnableToCreateException':
      case 'UnableToUpdateException':
        return 409;
      case 'OperationException':
        return 500;
      case 'UnableToSendOtpException':
      case 'UnableToVerifyException':
      case 'FormioException':
        return 502;
      default:
        return 500;
    }
  },
};
