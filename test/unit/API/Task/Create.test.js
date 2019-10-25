const supertest = require('supertest');
const chai = require('chai');

const { expect } = chai;

const validateTestCase = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
describe('TasksController.create', () => {
  describe('#create()', () => {
    before(() => {
      ({ getTestData } = sails.helpers.tests);
    });

    validateTestCase.forEach((arrayEntry) => {
      it(`Output of validate Create Task Test ${arrayEntry}.json`, async () => {
        const {
          body, error, exception, output,
        } = await getTestData(
          'unit',
          'helper',
          'validateCreateTask',
          arrayEntry,
        );
        if (error) {
          return supertest(sails.hooks.http.app)
            .post('/tasks/')
            .send(body)
            .expect(400)
            .expect((res) => {
              expect(res.body)
                .to.have.deep.property('additionalInfo')
                .which.is.an('array')
                .which.includes.deep.members(output);
            });
        }
        return supertest(sails.hooks.http.app)
          .post('/tasks/')
          .send(body)
          .expect(200);
      });
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
