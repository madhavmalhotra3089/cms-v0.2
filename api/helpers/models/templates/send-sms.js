const { SMS_SECRET_KEY, SENDER_ID_INF, ROUTE_NO } = sails.config.custom;
const Msg91 = require('msg91');
const { OperationException } = require('../../../exceptions');

const send = (mobile, senderId = SENDER_ID_INF, messageBody) => new Promise((resolve, reject) => {
  const msg = new Msg91(SMS_SECRET_KEY, senderId, ROUTE_NO);
  msg.send(mobile, messageBody, (err, response) => {
    if (err) {
      reject(Error(err.message));
    }
    resolve(response);
  });
});

module.exports = {
  friendlyName: 'Send Message',

  inputs: {
    smsParameters: {
      type: 'ref',
    },
  },

  async fn({ smsParameters: { mobile, messageBody, senderId } }) {
    try {
      await send(mobile, senderId, messageBody);
      return;
    } catch (err) {
      switch (err.name) {
        default:
          throw new OperationException.OperationException(err.message);
      }
    }
  },
};
