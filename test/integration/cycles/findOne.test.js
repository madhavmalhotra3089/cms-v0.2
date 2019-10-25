const supertest = require('supertest');
const chai = require('chai');

const { expect } = chai;
let cycleId;
let token;

describe('GET /cycles/<id>', () => {
  before(async () => {
    ({ token } = (await supertest(sails.hooks.http.app)
      .post('/user/login')
      .send({ email: 'itsupport@indusaction.org', password: 'admin123' })).body);
    cycleId = (await Cycles.findOne({ name: 'cycle1' })).id;
  });
  it(`should throw RecordDoesNotExistsException with message 'Cycle does not exist'`, () => supertest(sails.hooks.http.app)
      .get('/cycles/00000000-7000-4000-8000-000000000000')
      .set({ authorization_token: token })
      .send()
      .expect(404)
      .expect((res) => {
        expect(res.body)
          .to.have.property('error')
          .which.has.property('message', 'Cycles does not exist');
      }));
  it(`should throw ValidationException with additionalInfo = "id" must be a valid GUID`, () => supertest(sails.hooks.http.app)
      .get('/cycles/0000000-7000-4000-8000-00000000000')
      .set({ authorization_token: token })
      .send()
      .expect(400)
      .expect((res) => {
        expect(res.body)
          .to.have.property('error')
          .which.has.property('additionalInfo')
          .which.is.an('array')
          .which.has.deep.members([{ id: '"id" must be a valid GUID' }]);
      }));
  it(`should return cycle data`, () => supertest(sails.hooks.http.app)
      .get(`/cycles/${cycleId}`)
      .set({ authorization_token: token })
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body)
          .to.have.property('data')
          .which.has.property('id', cycleId);
      }));
});
