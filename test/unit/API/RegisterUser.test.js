const chai = require('chai');
chai.use(require('chai-as-promised'));
const { RecordAlreadyExistsException, ValidationException } = require('../../../api/exceptions');

const { expect } = chai;

describe('API: Register', () => {
  let getTestData;
  let createUser;
  let validateUserCreate;
  before(() => {
    ({ getTestData } = sails.helpers.tests);
    ({ createUser } = sails.helpers.models.users);
    ({ validateUserCreate } = sails.helpers.validation.http.users);
  });
  describe('helper: validateUserCreate', () => {
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"name" must be a string`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateUserCreate', '1');
      return expect(validateUserCreate(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ name: '"name" must be a string' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"email" is required`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateUserCreate', '2');
      return expect(validateUserCreate(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ email: '"email" is required' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"email" must be a string`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateUserCreate', '3');
      return expect(validateUserCreate(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ email: '"email" must be a string' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"email" must be a valid email`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateUserCreate', '4');
      return expect(validateUserCreate(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ email: '"email" must be a valid email' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" is required`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateUserCreate', '5');
      return expect(validateUserCreate(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ mobile: '"mobile" is required' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" must be a string`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateUserCreate', '6');
      return expect(validateUserCreate(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ mobile: '"mobile" must be a string' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" length must be 10 characters long`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateUserCreate', '7');
      return expect(validateUserCreate(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ mobile: '"mobile" length must be 10 characters long' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"mobile" with value "*[entered mobile number]*" fails to match the cannot start with zero pattern`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateUserCreate', '8');
      return expect(validateUserCreate(testData))
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
      const testData = await getTestData('unit', 'helper', 'validateUserCreate', '9');
      return expect(validateUserCreate(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ password: '"password" is required' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"password" must be a string`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateUserCreate', '10');
      return expect(validateUserCreate(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ password: '"password" must be a string' }]);
    });
    it('should throw "Validation Error" Error where additionalInfo is an array and includes `"password" length must be at least 6 characters long`', async () => {
      const testData = await getTestData('unit', 'helper', 'validateUserCreate', '11');
      return expect(validateUserCreate(testData))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.be.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([
          { password: '"password" length must be at least 6 characters long' },
        ]);
    });
  });
  describe('helper: createUser', () => {
    after((done) => {
      Users.destroy({ email: { contains: '@alphabets.org' } })
        .then(done)
        .catch((err) => {
          console.error(err);
          done();
        });
    });
    it('should create a new user', async () => {
      const testData = await getTestData('unit', 'helper', 'createUser', '1');
      return expect(createUser(testData)).to.be.fulfilled;
    });
    it('should create a new user without a name', async () => {
      const testData = await getTestData('unit', 'helper', 'createUser', '2');
      expect(testData.name).to.equal(undefined);
      return expect(createUser(testData)).to.be.fulfilled;
    });
    it('should throw "User already exists" Error (with email true and mobile false) for email already registered', async () => {
      const testData = await getTestData('unit', 'helper', 'createUser', '3');
      return expect(createUser(testData))
        .to.eventually.be.rejectedWith('User already exists')
        .and.be.an.instanceOf(RecordAlreadyExistsException.RecordAlreadyExistsException)
        .and.has.deep.property('additionalInfo', { email: true, mobile: false });
    });
    it('should throw "User already exists" Error (with email false and mobile true) for mobile already registered', async () => {
      const testData = await getTestData('unit', 'helper', 'createUser', '4');
      return expect(createUser(testData))
        .to.eventually.be.rejectedWith('User already exists')
        .and.be.an.instanceOf(RecordAlreadyExistsException.RecordAlreadyExistsException)
        .and.has.deep.property('additionalInfo', { email: false, mobile: true });
    });
    it('should throw "User already exists" Error (with email and mobile both true) for email and mobile already registered by a single user', async () => {
      const testData = await getTestData('unit', 'helper', 'createUser', '1');
      return expect(createUser(testData))
        .to.eventually.be.rejectedWith('User already exists')
        .and.be.an.instanceOf(RecordAlreadyExistsException.RecordAlreadyExistsException)
        .and.has.deep.property('additionalInfo', { email: true, mobile: true });
    });
    it('should throw "User already exists" Error (with additionalInfo = "Both email and mobile are registered to two different users") for email and mobile already registered by a different users', async () => {
      const testData = await getTestData('unit', 'helper', 'createUser', '5');
      return expect(createUser(testData))
        .to.eventually.be.rejectedWith('User already exists')
        .and.be.an.instanceOf(RecordAlreadyExistsException.RecordAlreadyExistsException)
        .and.has.deep.property(
          'additionalInfo',
          'Both email and mobile are registered to two different users',
        );
    });
  });
});
