const {
  OperationException,
  RecordDoesNotExistException,
  IncorrectPasswordException,
} = require('../../../exceptions');

const checkPassword = (enteredPassword, encryptedPassword) => new Promise((resolve, reject) => {
  sails.helpers.passwords.checkPassword(enteredPassword, encryptedPassword).switch({
    error() {
      reject(
          new OperationException.OperationException(
            'Unknown error while checking password',
            err.toString(),
          ),
      );
    },
    success() {
      resolve('Password Verified');
    },
    incorrect() {
      reject(new IncorrectPasswordException.IncorrectPasswordException());
    },
  });
});

module.exports = {
  friendlyName: 'Log in user',

  description: '',

  inputs: {
    logInBody: {
      type: 'ref',
      required: true,
      description: 'Body of the request.',
    },
  },

  exits: {
    incorrect: {
      description: 'Wrong Password',
    },
  },

  async fn(inputs, exits) {
    try {
      const { logInBody } = inputs;
      // Find User in DB
      const where = logInBody.email ? { email: logInBody.email } : { mobile: logInBody.mobile };
      const user = await Users.findOne(where);
      // Check if user exist
      if (!user) {
        throw new RecordDoesNotExistException.RecordDoesNotExistException('User');
      }
      // Validate Password
      const result = await checkPassword(logInBody.password, user.password);
      // if the result is an error, throw it.
      if (result instanceof Error) {
        throw result;
      }
      // generate token
      const token = await sails.helpers.jwt.createToken(user.id);
      // return user data and token
      return exits.success({ data: { ...user }, token });
    } catch (err) {
      switch (err.name) {
        case 'RecordDoesNotExistException':
        case 'IncorrectPasswordException':
        case 'OperationException':
          throw err;
        default:
          throw new OperationException.OperationException(err.message);
      }
    }
  },
};
