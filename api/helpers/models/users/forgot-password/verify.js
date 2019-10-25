const SendOtp = require('sendotp');
const {
  UnableToVerifyException,
  RecordDoesNotExistException,
  OperationException,
} = require('../../../../exceptions');

const { SMS_SECRET_KEY } = sails.config.custom;

// Get promisified version of verify function
const verify = (mobile, otp) => new Promise((resolve, reject) => {
  const sendOtp = new SendOtp(SMS_SECRET_KEY);
  sendOtp.verify(`91${mobile}`, otp, (error, data) => {
    if (data.type === 'error' || error) {
      reject(new UnableToVerifyException.UnableToVerifyException('OTP', data.message));
    } else {
      resolve(data);
    }
  });
});

module.exports = {
  friendlyName: 'Verify',

  description: 'Verify forgot password.',

  inputs: {
    verifyOtpBody: {
      type: 'ref',
      required: true,
      description: 'Verify OTP to the user',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  async fn(inputs, exits) {
    try {
      const { mobile, otp } = inputs.verifyOtpBody;
      // const sendOtp = new SendOtp(SMS_SECRET_KEY);
      const user = await Users.findOne({ mobile });
      // Check if user exist
      if (!user) {
        throw new RecordDoesNotExistException.RecordDoesNotExistException('User');
      }
      const token = await sails.helpers.jwt.createToken(user.id);
      const result = await verify(mobile, otp);
      return exits.success({ data: result, token });
    } catch (err) {
      switch (err.name) {
        case 'UnableToVerifyException':
        case 'RecordDoesNotExistException':
          throw err;
        default:
          throw new OperationException.OperationException(err.message);
      }
    }
  },
};
