const chai = require('chai');
chai.use(require('chai-as-promised'));
const { RecordDoesNotExistException, ValidationException } = require('../../../api/exceptions');

const { expect } = chai;

describe('API: Assign Permission ', () => {
  let getTestData;
  let assignPermission;
  let validateAssignPermission;
  before(() => {
    // eslint-disable-next-line prefer-destructuring
    getTestData = sails.helpers.tests.getTestData;
    // eslint-disable-next-line prefer-destructuring
    assignPermission = sails.helpers.models.users.assignPermissionUser;
    // eslint-disable-next-line prefer-destructuring
    validateAssignPermission = sails.helpers.validation.http.users.validateUpdatePermissionUser;
  });
  describe('helper: validate User Assign Permission', () => {
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"id" is required`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateAssignPermission', '1');
      return expect(validateAssignPermission(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ userId: '"userId" must contain at least 1 items' }]);
    });

    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"featureId" is required`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateAssignPermission', '2');
      return expect(validateAssignPermission(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ featureId: '"featureId" is not allowed to be empty' }]);
    });

    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"permission" is required`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateAssignPermission', '3');
      return expect(validateAssignPermission(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ permission: '"permission" is not allowed to be empty' }]);
    });

    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"permission" Other than Define in Enum`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateAssignPermission', '4');
      return expect(validateAssignPermission(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([
          { permission: '"permission" must be one of [Create, Update, View, Delete, Download]' },
        ]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"StateId" is required`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateAssignPermission', '5');
      return expect(validateAssignPermission(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ stateId: '"stateId" is not allowed to be empty' }]);
    });

    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"id" must be GUID`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateAssignPermission', '6');
      return expect(validateAssignPermission(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ 0: '"0" must be a valid GUID' }]);
    });
  });
  describe('helper: Assign permission User ', () => {
    it('should assign view Permission for task management feature', async () => {
      const testData = await getTestData('unit', 'helper', 'assignPermission', '1');
      return expect(assignPermission(testData)).to.be.fulfilled;
    });

    it('should assign create Permission for task management feature', async () => {
      const testData = await getTestData('unit', 'helper', 'assignPermission', '2');
      return expect(assignPermission(testData)).to.be.fulfilled;
    });

    it('should assign update Permission for task management feature', async () => {
      const testData = await getTestData('unit', 'helper', 'assignPermission', '3');
      return expect(assignPermission(testData)).to.be.fulfilled;
    });

    it('should assign Download Permission for task management feature', async () => {
      const testData = await getTestData('unit', 'helper', 'assignPermission', '4');
      return expect(assignPermission(testData)).to.be.fulfilled;
    });

    it('should assign Delete Permission for task management feature', async () => {
      const testData = await getTestData('unit', 'helper', 'assignPermission', '5');
      return expect(assignPermission(testData)).to.be.fulfilled;
    });

    it('should throw "Record Does Not Exist" Error where additionalInfo is an array and includes `"feature" is not define`', async () => {
      const testData = await getTestData('unit', 'helper', 'assignPermission', '6');
      return expect(assignPermission(testData))
        .to.eventually.be.rejectedWith('Feature does not exist')
        .and.be.an.instanceOf(RecordDoesNotExistException.RecordDoesNotExistException)
        .and.has.deep.property('additionalInfo', 'Feature');
    });
  });
});
