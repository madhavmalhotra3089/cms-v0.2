const chai = require('chai');
chai.use(require('chai-as-promised'));

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const { FormioException } = require('../../../../api/exceptions');

const { expect } = chai;

describe('API: deleteForm', () => {
  let del;

  before(() => {
    ({ del } = sails.helpers.formio.requests);
  });
  describe('Helper: del', () => {
    beforeEach(() => {
      mock = new MockAdapter(axios);
    });
    afterEach(() => {
      mock.reset();
      mock.restore();
    });
    it('should delete form', () => {
      mock.onDelete('/form').reply(200, {
        data: 'Form Schema here',
      });
      return expect(del('token', '/form')).to.eventually.be.fulfilled;
    });
    it('should throw "FormioException" with message "Resource not found"', () => {
      mock.onDelete('/form').reply(400, 'Resource not found');
      return expect(del('token', '/form'))
        .to.eventually.be.rejectedWith('Resource not found')
        .and.be.an.instanceOf(FormioException.FormioException)
        .and.have.deep.property('additionalInfo')
        .which.has.a.property('status', 404);
    });
  });
});
