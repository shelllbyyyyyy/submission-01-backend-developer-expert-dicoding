export class ClientError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);

    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}
