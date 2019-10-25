const supertest = require('supertest');
const chai = require('chai');

const { expect } = chai;
const formSchema = require('../../fixtures/integration/submissions/form');

let formName;
let formId;
let token;

describe('GET /forms/<formID or formName>/submissions', () => {
  before(async () => {
    ({ token } = (await supertest(sails.hooks.http.app)
      .post('/user/login')
      .send({ email: 'itsupport@indusaction.org', password: 'admin123' })).body);
    ({ name: formName, _id: formId } = (await supertest(sails.hooks.http.app)
      .post('/forms')
      .set({ authorization_token: token })
      .send(formSchema)).body.data);
    [1, 2, 3, 4].forEach(async (i) => {
      await supertest(sails.hooks.http.app)
        .post(`/forms/${formId}/submissions`)
        .set({ authorization_token: token })
        .send({
          firstName: `Banchan${i}`,
          lastName: `Sangma${i}`,
          email: `banchan${i}@indusaction.org`,
          phoneNumber: `789456123${i}`,
        });
    });
  });
  beforeEach(() => {
    setTimeout(() => {}, 2000);
  });
  after(async () => {
    await supertest(sails.hooks.http.app)
      .delete(`/forms/${formId}`)
      .set({ authorization_token: token })
      .send();
  });
  it('should return 4 submissions', () => supertest(sails.hooks.http.app)
      .get(`/forms/${formName}/submissions`)
      .set({ authorization_token: token })
      .query({ firstName: 'Banchan' })
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body.data)
          .to.be.an('array')
          .which.has.length(4);
      }));
  it('should return 2 submissions', () => supertest(sails.hooks.http.app)
      .get(`/forms/${formName}/submissions`)
      .set({ authorization_token: token })
      .query({ firstName: 'Banchan', limit: 2 })
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body.data)
          .to.be.an('array')
          .which.has.length(2);
      }));
  it('should throw formioException with message Form does not exist', () => supertest(sails.hooks.http.app)
      .get(`/forms/nonExistant-form/submissions`)
      .set({ authorization_token: token })
      .send()
      .expect(502)
      .expect((res) => {
        expect(res.body.error).to.have.property('message', 'Form does not exist');
      }));
});
