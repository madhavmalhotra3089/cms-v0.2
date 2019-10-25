const supertest = require('supertest');
const chai = require('chai');

const { expect } = chai;
let token;

const TestCases = require('../../fixtures/integration/cycles/create');

describe('POST /cycles', () => {
  before(async () => {
    ({ token } = (await supertest(sails.hooks.http.app)
      .post('/user/login')
      .send({ email: 'itsupport@indusaction.org', password: 'admin123' })).body);
  });
  after(async () => {
    await Cycles.destroy({
      where: {
        name: { contains: 'Test' },
      },
    });
  });
  TestCases.validation.forEach(({ data, error }) => {
    it(`should ${
      error
        ? `throw ${error.type} with additionalInfo = ${JSON.stringify(error.additionalInfo[0])}`
        : `give output`
    }`, async () => {
      if (error) {
        return supertest(sails.hooks.http.app)
          .post('/cycles/')
          .set({ authorization_token: token })
          .send(data)
          .expect(400)
          .expect((res) => {
            expect(res.body)
              .to.have.property('error')
              .which.has.deep.property('additionalInfo')
              .which.is.an('array')
              .which.includes.deep.members(error.additionalInfo);
          });
      }
      return supertest(sails.hooks.http.app)
        .post('/cycles/')
        .set({ authorization_token: token })
        .send(data)
        .expect(200);
    });
  });
  TestCases.create.forEach(({ output, error, data }) => {
    it(`should ${
      error
        ? `throw ${error.type} with additionalInfo = ${error.additionalInfo}`
        : `give output ${JSON.stringify(output.data)}`
    }`, async () => {
      if (error) {
        return supertest(sails.hooks.http.app)
          .post('/cycles/')
          .set({ authorization_token: token })
          .send({ ...data })
          .expect(409)
          .expect((res) => {
            expect(res.body)
              .to.have.property('error')
              .which.has.property('type', 'RecordAlreadyExistsException');
          });
      }
      return supertest(sails.hooks.http.app)
        .post('/cycles/')
        .set({ authorization_token: token })
        .send({ ...data })
        .expect(200)
        .expect((res) => {
          expect(res.body)
            .to.have.property('data')
            .which.has.property('name', data.name);
        });
    });
  });
});
