const chai = require('chai');
chai.use(require('chai-as-promised'));
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const SendOtp = require('sendotp');
const {
  RecordDoesNotExistException,
  ValidationException,
  UnableToSendOtpException,
} = require('../../../api/exceptions');

chai.should();
const { expect } = chai;

describe('API: SendOtp', () => {
  let getTestData;
  let send;
  let validateSendOtp;
  before(() => {
    ({ getTestData } = sails.helpers.tests);
    ({ send } = sails.helpers.models.users.forgotPassword);
    ({ validateSendOtp } = sails.helpers.validation.http.users.forgotPassword);
  });
  describe('helper: validateSendOtp', () => {
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" is required`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateSendOtp', '1');
      return expect(validateSendOtp(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ mobile: '"mobile" is required' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" must be a string`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateSendOtp', '2');
      return expect(validateSendOtp(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ mobile: '"mobile" must be a string' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" with value "*[entered mobile number]*" fails to match the numbers pattern`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateSendOtp', '3');
      return expect(validateSendOtp(testData))
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
      const testData = await getTestData('unit', 'helper', 'validateSendOtp', '4');
      return expect(validateSendOtp(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ mobile: '"mobile" length must be 10 characters long' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" with value "*[entered mobile number]*" fails to match the cannot start with zero pattern`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateSendOtp', '5');
      return expect(validateSendOtp(testData))
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
  });
  describe('helper: send', () => {
    let sendStub;
    before(() => {
      sendStub = sinon.stub(SendOtp.prototype, 'send');
      sendStub.onCall(0).yields(null, {
        type: 'success',
        message: '#api success message#',
      });
      sendStub.onCall(1).yields(null, {
        type: 'error',
        message: '#api error message#',
      });
    });
    after(() => {
      sendStub.restore();
    });
    it('should send an Otp', async () => {
      const testData = await getTestData('unit', 'helper', 'forgotPassword.send', '1');
      await expect(send(testData)).to.be.fulfilled;
      return sendStub.should.have.been.calledOnce;
    });
    it('should throw "UnableToSendOtpException" error with message "Unable to send OTP"', async () => {
      const testData = await getTestData('unit', 'helper', 'forgotPassword.send', '1');
      await expect(send(testData))
        .to.eventually.be.rejectedWith('Unable to send OTP')
        .and.be.an.instanceOf(UnableToSendOtpException.UnableToSendOtpException)
        .and.have.deep.property('additionalInfo', '#api error message#');
      return sendStub.should.have.been.calledTwice;
    });

    it('should throw "User does not exists" Error where additionalInfo = "User" when using mobile', async () => {
      const testData = await getTestData('unit', 'helper', 'forgotPassword.send', '2');
      await expect(send(testData))
        .to.eventually.be.rejectedWith('User does not exist')
        .and.be.an.instanceOf(RecordDoesNotExistException.RecordDoesNotExistException)
        .and.has.deep.property('additionalInfo', 'User');
      return sendStub.should.not.have.been.calledThrice;
    });
  });
});
