class RecordAlreadyExistsException extends Error {
  constructor(recordType, additionalInfo) {
    super(`${recordType} already exists`);
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
  RecordAlreadyExistsException,
};
