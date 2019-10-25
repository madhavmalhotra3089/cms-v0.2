const chai = require('chai');
const sinon = require('sinon');
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
const SendOtp = require('sendotp');
const { UnableToSendOtpException, ValidationException } = require('../../../api/exceptions');

const { expect } = chai;
chai.should();

describe('API: ResendOtp', () => {
  let getTestData;
  let resend;
  let validateResendOtp;

  before(() => {
    ({ getTestData } = sails.helpers.tests);
    ({ resend } = sails.helpers.models.users.forgotPassword);
    ({ validateResendOtp } = sails.helpers.validation.http.users.forgotPassword);
  });

  describe('helper: validateResendOtp', () => {
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" is required`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateResendOtp', '1');
      return expect(validateResendOtp(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ mobile: '"mobile" is required' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" must be a string`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateResendOtp', '2');
      return expect(validateResendOtp(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ mobile: '"mobile" must be a string' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" with value "*[entered mobile number]*" fails to match the numbers pattern`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateResendOtp', '3');
      return expect(validateResendOtp(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([
          {
            mobile: `"mobile" with value "${testData.mobile}" fails to match the numbers pattern`,
          },
        ]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" length must be 10 characters long`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateResendOtp', '4');
      return expect(validateResendOtp(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ mobile: '"mobile" length must be 10 characters long' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" with value "*[entered mobile number]*" fails to match the cannot start with zero pattern`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateResendOtp', '5');
      return expect(validateResendOtp(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([
          {
            mobile: `"mobile" with value "${testData.mobile}" fails to match the cannot start with zero pattern`,
          },
        ]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"method" is required`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateResendOtp', '6');
      return expect(validateResendOtp(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ method: '"method" is required' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"method" must be a string`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateResendOtp', '7');
      return expect(validateResendOtp(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ method: '"method" must be a string' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"method" must be one of [voice, text]`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateResendOtp', '8');
      return expect(validateResendOtp(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ method: '"method" must be one of [voice, text]' }]);
    });
  });
  describe('helper: resend', () => {
    let resendStub;
    before(() => {
      resendStub = sinon.stub(SendOtp.prototype, 'retry');
      resendStub.onCall(0).yields(null, {
        type: 'success',
        message: '#external api success message#',
      });
      resendStub.onCall(1).yields(null, {
        type: 'error',
        message: '#external api error message#',
      });
    });
    after(() => {
      sinon.restore();
    });
    it('should resend an Otp', async () => {
      const testData = await getTestData('unit', 'helper', 'forgotPassword.resend', '1');
      await expect(resend(testData)).to.be.fulfilled;
      return resendStub.should.have.been.calledOnce;
    });

    it('should throw "UnableToSendOtpException" Error with message "Unable to send OTP"', async () => {
      const testData = await getTestData('unit', 'helper', 'forgotPassword.resend', '2');
      await expect(resend(testData))
        .to.eventually.be.rejectedWith('Unable to send OTP')
        .and.be.an.instanceOf(UnableToSendOtpException.UnableToSendOtpException)
        .and.have.deep.property('additionalInfo', '#external api error message#');
      return resendStub.should.have.been.calledTwice;
    });
  });
});
