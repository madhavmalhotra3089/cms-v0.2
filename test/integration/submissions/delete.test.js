const supertest = require('supertest');
const chai = require('chai');

const { expect } = chai;
const formSchema = require('../../fixtures/integration/submissions/form');

let formName;
let formId;
let token;
let submission;

describe('DELETE /forms/<formID or formName>/submissions/<submissionId>', () => {
  before(async () => {
    ({ token } = (await supertest(sails.hooks.http.app)
      .post('/user/login')
      .send({ email: 'itsupport@indusaction.org', password: 'admin123' })).body);
    ({ name: formName, _id: formId } = (await supertest(sails.hooks.http.app)
      .post('/forms')
      .set({ authorization_token: token })
      .send(formSchema)).body.data);
    const { _id: id } = (await supertest(sails.hooks.http.app)
      .post(`/forms/${formId}/submissions`)
      .set({ authorization_token: token })
      .send({
        firstName: `Banchan`,
        lastName: `Sangma`,
        email: `banchan@indusaction.org`,
        phoneNumber: `789456123`,
      })).body.data;
    submission = id;
  });
  after(async () => {
    await supertest(sails.hooks.http.app)
      .delete(`/forms/${formId}`)
      .set({ authorization_token: token })
      .send();
  });
  it('should return submission data', () => supertest(sails.hooks.http.app)
      .delete(`/forms/${formName}/submissions/${submission}`)
      .set({ authorization_token: token })
      .send()
      .expect(200)
      .expect((res) => {
        expect(res.body).to.have.property('data', 'Deletion Successful');
      }));
  it('should throw formioException with message Form does not exist', () => supertest(sails.hooks.http.app)
      .delete(`/forms/nonExistant-form/submissions/${submission}`)
      .set({ authorization_token: token })
      .send()
      .expect(502)
      .expect((res) => {
        expect(res.body.error).to.have.property('message', 'Form does not exist');
      }));
  it('should throw formioException with message Not Found when there is no submission corresponding to the provided ID', () => supertest(sails.hooks.http.app)
      .delete(`/forms/${formId}/submissions/5d380af21efea731ddb1ea24`)
      .set({ authorization_token: token })
      .send()
      .expect(502)
      .expect((res) => {
        expect(res.body.error).to.have.property('message', 'Not Found');
      }));
  it('should throw formioException with status 404 when there is no submission corresponding to the provided ID', () => supertest(sails.hooks.http.app)
      .delete(`/forms/${formId}/submissions/5d380af21efea731ddb1ea24`)
      .set({ authorization_token: token })
      .send()
      .expect(502)
      .expect((res) => {
        expect(res.body.error)
          .to.have.property('additionalInfo')
          .which.has.property('status', 404);
      }));
});
