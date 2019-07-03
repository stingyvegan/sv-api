class Error {
  constructor(type, message) {
    this.type = type;
    this.message = message || '';
  }

  toString() {
    return `${this.type}${this.message ? ` ${this.message}` : ''}`;
  }
}

class UnauthorisedError extends Error {
  constructor(message) {
    super('Unauthorised', message);
  }
}

export default {
  UnauthorisedError,
};
