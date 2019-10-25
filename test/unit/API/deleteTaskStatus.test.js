const chai = require('chai');
chai.use(require('chai-as-promised'));
const { Delete } = require('../../../api/controllers/TaskStatusSchema');

const { expect } = chai;
const validateTestCase = [1, 2, 3, 4];
const APITestCase = [1, 2];

describe('API: Delete Task Status', () => {
  let getTestData;
  let validateRequest;
  let modelEnableDisable;
  before(() => {
    ({ getTestData } = sails.helpers.tests);
    ({ validateRequest } = sails.helpers.validation.http);
    ({ modelEnableDisable } = sails.helpers.models.crud);
  });
  describe('helper: validateTaskStatusDelete', () => {
    validateTestCase.forEach((arrayEntry) => {
      it(`arrayEntry.text`, async () => {
        const {
          body, error, exception, output,
        } = await getTestData(
          'unit',
          'helper',
          'validateTaskStatusDelete',
          arrayEntry,
        );
        if (error) {
          return expect(validateRequest({ body, schema: Delete.schema }))
            .to.eventually.be.rejectedWith(exception)
            .and.has.deep.property('additionalInfo')
            .which.is.an('array')
            .which.include.deep.members(output);
        }
        return expect(validateRequest({ body, schema: Delete.schema })).to.be.fulfilled;
      });
    });
  });

  describe('helper: Delete Task Status', () => {
    APITestCase.forEach((arrayEntry) => {
      it(`Output of Delete Task Status Test ${arrayEntry}.json`, async () => {
        const {
          body, error, exception, output,
        } = await getTestData(
          'unit',
          'helper',
          'deleteTaskStatus',
          arrayEntry,
        );
        const TaskStatus = await Tasks_status;
        if (error) {
          return expect(modelEnableDisable({ validatedRequest: body, model: TaskStatus }))
            .to.eventually.be.rejectedWith(exception)
            .and.has.deep.property('additionalInfo')
            .which.is.an('array')
            .which.include.deep.members(output);
        }
        return expect(modelEnableDisable({ validatedRequest: body, model: TaskStatus })).to.be
          .fulfilled;
      });
    });
  });
});
