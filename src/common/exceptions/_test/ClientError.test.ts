import { ClientError } from '../ClientError';

describe('ClientError', () => {
  it('should allow subclassing and set properties correctly', () => {
    const error = new ClientError('Something went wrong');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ClientError);
    expect(error.message).toBe('Something went wrong');
    expect(error.name).toBe('ClientError');
    expect(error.statusCode).toBe(400);
  });
});
