const chai = require('chai');
chai.use(require('chai-as-promised'));
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const SendOtp = require('sendotp');

const {
  UnableToVerifyException,
  ValidationException,
  RecordDoesNotExistException,
} = require('../../../api/exceptions');

const { expect } = chai;
chai.should();

describe('API: VerifyOtp', () => {
  let getTestData;
  let verify;
  let validateVerifyOtp;
  before(() => {
    ({ getTestData } = sails.helpers.tests);
    ({ verify } = sails.helpers.models.users.forgotPassword);
    ({ validateVerifyOtp } = sails.helpers.validation.http.users.forgotPassword);
  });
  after(() => {
    sinon.restore();
  });
  describe('helper: validateVerifyOtp', () => {
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"Otp" is required`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateVerifyOtp', '1');
      return expect(validateVerifyOtp(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ otp: '"otp" is required' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"otp" must be a string`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateVerifyOtp', '2');
      return expect(validateVerifyOtp(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ otp: '"otp" must be a string' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"otp" with value "*[entered otp]*" fails to match the numbers pattern`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateVerifyOtp', '3');
      return expect(validateVerifyOtp(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([
          {
            otp: `"otp" with value "${testData.otp}" fails to match the numbers pattern`,
          },
        ]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" is required`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateVerifyOtp', '4');
      return expect(validateVerifyOtp(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ mobile: '"mobile" is required' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" must be a string`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateVerifyOtp', '5');
      return expect(validateVerifyOtp(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ mobile: '"mobile" must be a string' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" with value "*[entered mobile number]*" fails to match the numbers pattern`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateVerifyOtp', '6');
      return expect(validateVerifyOtp(testData))
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
      const testData = await getTestData('unit', 'helper', 'validateVerifyOtp', '7');
      return expect(validateVerifyOtp(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ mobile: '"mobile" length must be 10 characters long' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" with value "*[entered mobile number]*" fails to match the cannot start with zero pattern`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateVerifyOtp', '8');
      return expect(validateVerifyOtp(testData))
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
  describe('helper: verifyOtp', () => {
    let verifyStub;
    before(() => {
      verifyStub = sinon.stub(SendOtp.prototype, 'verify');
      verifyStub.onCall(0).yields(null, {
        type: 'success',
        message: 'It is a success',
      });
      verifyStub.onCall(1).yields(null, {
        type: 'error',
        message: '#Error response from sendopt.verify here#',
      });
    });
    it('should verify the Otp', async () => {
      const testData = await getTestData('unit', 'helper', 'forgotPassword.verify', '1');
      await expect(verify(testData)).to.be.fulfilled;
      return verifyStub.should.have.been.calledOnce;
    });
    it('should throw "UnableToVerifyException" error with message "Could not verify OTP"', async () => {
      const testData = await getTestData('unit', 'helper', 'forgotPassword.verify', '2');
      await expect(verify(testData))
        .to.eventually.be.rejectedWith('Could not verify OTP')
        .and.be.an.instanceOf(UnableToVerifyException.UnableToVerifyException)
        .and.have.deep.property('additionalInfo', '#Error response from sendopt.verify here#');
      return verifyStub.should.have.been.calledTwice;
    });
    it('should throw "RecordDoesNotExistException" with message "User does not exist"', async () => {
      const testData = await getTestData('unit', 'helper', 'forgotPassword.verify', '3');
      await expect(verify(testData))
        .to.eventually.be.rejectedWith('User does not exist')
        .and.be.an.instanceOf(RecordDoesNotExistException.RecordDoesNotExistException);
      return verifyStub.should.not.have.been.calledThrice;
    });
  });
});
