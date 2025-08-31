export class NotAuthorizedError extends Error {
  constructor(message: string = "Not Authorized") {
    super(message);
  }
}
