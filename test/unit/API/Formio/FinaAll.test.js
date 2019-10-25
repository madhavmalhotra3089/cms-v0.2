const chai = require('chai');
chai.use(require('chai-as-promised'));

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { FormioException } = require('../../../../api/exceptions');

const { expect } = chai;
chai.should();

describe('API: findAll', () => {
  let prepareParams;
  let get;
  let getTestData;
  let mock;

  before(() => {
    ({ prepareParams } = sails.helpers.formio.forms);
    ({ get } = sails.helpers.formio.requests);
    ({ getTestData } = sails.helpers.tests);
  });
  describe('Helper: prepareParams', () => {
    it('should return the correct transformed values for title__regex', async () => {
      const testData = await getTestData('unit', 'helper', 'prepareParams', '1');
      return expect(prepareParams(testData)).to.eventually.have.property(
        'title__regex',
        '/Regis/i',
      );
    });
    it('should return the correct transformed values for name__regex', async () => {
      const testData = await getTestData('unit', 'helper', 'prepareParams', '1');
      return expect(prepareParams(testData)).to.eventually.have.property('name__regex', '/^del/i');
    });
    it('should return the correct transformed values for owner__regex', async () => {
      const testData = await getTestData('unit', 'helper', 'prepareParams', '1');
      return expect(prepareParams(testData)).to.eventually.have.property(
        'owner__regex',
        '/^supp/i',
      );
    });
  });
  describe('Helper: get', () => {
    beforeEach(() => {
      mock = new MockAdapter(axios);
    });
    afterEach(() => {
      mock.reset();
      mock.restore();
    });
    it('should return data', () => {
      mock.onGet('/form').reply(200, {
        form: 'here',
      });
      return expect(get('token', { params: 'forms' }, '/form')).to.eventually.be.fulfilled;
    });
    it('should throw "FormioException" with status code 404', () => {
      mock.onGet('/form').reply(400, {
        form: 'here',
      });
      return expect(get('token', { params: 'forms' }, '/form'))
        .to.eventually.be.rejected.and.be.an.instanceOf(FormioException.FormioException)
        .and.have.deep.property('additionalInfo')
        .which.has.property('status', 404);
    });
    it('should throw "FormioException" with status code 416', () => {
      mock.onGet('/form').reply(416, {
        form: 'here',
      });
      return expect(get('token', { params: 'forms' }, '/form'))
        .to.eventually.be.rejected.and.be.an.instanceOf(FormioException.FormioException)
        .and.have.deep.property('additionalInfo')
        .which.has.property('status', 416);
    });
    it('should throw "FormioException" with status code 500', () => {
      mock.onGet('/form').reply(451, {
        form: 'here',
      });
      return expect(get('token', { params: 'forms' }, '/form'))
        .to.eventually.be.rejected.and.be.an.instanceOf(FormioException.FormioException)
        .and.have.deep.property('additionalInfo')
        .which.has.property('status', 500);
    });
  });
});
