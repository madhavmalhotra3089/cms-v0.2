const chai = require('chai');
chai.use(require('chai-as-promised'));

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const { FormioException } = require('../../../../api/exceptions');

const { expect } = chai;

describe('API: update', () => {
  let put;

  before(() => {
    ({ put } = sails.helpers.formio.requests);
  });
  describe('Helper: put', () => {
    beforeEach(() => {
      mock = new MockAdapter(axios);
    });
    afterEach(() => {
      mock.reset();
      mock.restore();
    });
    it('should put to formio', () => {
      mock.onPut('/form').reply(200, {
        data: 'Form Schema here',
      });
      return expect(put('token', { schema: 'form' }, '/form')).to.eventually.be.fulfilled;
    });
    it('should throw "FormioException" with message "Unable to Update Form"', () => {
      mock.onPut('/form').reply(400, {
        errors: [{ path: 'name', message: 'name must be unique' }],
      });
      return expect(put('token', { schema: 'schema here' }, '/form'))
        .to.eventually.be.rejectedWith('Unable to Update Form')
        .and.be.an.instanceOf(FormioException.FormioException)
        .and.have.deep.property('additionalInfo')
        .which.has.a.property('status', 409);
    });
    it('should throw "FormioException" with message "Resource not found"', () => {
      mock.onPut('/form').reply(400, 'Resource not found');
      return expect(put('token', { schema: 'schema here' }, '/form'))
        .to.eventually.be.rejectedWith('Resource not found')
        .and.be.an.instanceOf(FormioException.FormioException)
        .and.have.deep.property('additionalInfo')
        .which.has.a.property('status', 404);
    });
  });
});
