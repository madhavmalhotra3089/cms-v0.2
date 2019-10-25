const chai = require('chai');
chai.use(require('chai-as-promised'));
const { FetchOne } = require('../../../api/controllers/BeneficiarySchema');

const { expect } = chai;
const validateTestCase = [1];
const APITestCase = [1, 2];

describe('API: Beneficiary', () => {
  let getTestData;
  let validateRequest;
  let modelFetchOne;
  before(() => {
    ({ getTestData } = sails.helpers.tests);
    ({ validateRequest } = sails.helpers.validation.http);
    ({ modelFetchOne } = sails.helpers.models.crud);
  });
  describe('helper: validateFetchOneBeneficiaries', () => {
    validateTestCase.forEach((arrayEntry) => {
      it(`Output of validate Enale Disable Beneficiary Test ${arrayEntry}.json`, async () => {
        const {
          body, error, exception, output,
        } = await getTestData(
          'unit',
          'helper',
          'validateFetchOneBeneficiaries',
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

  describe('helper: fetchOneBeneficiaries', () => {
    APITestCase.forEach((arrayEntry) => {
      it(`Output of Enale Disable Beneficiary Test ${arrayEntry}.json`, async () => {
        const {
          body, error, exception, output,
        } = await getTestData(
          'unit',
          'helper',
          'fetchOneBeneficiaries',
          arrayEntry,
        );
        const Beneficiary = await Beneficiaries;
        if (error) {
          return expect(modelFetchOne({ validatedRequest: body, model: Beneficiary }))
            .to.eventually.be.rejectedWith(exception)
            .and.has.deep.property('additionalInfo', output);
        }
        return expect(modelFetchOne({ validatedRequest: body, model: Beneficiary })).to.be
          .fulfilled;
      });
    });
  });
});
