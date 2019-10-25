const chai = require('chai');
chai.use(require('chai-as-promised'));
const { Delete } = require('../../../api/controllers/BeneficiarySchema');

const { expect } = chai;
const validateTestCase = [1, 2];
const APITestCase = [1, 2];

describe('API: Beneficiary', () => {
  let getTestData;
  let validateRequest;
  let modelEnableDisable;
  before(() => {
    ({ getTestData } = sails.helpers.tests);
    ({ validateRequest } = sails.helpers.validation.http);
    ({ modelEnableDisable } = sails.helpers.models.crud);
  });
  describe('helper: validateEnableDisableBeneficiaries', () => {
    validateTestCase.forEach((arrayEntry) => {
      it(`Output of validate Enale Disable Beneficiary Test ${arrayEntry}.json`, async () => {
        const {
          body, error, exception, output,
        } = await getTestData(
          'unit',
          'helper',
          'validateEnableDisableBeneficiaries',
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

  describe('helper: Enale Disable Beneficiary', () => {
    APITestCase.forEach((arrayEntry) => {
      it(`Output of Enale Disable Beneficiary Test ${arrayEntry}.json`, async () => {
        const {
          body, error, exception, output,
        } = await getTestData(
          'unit',
          'helper',
          'enableDisableBeneficiaries',
          arrayEntry,
        );
        const Beneficiary = await Beneficiaries;
        if (error) {
          return expect(modelEnableDisable({ validatedRequest: body, model: Beneficiary }))
            .to.eventually.be.rejectedWith(exception)
            .and.has.deep.property('additionalInfo')
            .which.is.an('array')
            .which.include.deep.members(output);
        }
        return expect(modelEnableDisable({ validatedRequest: body, model: Beneficiary })).to.be
          .fulfilled;
      });
    });
  });
});
