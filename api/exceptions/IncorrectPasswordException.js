class IncorrectPasswordException extends Error {
  constructor(feature) {
    super(`Entered Password ${feature ? `for ${feature} ` : ''}is incorrect`);
    this.additionalInfo = feature;
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
  IncorrectPasswordException,
};
