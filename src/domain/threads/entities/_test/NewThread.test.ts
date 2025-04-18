import { NEW_THREAD } from '@common/constant';
import { INewThread } from '@common/interface/IThread';
import { NewThread } from '../NewThread';

describe('NewThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'Kapan makan siang gratis nya ?',
      body: 'test makan siang gratis',
    } as unknown as INewThread;

    expect(() => new NewThread(payload)).toThrow(NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY);
  });

  it('should throw error when payload did not meet data type spesification', () => {
    const payload = {
      title: {},
      body: true,
      owner: 1,
    } as unknown as INewThread;

    expect(() => new NewThread(payload)).toThrow(NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION);
  });

  it('should create new thread object correctly', () => {
    const payload = {
      title: 'Kapan makan siang gratis nya ?',
      body: 'test makan siang gratis',
      owner: 'user-123',
    } as INewThread;

    const newThread = new NewThread(payload);

    expect(newThread.getBody).toEqual(payload.body);
    expect(newThread.getOwner).toEqual(payload.owner);
    expect(newThread.getTitle).toEqual(payload.title);
  });
});
