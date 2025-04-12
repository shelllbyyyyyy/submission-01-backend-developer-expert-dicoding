import { ClientError } from './ClientError';

export class InvariantError extends ClientError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'InvariantError';
  }
}
