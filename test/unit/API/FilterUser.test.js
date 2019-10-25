const chai = require('chai');
chai.use(require('chai-as-promised'));
// const sinon = require('sinon');
const { RecordDoesNotExistException, ValidationException } = require('../../../api/exceptions');

const { expect } = chai;
// ############################################################################################ \\
// ##          Test fixtures for state and features are their names instead of id's          ## \\
// ##          which are the actual parameters needed by the function and the input          ## \\
// ## coming from the FrontEnd. This is done for the purpose of compatibility in any system. ## \\
// ##         The state and feature names are mapped to their id's before each test.         ## \\
// ############################################################################################ \\
describe('API: FilterUsers', () => {
  let validateFilterUsers;
  let filterUsers;
  // let getFeaturesAndPermissions;
  let getTestData;
  const stateList = {};
  const featureList = {};
  before(() => {
    ({ validateFilterUsers } = sails.helpers.validation.http.users);
    ({ filterUsers, getFeaturesAndPermissions } = sails.helpers.models.users);
    ({ getTestData } = sails.helpers.tests);
  });
  describe('Helper: validateFilterUsers', () => {
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"name" must be a string`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateFilterUsers', '1');
      return expect(validateFilterUsers(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ name: '"name" must be a string' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"name" with value "*[entered name]*" fails to match the cannot begin with whitespace pattern`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateFilterUsers', '2');
      return expect(validateFilterUsers(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([
          {
            name: `"name" with value "${testData.name}" fails to match the cannot begin with whitespace pattern`,
          },
        ]);
    });
    // Could possible be used to guard against SQL injection attack
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"name" must only contain alpha-numeric characters`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateFilterUsers', '3');
      return expect(validateFilterUsers(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([
          { name: '"name" must only contain alpha-numeric characters' },
        ]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"email" must be a string`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateFilterUsers', '4');
      return expect(validateFilterUsers(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ email: '"email" must be a string' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" must be a string`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateFilterUsers', '5');
      return expect(validateFilterUsers(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ mobile: '"mobile" must be a string' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" with value "*[entered mobile number]*" fails to match the cannot start with zero pattern`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateFilterUsers', '6');
      return expect(validateFilterUsers(testData))
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
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"deleted" must be one of [true, false]`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateFilterUsers', '7');
      return expect(validateFilterUsers(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ deleted: '"deleted" must be one of [true, false]' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"states" must be a valid GUID`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateFilterUsers', '8');
      return expect(validateFilterUsers(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ states: '"states" must be a valid GUID' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"features" must be a valid GUID`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateFilterUsers', '10');
      return expect(validateFilterUsers(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ features: '"features" must be a valid GUID' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"page_size" must be a string`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateFilterUsers', '12');
      return expect(validateFilterUsers(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ page_size: '"page_size" must be a string' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"page_size" with value "*[entered page_size]*" fails to match the has to be number pattern`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateFilterUsers', '13');
      return expect(validateFilterUsers(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([
          {
            page_size: `"page_size" with value "${testData.page_size}" fails to match the has to be number pattern`,
          },
        ]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"after" with value "*[entered after]*" fails to match the Continuation Token pattern`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateFilterUsers', '14');
      return expect(validateFilterUsers(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([
          {
            after: `"after" with value "${testData.after}" fails to match the Continuation Token pattern`,
          },
        ]);
    });
    it('should throw "Validation Error" tests against SQL injection', async () => {
      const testData = await getTestData('unit', 'helper', 'validateFilterUsers', '15');
      return expect(validateFilterUsers(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([
          {
            page_size: `"page_size" with value "${testData.page_size}" fails to match the has to be number pattern`,
          },
          {
            after: `"after" with value "${testData.after}" fails to match the Continuation Token pattern`,
          },
          {
            states: `"states" must be a valid GUID`,
          },
          {
            features: `"features" must be a valid GUID`,
          },
          {
            deleted: `"deleted" must be one of [true, false]`,
          },
          {
            name: `"name" must only contain alpha-numeric characters`,
          },
          {
            mobile: `"mobile" with value "${testData.mobile}" fails to match the numbers pattern`,
          },
          {
            mobile: `"mobile" with value "${testData.mobile}" fails to match the cannot start with zero pattern`,
          },
        ]);
    });
  });
  describe('Helper: filterUsers', () => {
    before(async () => {
      (await States.find({ select: ['id', 'name'] })).map(({ id, name }) => {
        stateList[name] = id;
        return 0;
      });
      (await Features.find({ select: ['id', 'name'] })).map(({ id, name }) => {
        featureList[name] = id;
        return 0;
      });
    });
    it('Should give outcome with count of 2 FOR name = "test" AND state = idOf("Goa")', async () => {
      const testData = await getTestData('unit', 'helper', 'filterUsers', '1');
      testData.states = stateList[testData.states];
      return expect(filterUsers(testData)).to.eventually.have.property('total', '2');
    });
    it('Should give outcome with count of 7 FOR name = "test" AND features = idOf("Chatbot Management")', async () => {
      const testData = await getTestData('unit', 'helper', 'filterUsers', '2');
      testData.features = featureList[testData.features];
      return expect(filterUsers(testData)).to.eventually.have.property('total', '7');
    });
    it('Should give outcome with count of 22 FOR name = "test" AND states = idOf("Uttarakhand") AND features = idOf("Missed Call Assignment")', async () => {
      const testData = await getTestData('unit', 'helper', 'filterUsers', '3');
      testData.states = stateList[testData.states];
      testData.features = featureList[testData.features];
      return expect(filterUsers(testData)).to.eventually.have.property('total', '22');
    });
    it('Should give outcome with count of 1 FOR name = "test" AND states = idOf("Chhattisgarh") AND features = idOf("Chatbot Management")', async () => {
      const testData = await getTestData('unit', 'helper', 'filterUsers', '4');
      testData.states = stateList[testData.states];
      testData.features = featureList[testData.features];
      return expect(filterUsers(testData)).to.eventually.have.property('total', '1');
    });
    it('Should give outcome with count of 0 FOR name = "test" AND deleted = "true"', async () => {
      const testData = await getTestData('unit', 'helper', 'filterUsers', '5');
      return expect(filterUsers(testData)).to.eventually.have.property('total', '0');
    });
    it('Should give outcome with count of 2 FOR name = "test" AND states = [idOf("Goa")', async () => {
      const testData = await getTestData('unit', 'helper', 'filterUsers', '6');
      testData.states = stateList[testData.states];
      return expect(filterUsers(testData)).to.eventually.have.property('total', '2');
    });
    it('Should give outcome with count of 7 FOR name = "test" AND features = idOf("Chatbot Management")', async () => {
      const testData = await getTestData('unit', 'helper', 'filterUsers', '7');
      testData.features = featureList[testData.features];
      return expect(filterUsers(testData)).to.eventually.have.property('total', '7');
    });
    it(`Should give outcome with count of 2 FOR name = "test" AND states = idOf("Chhattisgarh") AND features = idOf("Form Management")`, async () => {
      const testData = await getTestData('unit', 'helper', 'filterUsers', '8');
      testData.states = stateList[testData.states];
      testData.features = featureList[testData.features];
      return expect(filterUsers(testData)).to.eventually.have.property('total', '2');
    });
    it('Should throw "RecordDoesNotExistException" with message "State does not exists" FOR name = "test" AND states = "f8570ba1-9f70-4280-9d45-9b75d664735b"', async () => {
      const testData = await getTestData('unit', 'helper', 'filterUsers', '9');
      return expect(filterUsers(testData))
        .to.eventually.be.rejectedWith('State does not exist')
        .and.be.an.instanceOf(RecordDoesNotExistException.RecordDoesNotExistException);
    });
    it('Should throw "RecordDoesNotExistException" with message "Feature does not exists" FOR name = "test" AND features = "c0641dac-6e01-433c-a1ca-5da1e1255cc6"', async () => {
      const testData = await getTestData('unit', 'helper', 'filterUsers', '10');
      return expect(filterUsers(testData))
        .to.eventually.be.rejectedWith('Feature does not exist')
        .and.be.an.instanceOf(RecordDoesNotExistException.RecordDoesNotExistException);
    });
  });
});
