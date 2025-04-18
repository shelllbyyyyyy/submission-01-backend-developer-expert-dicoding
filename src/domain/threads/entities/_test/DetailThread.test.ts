import { IThread } from '@common/interface/IThread';
import { DetailThread } from '../DetailThread';

describe('DetailThread entities', () => {
  it('should return detail thread entities correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'Dicoding indonesia',
      body: 'Apakah bisa dapat pekerjaan saya bisa mendapat kerja sebagai BE dev ?',
      date: new Date(),
      username: 'Arif Ramdani',
      comments: [],
    } as IThread;

    const detailThread = new DetailThread(payload);

    expect(detailThread.getId).toEqual(payload.id);
    expect(detailThread.getTitle).toEqual(payload.title);
    expect(detailThread.getBody).toEqual(payload.body);
    expect(detailThread.getDate).toEqual(payload.date);
    expect(detailThread.getUsername).toEqual(payload.username);
    expect(detailThread.getComments).toEqual(payload.comments);
  });
});
