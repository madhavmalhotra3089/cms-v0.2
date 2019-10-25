const supertest = require('supertest');
const chai = require('chai');
const uuid = require('node-uuid');

const { expect } = chai;
let cycleId;
let token;

describe('DELETE /cycles', () => {
  before(async () => {
    ({ token } = (await supertest(sails.hooks.http.app)
      .post('/user/login')
      .send({ email: 'itsupport@indusaction.org', password: 'admin123' })).body);
    cycleId = (await Cycles.create({ id: uuid.v4(), name: 'cycle4' }).fetch()).id;
  });
  after(async () => {
    await Cycles.destroy({ id: cycleId });
  });
  it(`should return with 0 as value for the number of records deleted`, () => supertest(sails.hooks.http.app)
      .delete('/cycles')
      .set({ authorization_token: token })
      .send({ id: ['00000000-7000-4000-8000-000000000000'], deleted: true })
      .expect(200)
      .expect((res) => {
        expect(res.body)
          .to.have.property('data')
          .which.has.deep.property('deleted', 0);
      }));
  it(`should throw ValidationException with additionalInfo = "id" must be a valid GUID`, () => supertest(sails.hooks.http.app)
      .delete('/cycles')
      .set({ authorization_token: token })
      .send({ id: ['0000000-7000-4000-8000-00000000000'], deleted: true })
      .expect(400)
      .expect((res) => {
        expect(res.body)
          .to.have.property('error')
          .which.has.property('additionalInfo')
          .which.is.an('array')
          .which.has.deep.members([{ 'id->0': '"0" must be a valid GUID' }]);
      }));
  it(`should set delete flag to true and return cycle data`, () => supertest(sails.hooks.http.app)
      .delete(`/cycles`)
      .set({ authorization_token: token })
      .send({ id: [cycleId], deleted: true })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).to.have.property('deleted', 1);
      }));
});
