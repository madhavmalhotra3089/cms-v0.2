class RecordDoesNotExistException extends Error {
  constructor(recordType) {
    super(`${recordType} does not exist`);
    this.additionalInfo = recordType;
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
  RecordDoesNotExistException,
};
