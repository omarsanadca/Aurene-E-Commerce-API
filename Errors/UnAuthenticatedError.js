class UnAuthenticatedError extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}

export default UnAuthenticatedError;
