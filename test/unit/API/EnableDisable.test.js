const chai = require('chai');
chai.use(require('chai-as-promised'));
const { ValidationException } = require('../../../api/exceptions');

const { expect } = chai;
describe('API:Enable/Disable', () => {
  let getTestData;
  let enableDisableUser;
  let validateEnableDisableUser;
  before(() => {
    // eslint-disable-next-line prefer-destructuring
    getTestData = sails.helpers.tests.getTestData;
    // eslint-disable-next-line prefer-destructuring
    enableDisableUser = sails.helpers.models.users.enableDisableUser;
    // eslint-disable-next-line prefer-destructuring
    validateEnableDisableUser = sails.helpers.validation.http.users.validateEnableDisableUser;
  });
  describe('helper: validateEnableDisableUser', () => {
    it('should throw "Validation Error" Error where additionalInfo is an array and includes  atleast 1 `"id" must be provided`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateEnableDisableUser', '2');
      return expect(validateEnableDisableUser(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ id: '"id" must contain at least 1 items' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"deleted" must be a boolean`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateEnableDisableUser', '1');
      return expect(validateEnableDisableUser(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ deleted: '"deleted" must be a boolean' }]);
    });
  });
  describe('helper: enableDisableUser', () => {
    it('should Disable the user', async () => {
      const testData = await getTestData('unit', 'helper', 'enableDisableUser', '1');
      return expect(enableDisableUser(testData)).to.be.fulfilled;
    });
    it('should Enable the user', async () => {
      const testData = await getTestData('unit', 'helper', 'enableDisableUser', '2');
      return expect(enableDisableUser(testData)).to.be.fulfilled;
    });
  });
});
