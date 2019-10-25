const supertest = require('supertest');
const chai = require('chai');

const { expect } = chai;
const formSchema = require('../../fixtures/integration/submissions/form');

let formName;
let formId;
let token;

describe('POST /forms/<formID or formName>/submissions', () => {
  before(async () => {
    ({ token } = (await supertest(sails.hooks.http.app)
      .post('/user/login')
      .send({ email: 'itsupport@indusaction.org', password: 'admin123' })).body);
    ({ name: formName, _id: formId } = (await supertest(sails.hooks.http.app)
      .post('/forms')
      .set({ authorization_token: token })
      .send(formSchema)).body.data);
  });
  after(async () => {
    await supertest(sails.hooks.http.app)
      .delete(`/forms/${formId}`)
      .set({ authorization_token: token })
      .send();
  });
  it('should create and return a submission', () => supertest(sails.hooks.http.app)
      .post(`/forms/${formName}/submissions`)
      .set({ authorization_token: token })
      .send({
        firstName: 'Banchan',
        lastName: 'Sangma',
        email: 'banchan@indusaction.org',
        phoneNumber: '7894561230',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).to.have.property('_id');
      }));
  it('should set owner to itsupport@induaction.org', () => supertest(sails.hooks.http.app)
      .post(`/forms/${formName}/submissions`)
      .set({ authorization_token: token })
      .send({
        firstName: 'Banchan',
        lastName: 'Sangma',
        email: 'banchan@indusaction.org',
        phoneNumber: '7894561230',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).to.have.property('owner', 'itsupport@indusaction.org');
      }));
  it('should throw formioException with message Form does not exist', () => supertest(sails.hooks.http.app)
      .post(`/forms/nonExistant-form/submissions`)
      .set({ authorization_token: token })
      .send({
        firstName: 'Banchan',
        lastName: 'Sangma',
        email: 'banchan@indusaction.org',
        phoneNumber: '7894561230',
      })
      .expect(502)
      .expect((res) => {
        expect(res.body.error).to.have.property('message', 'Form does not exist');
      }));
});
