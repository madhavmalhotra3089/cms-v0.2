const SendOtp = require('sendotp');
const {
  RecordDoesNotExistException,
  OperationException,
  UnableToSendOtpException,
} = require('../../../../exceptions');

const { SMS_SECRET_KEY } = sails.config.custom;

// Get promisified version of send function
const send = (mobile, senderId) => new Promise((resolve, reject) => {
  const sendOtp = new SendOtp(
      SMS_SECRET_KEY,
      'Your OTP for the Forgotten Password in CMS is {{otp}}. Please do not share it with anybody',
  );
  sendOtp.setOtpExpiry('10');
  sendOtp.send(`91${mobile}`, senderId, (error, data) => {
    if (data.type === 'error' || error) {
      reject(new UnableToSendOtpException.UnableToSendOtpException(data.message));
    } else {
      resolve(data);
    }
  });
});

module.exports = {
  friendlyName: 'Send otp',

  description: '',

  inputs: {
    sendOtpBody: {
      type: 'ref',
      required: true,
      description: 'Send OTP to the user',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  async fn(inputs, exits) {
    try {
      const { mobile } = inputs.sendOtpBody;
      const user = await Users.findOne({ mobile });
      // Check if user exist
      if (!user) {
        throw new RecordDoesNotExistException.RecordDoesNotExistException('User');
      }
      const senderId = 'CMSOTP';
      const result = await send(mobile, senderId);
      return exits.success({ data: result });
    } catch (err) {
      switch (err.name) {
        case 'UnableToSendOtpException':
        case 'RecordDoesNotExistException':
          throw err;
        default:
          throw new OperationException.OperationException(err.message);
      }
    }
  },
};
