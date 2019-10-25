const chai = require('chai');
chai.use(require('chai-as-promised'));

const { expect } = chai;

describe('API: findOne', () => {
  let prepareUrl;

  before(() => {
    ({ prepareUrl } = sails.helpers.formio.forms);
  });
  describe('Helper: prepareUrl', () => {
    it('should return the correct transformed url when using id', () => expect(prepareUrl('/form', 'someId'))
        .to.eventually.be.a('string')
        .and.equal(`/form/someId`));
    it('should return the correct transformed url when using form name', () => expect(prepareUrl('/form', 'state-title'))
        .to.eventually.be.a('string')
        .and.equal(`/state/title`));
  });
});
