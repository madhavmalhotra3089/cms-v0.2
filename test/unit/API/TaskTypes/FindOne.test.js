const chai = require('chai');
chai.use(require('chai-as-promised'));

const { findOneSchema: schema } = require('../../../../api/schemas/TaskTypeSchema');
const { validationException } = require('../../../../api/exceptions');

const { expect } = chai;

const looper = [1, 2];

describe('API: findOne (Task Type)', () => {
  before(() => {
    ({ validateRequest } = sails.helpers.validation.http);
    ({ getTestData } = sails.helpers.tests);
  });
});
