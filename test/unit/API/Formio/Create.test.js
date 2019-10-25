const chai = require('chai');
chai.use(require('chai-as-promised'));
const sinon = require('sinon');
chai.use(require('sinon-chai'));

const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { ValidationException, FormioException } = require('../../../../api/exceptions');

const { expect } = chai;
chai.should();

describe('API: create', () => {
  let getToken;
  let prepareSchema;
  let post;
  let getTestData;
  let mock;

  before(() => {
    ({ getToken } = sails.helpers.formio);
    ({ prepareSchema } = sails.helpers.formio.forms);
    ({ post } = sails.helpers.formio.requests);
    ({ getTestData } = sails.helpers.tests);
  });

  describe('Helper: getToken', () => {
    after(() => {
      mock.restore();
      mock.reset();
    });

    it('should return a token', () => expect(getToken()).to.eventually.be.fulfilled.and.to.be.a('string'));

    it('should throw an "FormioException" if credentials are wrong', () => {
      mock = new MockAdapter(axios);
      mock.onPost('/user/login').reply(401, {
        hello: 'world',
      });
      return expect(getToken())
        .to.be.eventually.be.rejectedWith('Formio authentication error')
        .and.be.an.instanceOf(FormioException.FormioException)
        .and.have.deep.property('additionalInfo')
        .which.is.a('object');
    });
  });

  describe('Helper: prepareSchema', () => {
    before(() => {
      mock = new MockAdapter(axios);
      mock.onGet('/role').reply(200, [
        {
          title: 'Anonymous',
          _id: '123sojdsf43oirj2e',
        },
        {
          title: 'Administrator',
          _id: 'aljsd3j2423kjhkjd',
        },
      ]);
    });

    after(() => {
      mock.restore();
      mock.reset();
    });

    it('should set name, owner and path properly', async () => {
      testData = await getTestData('unit', 'helper', 'prepareSchema', '1');
      req = {
        allParams: () => 0,
        session: {
          user: { ...testData.user },
        },
      };
      sinon.stub(req, 'allParams').returns({ ...testData.req });
      t1 = expect(prepareSchema(testData.token, req)).to.eventually.be.fulfilled;
      t2 = expect(prepareSchema(testData.token, req)).to.eventually.have.deep.property(
        'name',
        'madhyaPradesh-registerStudent',
      );
      t3 = expect(prepareSchema(testData.token, req)).to.eventually.have.deep.property(
        'owner',
        'world@war.com',
      );
      t4 = expect(prepareSchema(testData.token, req)).to.eventually.have.deep.property(
        'path',
        'madhyaPradesh/registerStudent',
      );
      // return t1, t2, t3, t4;
    });

    it('should set owner to mobile number', async () => {
      testData = await getTestData('unit', 'helper', 'prepareSchema', '2');
      req = {
        allParams: () => 0,
        session: {
          user: { ...testData.user },
        },
      };
      sinon.stub(req, 'allParams').returns({ ...testData.req });
      t1 = expect(prepareSchema(testData.token, req)).to.eventually.be.fulfilled;
      t2 = expect(prepareSchema(testData.token, req)).to.eventually.have.deep.property(
        'owner',
        '9995463210',
      );
      // return t1, t2;
    });

    it('should set owner to "anonymous"', async () => {
      testData = await getTestData('unit', 'helper', 'prepareSchema', '3');
      req = {
        allParams: () => 0,
        session: {
          user: { ...testData.user },
        },
      };
      sinon.stub(req, 'allParams').returns({ ...testData.req });
      t1 = expect(prepareSchema(testData.token, req)).to.eventually.be.fulfilled;
      t2 = expect(prepareSchema(testData.token, req)).to.eventually.have.deep.property(
        'owner',
        'anonymous',
      );
      // return t1, t2;
    });

    it('should set state part of name and path to national in the absense of state', async () => {
      testData = await getTestData('unit', 'helper', 'prepareSchema', '4');
      req = {
        allParams: () => 0,
        session: {
          user: { ...testData.user },
        },
      };
      sinon.stub(req, 'allParams').returns({ ...testData.req });
      t1 = expect(prepareSchema(testData.token, req)).to.eventually.be.fulfilled;
      t2 = expect(prepareSchema(testData.token, req)).to.eventually.have.deep.property(
        'name',
        'national-registerStudent',
      );
      t3 = expect(prepareSchema(testData.token, req)).to.eventually.have.deep.property(
        'path',
        'national/registerStudent',
      );
      // return t1, t2, t3;
    });

    it('should throw "ValidationException" if title is absent', async () => {
      testData = await getTestData('unit', 'helper', 'prepareSchema', '5');
      req = {
        allParams: () => 0,
        session: {
          user: { ...testData.user },
        },
      };
      sinon.stub(req, 'allParams').returns({ ...testData.req });
      return expect(prepareSchema(testData.token, req))
        .to.eventually.be.rejectedWith('Validation Error')
        .and.is.an.instanceOf(ValidationException.ValidationException)
        .and.has.deep.property('additionalInfo')
        .which.is.an('array')
        .which.include.deep.members([{ title: 'Title cannot be empty' }]);
    });
  });

  describe('Helper: post', () => {
    beforeEach(() => {
      mock = new MockAdapter(axios);
    });
    afterEach(() => {
      mock.reset();
      mock.restore();
    });
    it('should post to formio', () => {
      mock.onPost('/form').reply(200, {
        data: 'Form Schema here',
      });
      return expect(post('token', { schema: 'form' }, '/form')).to.eventually.be.fulfilled;
    });
    it('should throw "FormioException" with message "Unable to Create Form"', () => {
      mock.onPost('/form').reply(400, {
        errors: [{ path: 'name', message: 'name must be unique' }],
      });
      return expect(post('token', { schema: 'schema here' }, '/form'))
        .to.eventually.be.rejectedWith('Unable to Create Form')
        .and.be.an.instanceOf(FormioException.FormioException)
        .and.have.deep.property('additionalInfo')
        .which.has.a.property('status', 409);
    });
  });
});
