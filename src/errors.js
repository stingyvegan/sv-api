class Error {
  constructor(type, message) {
    this.type = type;
    this.message = message || '';

    this.toString = function() {
      return `${this.type}${this.message ? ` ${this.message}` : ''}`;
    };
  }
}

export class UnauthorisedError extends Error {
  constructor(message) {
    super('Unauthorised', message);
  }
}
