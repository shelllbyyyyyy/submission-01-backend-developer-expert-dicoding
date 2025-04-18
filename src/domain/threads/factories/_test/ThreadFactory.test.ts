import { IThread } from '@common/interface/IThread';
import { ThreadFactory } from '../ThreadFactory';
import { DetailThread } from '@domain/threads/entities/DetailThread';

describe('ThreadFactory', () => {
  it('should map database result object into domain correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'Dicoding indonesia',
      body: 'Apakah bisa dapat pekerjaan saya bisa mendapat kerja sebagai BE dev ?',
      date: new Date(),
      username: 'Arif Ramdani',
      comments: [],
    } as IThread;

    const factory = ThreadFactory.toDomain(payload);
    const spy = jest.spyOn(ThreadFactory, 'Comments');

    expect(factory).toStrictEqual(
      new DetailThread({
        id: 'thread-123',
        title: 'Dicoding indonesia',
        body: 'Apakah bisa dapat pekerjaan saya bisa mendapat kerja sebagai BE dev ?',
        date: payload.date,
        username: 'Arif Ramdani',
        comments: [],
      }),
    );
    expect(spy).toHaveBeenCalledWith(payload.comments);
  });
});
