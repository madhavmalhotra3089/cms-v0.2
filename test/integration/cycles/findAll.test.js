const supertest = require('supertest');
const chai = require('chai');

const { expect } = chai;
let token;

const TestCases = require('../../fixtures/integration/cycles/findAll');

describe('GET /cycles', () => {
  before(async () => {
    ({ token } = (await supertest(sails.hooks.http.app)
      .post('/user/login')
      .send({ email: 'itsupport@indusaction.org', password: 'admin123' })).body);
  });
  TestCases.validation.forEach(({ data, error }) => {
    it(`should ${
      error
        ? `throw ${error.type} with additionalInfo = ${JSON.stringify(error.additionalInfo[0])}`
        : `give output`
    }`, async () => {
      if (error) {
        return supertest(sails.hooks.http.app)
          .get('/cycles')
          .set({ authorization_token: token })
          .query(data)
          .send()
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
        .get('/cycles')
        .set({ authorization_token: token })
        .send(data)
        .expect(200);
    });
  });

  it('should return total count = 3', () => supertest(sails.hooks.http.app)
      .get('/cycles')
      .set({ authorization_token: token })
      .query({ name: 'cycle' })
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body).to.have.property('total', '3');
      }));
  it('should have data with length = 3', () => supertest(sails.hooks.http.app)
      .get('/cycles')
      .set({ authorization_token: token })
      .query({ name: 'cycle' })
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body)
          .to.have.property('data')
          .which.has.lengthOf(3);
      }));
  it('should return total count = 3', () => supertest(sails.hooks.http.app)
      .get('/cycles')
      .set({ authorization_token: token })
      .query({ name: 'cycle', page_size: 2 })
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body).to.have.property('total', '3');
      }));
  it('should return data with length = 2', () => supertest(sails.hooks.http.app)
      .get('/cycles')
      .set({ authorization_token: token })
      .query({ name: 'cycle', page_size: 2 })
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body)
          .to.have.property('data')
          .which.has.lengthOf(2);
      }));
  it('should have a next link', () => supertest(sails.hooks.http.app)
      .get('/cycles')
      .set({ authorization_token: token })
      .query({ name: 'cycle', page_size: 2 })
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body)
          .to.have.property('links')
          .which.has.deep.property('next')
          .which.is.not.equal(null);
      }));
});
