class UnableToUpdateException extends Error {
  constructor(updateType, additionalInfo) {
    super(`Could not update ${updateType}`);
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
  UnableToUpdateException,
};
