const chai = require('chai');
chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
const { findAllSchema: schema } = require('../../../../api/schemas/TaskTypeSchema');
const { ValidationException } = require('../../../../api/exceptions');

const { expect } = chai;
chai.should();

let validateRequest;
let filterTaskTypes;
let getTestData;

looper = [1, 2, 3, 4, 5, 6, 7, 8, 9];

describe('API: FindAll (Task Type)', () => {
  before(() => {
    ({ validateRequest } = sails.helpers.validation.http);
    ({ getTestData } = sails.helpers.tests);
    ({ filterTaskTypes } = sails.helpers.models.taskTypes);
  });
  describe('Helper: ValidateRequest', () => {
    looper.forEach(async (index) => {
      it(`should throw "Validation Error" for fixture ${index}`, async () => {
        validationTestData = await getTestData('unit', 'helper', 'validateFindAllTaskTypes', index);
        const { body, message } = validationTestData;
        return expect(validateRequest({ body, schema }))
          .to.eventually.be.rejectedWith('Validation Error')
          .and.be.an.instanceOf(ValidationException.ValidationException)
          .and.have.deep.property('additionalInfo')
          .which.is.an('array')
          .which.include.deep.members([{ ...message }]);
      });
    });
  });
  describe('Helper: filterTaskTypes', () => {
    const states = {};
    const cycles = {};
    before(async () => {
      (await States.find({ select: ['id', 'name'] })).map(({ id, name }) => {
        states[name] = id;
        return 0;
      });
      (await Cycles.find({ select: ['id', 'name'] })).map(({ id, name }) => {
        cycles[name] = id;
        return 0;
      });
    });
    it('should have Total Count = 5', async () => {
      testData = await getTestData('unit', 'helper', 'filterTaskTypes', '1');
      return expect(filterTaskTypes(testData)).to.eventually.have.property('total', '5');
    });
    it('should have length of data = 3', async () => {
      testData = await getTestData('unit', 'helper', 'filterTaskTypes', '1');
      return expect(filterTaskTypes(testData))
        .to.eventually.have.property('data')
        .which.has.lengthOf(3);
    });
    it('should have next link', async () => {
      testData = await getTestData('unit', 'helper', 'filterTaskTypes', '1');
      return expect(filterTaskTypes(testData))
        .to.eventually.have.property('links')
        .which.has.deep.property('next');
    });
    it('should have Total count = 5', async () => {
      testData = await getTestData('unit', 'helper', 'filterTaskTypes', '2');
      return expect(filterTaskTypes(testData)).to.eventually.have.property('total', '5');
    });
    it('should have length of data = 2', async () => {
      testData = await getTestData('unit', 'helper', 'filterTaskTypes', '2');
      return expect(filterTaskTypes(testData))
        .to.eventually.have.property('data')
        .which.has.lengthOf(2);
    });
    it('should have Total count = 5', async () => {
      testData = await getTestData('unit', 'helper', 'filterTaskTypes', '2');
      return expect(filterTaskTypes(testData))
        .to.eventually.have.property('links')
        .which.has.deep.property('next', undefined);
    });
    it('should have Total count = 5', async () => {
      testData = await getTestData('unit', 'helper', 'filterTaskTypes', '3');
      return expect(filterTaskTypes(testData)).to.eventually.have.property('total', '5');
    });
    it('should have length of data = 5', async () => {
      testData = await getTestData('unit', 'helper', 'filterTaskTypes', '3');
      return expect(filterTaskTypes(testData))
        .to.eventually.have.property('data')
        .which.has.lengthOf(5);
    });
    it('should have Total count = 5', async () => {
      testData = await getTestData('unit', 'helper', 'filterTaskTypes', '3');
      return expect(filterTaskTypes(testData))
        .to.eventually.have.property('links')
        .which.has.deep.property('next', null);
    });
    it('should have Total count = 2', async () => {
      testData = await getTestData('unit', 'helper', 'filterTaskTypes', '4');
      return expect(filterTaskTypes(testData)).to.eventually.have.property('total', '2');
    });
    it('should have Total count = 1', async () => {
      testData = await getTestData('unit', 'helper', 'filterTaskTypes', '5');
      return expect(filterTaskTypes(testData)).to.eventually.have.property('total', '1');
    });
    it('should have Total count = 2', async () => {
      testData = await getTestData('unit', 'helper', 'filterTaskTypes', '6');
      testData.state = states[testData.state];
      return expect(filterTaskTypes(testData)).to.eventually.have.property('total', '2');
    });
    it('should have Total count = 1', async () => {
      testData = await getTestData('unit', 'helper', 'filterTaskTypes', '7');
      testData.state = states[testData.state];
      return expect(filterTaskTypes(testData)).to.eventually.have.property('total', '1');
    });
    it('should have Total count = 2', async () => {
      testData = await getTestData('unit', 'helper', 'filterTaskTypes', '8');
      testData.cycle = cycles[testData.cycle];
      return expect(filterTaskTypes(testData)).to.eventually.have.property('total', '2');
    });
    it('should have Total count = 1', async () => {
      testData = await getTestData('unit', 'helper', 'filterTaskTypes', '9');
      testData.cycle = cycles[testData.cycle];
      return expect(filterTaskTypes(testData)).to.eventually.have.property('total', '1');
    });
    it('should have Total count = 1', async () => {
      testData = await getTestData('unit', 'helper', 'filterTaskTypes', '10');
      testData.cycle = cycles[testData.cycle];
      return expect(filterTaskTypes(testData)).to.eventually.have.property('total', '1');
    });
    it('should have Total count = 1', async () => {
      testData = await getTestData('unit', 'helper', 'filterTaskTypes', '11');
      testData.state = states[testData.state];
      return expect(filterTaskTypes(testData)).to.eventually.have.property('total', '1');
    });
    it('should have Total count = 0', async () => {
      testData = await getTestData('unit', 'helper', 'filterTaskTypes', '12');
      return expect(filterTaskTypes(testData)).to.eventually.have.property('total', '0');
    });
  });
});
