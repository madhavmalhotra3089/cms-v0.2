class UnableToCreateException extends Error {
  constructor(createType, additionalInfo) {
    super(`Unable to create ${createType}`);
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
  UnableToCreateException,
};
