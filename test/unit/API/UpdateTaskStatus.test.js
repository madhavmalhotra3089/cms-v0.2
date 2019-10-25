const chai = require('chai');
chai.use(require('chai-as-promised'));
const { Update } = require('../../../api/controllers/TaskStatusSchema');

const { expect } = chai;
const validateTestCase = [1, 2, 3, 4, 5, 6];
const APITestCase = [1];

describe('API: Update Task Status', () => {
  let getTestData;
  let validateRequest;
  let modelUpdate;
  const stateList = {};
  before(() => {
    ({ getTestData } = sails.helpers.tests);
    ({ validateRequest } = sails.helpers.validation.http);
    ({ modelUpdate } = sails.helpers.models.crud);
  });
  describe('helper: validateTaskStatusUpdate', () => {
    validateTestCase.forEach((arrayEntry) => {
      it(`arrayEntry.text`, async () => {
        const {
          body, error, exception, output,
        } = await getTestData(
          'unit',
          'helper',
          'validateTaskStatusUpdate',
          arrayEntry,
        );
        if (error) {
          return expect(validateRequest({ body, schema: Update.schema }))
            .to.eventually.be.rejectedWith(exception)
            .and.has.deep.property('additionalInfo')
            .which.is.an('array')
            .which.include.deep.members(output);
        }
        return expect(validateRequest({ body, schema: Update.schema })).to.be.fulfilled;
      });
    });
  });

  describe('helper: Update Task Status', () => {
    before(async () => {
      (await States.find({ select: ['id', 'name'] })).map(({ id, name }) => {
        stateList[name] = id;
        return 0;
      });
    });

    APITestCase.forEach((arrayEntry) => {
      it(`Output of Update Task Status Test ${arrayEntry}.json`, async () => {
        const {
          body, error, exception, output,
        } = await getTestData(
          'unit',
          'helper',
          'UpdateTaskStatus',
          arrayEntry,
        );
        body.state = stateList[body.state];
        const TaskStatus = await Tasks_status;
        if (error) {
          return expect(modelUpdate({ validatedRequest: body, Model: TaskStatus }))
            .to.eventually.be.rejectedWith(exception)
            .and.has.deep.property('additionalInfo')
            .which.is.an('array')
            .which.include.deep.members(output);
        }
        return expect(modelUpdate({ validatedRequest: body, Model: TaskStatus })).to.be.fulfilled;
      });
    });
  });
});
