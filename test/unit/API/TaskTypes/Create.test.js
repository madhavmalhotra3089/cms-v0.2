const chai = require('chai');
chai.use(require('chai-as-promised'));
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const fs = require('fs');
const { createSchema: schema } = require('../../../../api/schemas/TaskTypeSchema');

const { ValidationException } = require('../../../../api/exceptions');

const { expect } = chai;
chai.should();
const validationLoop = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
let validateRequest;

describe('API: create (Task_type)', () => {
  before(async () => {
    ({ getTestData } = sails.helpers.tests);
    ({ checkCycle } = sails.helpers.models.taskTypes);
    ({ validateRequest } = sails.helpers.validation.http);
  });
  describe('Helper: checkCycle', () => {
    let findOneStub;
    let createStub;
    before(() => {
      findOneStub = sinon.stub(Cycles, 'findOne');
      createStub = sinon.stub(Cycles, 'create');
      findOneStub.withArgs({ where: { name: 'existingName' } }).returns({
        id: 'CycleId',
        name: 'existingName',
        description: 'RandomDescription',
      });
      findOneStub.withArgs({ where: { name: 'nonExistingName' } }).returns(undefined);
      createStub.returns({
        fetch: async () => ({
          id: 'CycleId',
          name: 'nonExistingName',
          description: 'RandomDescription',
        }),
      });
    });
    after(() => {
      sinon.restore();
    });
    it('should return cycle id', () => expect(checkCycle('existingName')).to.eventually.have.property('id', 'CycleId'));
    it('findOne should have been called with "existingName"', async () => {
      await checkCycle('existingName');
      return findOneStub.should.have.been.calledWith({ where: { name: 'existingName' } });
    });
    it('should not create cycle', async () => {
      await checkCycle('existingName');
      return createStub.should.not.have.been.called;
    });
    it('should create cycle', async () => {
      await checkCycle('nonExistingName');
      return createStub.should.have.been.called;
    });
  });
  describe('Helper: createTaskType', () => {
    let createStub;
    before(() => {
      createStub = sinon.stub(Task_type, 'create');
      createStub.returns({
        fetch: async () => ({
          id: 'someId',
          name: 'someName',
          description: 'someDescription',
          form: {},
          sla: 'someNumber',
          sequence: 'someNumber',
          state: 'someStateId',
          cycle: 'someCycleId',
        }),
      });
    });
    after(() => {
      sinon.restore();
    });
    it('should call the create method of the Task_type Model', async () => {
      const model = await Task_type;
      await sails.helpers.models.crud.modelCreate({ model, validateRequest: { some: 'data' } });
      return createStub.should.have.been.calledOnce;
    });
  });
  describe('Helper: validateRequest', () => {
    validationLoop.forEach(async (index) => {
      it(`should throw "Validation Error" for fixture ${index}`, async () => {
        // '${Object.values(validationTestData.message)[0]}'
        validationTestData = JSON.parse(
          await fs.readFileSync(`./test/fixtures/unit/helper/validateCreateTaskType/${index}.json`),
        );
        const { body, message } = validationTestData;
        return expect(validateRequest({ body, schema }))
          .to.eventually.be.rejectedWith('Validation Error')
          .and.be.an.instanceOf(ValidationException.ValidationException)
          .and.have.deep.property('additionalInfo')
          .which.is.an('array')
          .which.include.deep.members([
            {
              ...message,
            },
          ]);
      });
    });
  });
});
