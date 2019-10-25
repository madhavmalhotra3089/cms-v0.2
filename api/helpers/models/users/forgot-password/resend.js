const SendOtp = require('sendotp');
const { UnableToSendOtpException, OperationException } = require('../../../../exceptions');

const { SMS_SECRET_KEY } = sails.config.custom;

// Get promisified version of retry function
const retry = (mobile, method) => new Promise((resolve, reject) => {
  const sendOtp = new SendOtp(
      SMS_SECRET_KEY,
      'Your OTP for the Forgotten Password in CMS is {{otp}}. Please do not share it with anybody',
  );
  const voiceCall = method === 'voice';
  sendOtp.retry(`91${mobile}`, voiceCall, (error, data) => {
    if (data.type === 'error' || error) {
      reject(new UnableToSendOtpException.UnableToSendOtpException(data.message));
    } else {
      resolve(data);
    }
  });
});

module.exports = {
  friendlyName: 'Resend',

  description: 'Resend forgot password.',

  inputs: {
    sendOtpBody: {
      type: 'ref',
      required: true,
      description: 'Resend OTP to the user',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  async fn(inputs, exits) {
    try {
      const { mobile, method } = inputs.sendOtpBody;
      const result = await retry(mobile, method);
      return exits.success({ data: result });
    } catch (err) {
      switch (err.name) {
        case 'UnableToSendOtpException':
          throw err;
        default:
          throw new OperationException.OperationException(err.message);
      }
    }
  },
};
