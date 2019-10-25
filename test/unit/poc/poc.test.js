const chai = require('chai');

const sinon = require('sinon');
const SendOtp = require('sendotp');
const sinonChai = require('sinon-chai');

const { UnableToVerifyException, ValidationException } = require('../../../api/exceptions');

const { expect } = chai;
chai.use(sinonChai);
chai.use(require('chai-as-promised'));

describe('API: VerifyOtp', () => {
  let getTestData;
  let VerifyOtp;
  let validateVerifyOtp;

  before(() => {
    // eslint-disable-next-line prefer-destructuring
    getTestData = sails.helpers.tests.getTestData;
    // eslint-disable-next-line prefer-destructuring
    VerifyOtp = sails.helpers.models.users.forgotPassword.verify;
    // eslint-disable-next-line prefer-destructuring
    validateVerifyOtp = sails.helpers.validation.http.users.forgotPassword.validateVerifyOtp;
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('POC : helper: verifyOtp', () => {
    // it('should verify the Otp', async () => {
    //   const { SMS_SECRET_KEY } = sails.config.custom;
    //   const verifyOTP = sinon.mock(SendOtp.prototype);
    //   verifyOTP.expects('verify').resolves('1234');
    //   const testData = await getTestData('unit', 'helper', 'forgotPassword.verify', '1');
    //   return expect(VerifyOtp(testData)).to.eventually.be.ok;
    // });
  });
});
