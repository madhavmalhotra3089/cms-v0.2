const chai = require('chai');
chai.use(require('chai-as-promised'));
const { ValidationException, RecordDoesNotExistException } = require('../../../api/exceptions');

const { expect } = chai;
describe('API:User Profile', () => {
  let getTestData;
  let userProfile;
  let validateUserProfile;
  before(() => {
    // eslint-disable-next-line prefer-destructuring
    getTestData = sails.helpers.tests.getTestData;
    // eslint-disable-next-line prefer-destructuring
    userProfile = sails.helpers.models.users.userProfile;
    // eslint-disable-next-line prefer-destructuring
    validateUserProfile = sails.helpers.validation.http.users.validateUser;
  });
  describe('helper: Validate User Profile', () => {
    it('should throw "Validation Error" Error where additionalInfo is an array and no `"id" provided`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateUserProfile', '1');
      return expect(validateUserProfile(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ id: '"id" is required' }]);
    });
  });
  describe('helper: User Profile', () => {
    it('should show the details of User Profile', async () => {
      const testData = await getTestData('unit', 'helper', 'userProfile', '1');
      return expect(userProfile(testData)).to.be.fulfilled;
    });
    it('should throw "RecordDoesNotExistException" Error where additionalInfo is an array and wrong `"User" provided ', async () => {
      const testData = await getTestData('unit', 'helper', 'userProfile', '2');
      return expect(userProfile(testData))
        .to.eventually.be.rejectedWith('User does not exist')
        .and.be.an.instanceOf(RecordDoesNotExistException.RecordDoesNotExistException)
        .and.has.deep.property('additionalInfo', 'User');
    });
  });
});
