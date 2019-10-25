const chai = require('chai');
chai.use(require('chai-as-promised'));
const { Create } = require('../../../api/controllers/TaskStatusSchema');

const { expect } = chai;
const validateTestCase = [1, 2, 3, 4, 5, 6, 7];
const APITestCase = [1];

describe('API: Create Task Status', () => {
  let getTestData;
  let validateRequest;
  let modelCreate;
  const stateList = {};
  before(() => {
    ({ getTestData } = sails.helpers.tests);
    ({ validateRequest } = sails.helpers.validation.http);
    ({ modelCreate } = sails.helpers.models.crud);
  });
  describe('helper: validateTaskStatusCreate', () => {
    validateTestCase.forEach((arrayEntry) => {
      it(`arrayEntry.text`, async () => {
        const {
          body, error, exception, output,
        } = await getTestData(
          'unit',
          'helper',
          'validateTaskStatusCreate',
          arrayEntry,
        );
        if (error) {
          return expect(validateRequest({ body, schema: Create.schema }))
            .to.eventually.be.rejectedWith(exception)
            .and.has.deep.property('additionalInfo')
            .which.is.an('array')
            .which.include.deep.members(output);
        }
        return expect(validateRequest({ body, schema: Create.schema })).to.be.fulfilled;
      });
    });
  });

  describe('helper: Create Task Status', () => {
    before(async () => {
      (await States.find({ select: ['id', 'name'] })).map(({ id, name }) => {
        stateList[name] = id;
        return 0;
      });
    });
    after((done) => {
      Tasks_status.destroy({ name: 'Abhi' })
        .then(done)
        .catch((err) => {
          console.error(err);
          done();
        });
    });

    APITestCase.forEach((arrayEntry) => {
      it(`Output of Create Task Status Test ${arrayEntry}.json`, async () => {
        const {
          body, error, exception, output,
        } = await getTestData(
          'unit',
          'helper',
          'createTaskStatus',
          arrayEntry,
        );
        body.state = stateList[body.state];
        const TaskStatus = await Tasks_status;
        if (error) {
          return expect(modelCreate({ validatedRequest: body, model: TaskStatus }))
            .to.eventually.be.rejectedWith(exception)
            .and.has.deep.property('additionalInfo')
            .which.is.an('array')
            .which.include.deep.members(output);
        }
        return expect(modelCreate({ validatedRequest: body, model: TaskStatus })).to.be.fulfilled;
      });
    });
  });
});
