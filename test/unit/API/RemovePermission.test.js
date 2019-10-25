const chai = require('chai');
chai.use(require('chai-as-promised'));
const { RecordDoesNotExistException, ValidationException } = require('../../../api/exceptions');

const { expect } = chai;

describe('API: Remove Permission ', () => {
  let getTestData;
  let removePermission;
  let validateRemovePermission;
  before(() => {
    // eslint-disable-next-line prefer-destructuring
    getTestData = sails.helpers.tests.getTestData;
    // eslint-disable-next-line prefer-destructuring
    removePermission = sails.helpers.models.users.removePermissionUser;
    // eslint-disable-next-line prefer-destructuring
    validateRemovePermission = sails.helpers.validation.http.users.validateUpdatePermissionUser;
  });
  describe('helper: validate User Remove Permission', () => {
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"id" is required`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateRemovePermission', '1');
      return expect(validateRemovePermission(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ userId: '"userId" must contain at least 1 items' }]);
    });

    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"featureId" is required`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateRemovePermission', '2');
      return expect(validateRemovePermission(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ featureId: '"featureId" is not allowed to be empty' }]);
    });

    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"permission" is required`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateRemovePermission', '3');
      return expect(validateRemovePermission(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ permission: '"permission" is not allowed to be empty' }]);
    });

    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"permission" Other than Define in Enum`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateRemovePermission', '4');
      return expect(validateRemovePermission(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([
          { permission: '"permission" must be one of [Create, Update, View, Delete, Download]' },
        ]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"StateId" is required`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateRemovePermission', '5');
      return expect(validateRemovePermission(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ stateId: '"stateId" is not allowed to be empty' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"id" must be GUID`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateRemovePermission', '6');
      return expect(validateRemovePermission(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ 0: '"0" must be a valid GUID' }]);
    });
  });
  describe('helper: Remove permission User ', () => {
    it('should remove view Permission for task management feature', async () => {
      const testData = await getTestData('unit', 'helper', 'removePermission', '1');
      return expect(removePermission(testData)).to.be.fulfilled;
    });

    it('should remove create Permission for task management feature', async () => {
      const testData = await getTestData('unit', 'helper', 'removePermission', '2');
      return expect(removePermission(testData)).to.be.fulfilled;
    });

    it('should remove update Permission for task management feature', async () => {
      const testData = await getTestData('unit', 'helper', 'removePermission', '3');
      return expect(removePermission(testData)).to.be.fulfilled;
    });

    it('should remove Download Permission for task management feature', async () => {
      const testData = await getTestData('unit', 'helper', 'removePermission', '4');
      return expect(removePermission(testData)).to.be.fulfilled;
    });

    it('should remove Delete Permission for task management feature', async () => {
      const testData = await getTestData('unit', 'helper', 'removePermission', '5');
      return expect(removePermission(testData)).to.be.fulfilled;
    });

    it('should throw "Record Does Not Exist" Error where additionalInfo is an array and includes `"feature" is not define`', async () => {
      const testData = await getTestData('unit', 'helper', 'removePermission', '6');
      return expect(removePermission(testData))
        .to.eventually.be.rejectedWith('Feature does not exist')
        .and.be.an.instanceOf(RecordDoesNotExistException.RecordDoesNotExistException)
        .and.has.deep.property('additionalInfo', 'Feature');
    });
  });
});
