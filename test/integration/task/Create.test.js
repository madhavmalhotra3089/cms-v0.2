const supertest = require('supertest');
const chai = require('chai');

const { expect } = chai;
let token;

const TestCases = require('../../fixtures/integration/task/create');

describe('POST /tasks', () => {
  before(async () => {
    ({ token } = (await supertest(sails.hooks.http.app)
      .post('/user/login')
      .send({ email: 'madhav@indusaction.org', password: 'Context@30' })).body);
  });
  TestCases.validation.forEach(({ data, error }) => {
    it(`should ${
      error
        ? `throw ${error.type} with additionalInfo = ${JSON.stringify(error.additionalInfo[0])}`
        : `give output`
    }`, async () => {
      if (error) {
        return supertest(sails.hooks.http.app)
          .post('/tasks/')
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
      console.error(data);
      return supertest(sails.hooks.http.app)
        .post('/tasks/')
        .set({ authorization_token: token })
        .send(data)
        .expect(200);
    });
  });
});
