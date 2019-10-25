const {
  OperationException,
  RecordDoesNotExistException,
  IncorrectPasswordException,
} = require('../../../exceptions');

const checkPassword = (enteredPassword, encryptedPassword) => new Promise((resolve, reject) => {
  sails.helpers.passwords.checkPassword(enteredPassword, encryptedPassword).switch({
    error(err) {
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
  friendlyName: 'Reset user password',

  description: '',

  inputs: {
    resetPasswordBody: {
      type: 'ref',
      required: true,
      description: 'Body of the request',
    },
    userId: {
      type: 'string',
      required: true,
      description: 'The ID of the user making the request',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  async fn(inputs, exits) {
    try {
      const { resetPasswordBody, userId } = inputs;
      const { oldPassword, newPassword, reset } = resetPasswordBody;
      const user = await Users.findOne({ id: userId });
      if (!user) {
        throw new RecordDoesNotExistException.RecordDoesNotExistException('User');
      }
      // Validate Password
      if (reset) {
        await checkPassword(oldPassword, user.password);
      }

      const hashedNewPassword = await sails.helpers.passwords.hashPassword(newPassword);
      const updatedUser = await Users.updateOne({ id: userId }).set({
        password: hashedNewPassword,
      });
      return exits.success({ data: updatedUser });
    } catch (err) {
      switch (err.name) {
        case 'IncorrectPasswordException':
        case 'RecordDoesNotExistException':
        case 'OperationException':
          throw err;
        default:
          throw new OperationException.OperationException(err.message);
      }
    }
  },
};
