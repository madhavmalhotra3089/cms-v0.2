class UnableToVerifyException extends Error {
  constructor(verifyType, additionalInfo) {
    super(`Could not verify ${verifyType}`);
    this.additionalInfo = additionalInfo;
    this.name = this.constructor.name;
  }

  toString() {
    return {
      type: this.name,
      message: this.message,
      additionalInfo: this.additionalInfo,
    };
  }
}
module.exports = {
  UnableToVerifyException,
};
