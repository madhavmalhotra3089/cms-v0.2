const chai = require('chai');
chai.use(require('chai-as-promised'));
const { Create } = require('../../../api/controllers/BeneficiarySchema');

const { expect } = chai;
const validateTestCase = [{ testnumber: 1, text: 'Yes' }];
const APITestCase = [1];

describe('API: Beneficiary', () => {
  let getTestData;
  let validateRequest;
  let modelCreate;
  const stateList = {};
  before(() => {
    ({ getTestData } = sails.helpers.tests);
    ({ validateRequest } = sails.helpers.validation.http);
    ({ modelCreate } = sails.helpers.models.crud);
  });
  describe('helper: validateBeneficiaryCreate', () => {
    validateTestCase.forEach((arrayEntry) => {
      it(arrayEntry.text, async () => {
        const {
          body, error, exception, output,
        } = await getTestData(
          'unit',
          'helper',
          'validateBeneficiaryCreate',
          arrayEntry.testnumber,
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

  describe('helper: Create Beneficiary', () => {
    before(async () => {
      (await States.find({ select: ['id', 'name'] })).map(({ id, name }) => {
        stateList[name] = id;
        return 0;
      });
    });
    after((done) => {
      Beneficiaries.destroy({ mobile: '1111111111' })
        .then(done)
        .catch((err) => {
          console.error(err);
          done();
        });
    });

    APITestCase.forEach((arrayEntry) => {
      it(`Output of Create Beneficiary Test ${arrayEntry}.json`, async () => {
        const {
          body, error, exception, output,
        } = await getTestData(
          'unit',
          'helper',
          'createBeneficiary',
          arrayEntry,
        );
        body.state = stateList[body.state];
        const Beneficiary = await Beneficiaries;
        if (error) {
          return expect(modelCreate({ validatedRequest: body, model: Beneficiary }))
            .to.eventually.be.rejectedWith(exception)
            .and.has.deep.property('additionalInfo')
            .which.is.an('array')
            .which.include.deep.members(output);
        }
        return expect(modelCreate({ validatedRequest: body, model: Beneficiary })).to.be.fulfilled;
      });
    });
  });
});
