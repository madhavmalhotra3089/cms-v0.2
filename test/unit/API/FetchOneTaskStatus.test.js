const chai = require('chai');
chai.use(require('chai-as-promised'));
const { FetchOne } = require('../../../api/controllers/TaskStatusSchema');

const { expect } = chai;
const validateTestCase = [1];
const APITestCase = [1];

describe('API: FetchOne Task Status', () => {
  let getTestData;
  let validateRequest;
  let modelFetchOne;
  before(() => {
    ({ getTestData } = sails.helpers.tests);
    ({ validateRequest } = sails.helpers.validation.http);
    ({ modelFetchOne } = sails.helpers.models.crud);
  });
  describe('helper: validateTaskStatusFetchOne', () => {
    validateTestCase.forEach((arrayEntry) => {
      it(`arrayEntry.text`, async () => {
        const {
          body, error, exception, output,
        } = await getTestData(
          'unit',
          'helper',
          'validateTaskStatusFetchOne',
          arrayEntry,
        );
        if (error) {
          return expect(validateRequest({ body, schema: FetchOne.schema }))
            .to.eventually.be.rejectedWith(exception)
            .and.has.deep.property('additionalInfo')
            .which.is.an('array')
            .which.include.deep.members(output);
        }
        return expect(validateRequest({ body, schema: FetchOne.schema })).to.be.fulfilled;
      });
    });
  });

  describe('helper: FetchOne Task Status', () => {
    APITestCase.forEach((arrayEntry) => {
      it(`Output of FetchOne Task Status Test ${arrayEntry}.json`, async () => {
        const {
          body, error, exception, output,
        } = await getTestData(
          'unit',
          'helper',
          'fetchOneTaskStatus',
          arrayEntry,
        );
        const TaskStatus = await Tasks_status;
        if (error) {
          return expect(modelFetchOne({ validatedRequest: body, model: TaskStatus }))
            .to.eventually.be.rejectedWith(exception)
            .and.has.deep.property('additionalInfo')
            .which.is.an('array')
            .which.include.deep.members(output);
        }
        return expect(modelFetchOne({ validatedRequest: body, model: TaskStatus })).to.be.fulfilled;
      });
    });
  });
});
