class UnableToSendOtpException extends Error {
  constructor(additionalInfo) {
    super('Unable to send OTP');
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
  UnableToSendOtpException,
};
