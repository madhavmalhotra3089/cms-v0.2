const chai = require('chai');
chai.use(require('chai-as-promised'));
const {
  RecordDoesNotExistException,
  ValidationException,
  IncorrectPasswordException,
} = require('../../../api/exceptions');

const { expect } = chai;

describe('API: Login', () => {
  let getTestData;
  let logInUser;
  let validateUserLogIn;
  before(() => {
    ({ getTestData } = sails.helpers.tests);
    ({ logInUser } = sails.helpers.models.users);
    ({ validateUserLogIn } = sails.helpers.validation.http.users);
  });
  describe('helper: validateUserLogIn', () => {
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" is required`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateUserLogIn', '1');
      return expect(validateUserLogIn(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ mobile: '"mobile" is required' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" must be a string`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateUserLogIn', '2');
      return expect(validateUserLogIn(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ mobile: '"mobile" must be a string' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" length must be 10 characters long`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateUserLogIn', '3');
      return expect(validateUserLogIn(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ mobile: '"mobile" length must be 10 characters long' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" with value "*[entered mobile number]*" fails to match the cannot start with zero pattern`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateUserLogIn', '4');
      return expect(validateUserLogIn(testData))
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
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"password" is required`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateUserLogIn', '5');
      return expect(validateUserLogIn(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ password: '"password" is required' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"password" must be a string`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateUserLogIn', '6');
      return expect(validateUserLogIn(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ password: '"password" must be a string' }]);
    });
  });
  describe('helper: logInUser', () => {
    it('should log in user using mobile', async () => {
      const testData = await getTestData('unit', 'helper', 'logInUser', '1');
      return expect(logInUser(testData)).to.be.fulfilled;
    });
    it('should log in user using email', async () => {
      const testData = await getTestData('unit', 'helper', 'logInUser', '2');
      return expect(logInUser(testData)).to.be.fulfilled;
    });
    it('should throw "Entered Password is incorrect" Error', async () => {
      const testData = await getTestData('unit', 'helper', 'logInUser', '3');
      return expect(logInUser(testData))
        .to.eventually.be.rejectedWith('Entered Password is incorrect')
        .and.be.an.instanceOf(IncorrectPasswordException.IncorrectPasswordException);
    });
    it('should throw "User does not exists" Error where additionalInfo = "User" when using email', async () => {
      const testData = await getTestData('unit', 'helper', 'logInUser', '4');
      return expect(logInUser(testData))
        .to.eventually.be.rejectedWith('User does not exist')
        .and.be.an.instanceOf(RecordDoesNotExistException.RecordDoesNotExistException)
        .and.has.deep.property('additionalInfo', 'User');
    });
    it('should throw "User does not exists" Error where additionalInfo = "User" when using mobile', async () => {
      const testData = await getTestData('unit', 'helper', 'logInUser', '5');
      return expect(logInUser(testData))
        .to.eventually.be.rejectedWith('User does not exist')
        .and.be.an.instanceOf(RecordDoesNotExistException.RecordDoesNotExistException)
        .and.has.deep.property('additionalInfo', 'User');
    });
  });
});
