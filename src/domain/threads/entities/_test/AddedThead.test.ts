import { IAddedThread } from '@common/interface/IThread';
import { AddedThread } from '../AddedThread';
import { NEW_THREAD } from '@common/constant';

describe('Thread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'Kapan makan siang gratis nya ?',
      owner: 'user-123',
    } as unknown as IAddedThread;

    expect(() => new AddedThread(payload)).toThrow(NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY);
  });

  it('should throw error when payload did not meet data type spesification', () => {
    const payload = {
      id: true,
      title: {},
      owner: 1,
    } as unknown as IAddedThread;

    expect(() => new AddedThread(payload)).toThrow(NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION);
  });

  it('should create new thread object correctly', () => {
    const payload = {
      id: 'user-123',
      title: 'Kapan makan siang gratis nya ?',
      owner: 'user-123',
    } as IAddedThread;

    const thread = new AddedThread(payload);

    expect(thread.getId).toEqual(payload.id);
    expect(thread.getOwner).toEqual(payload.owner);
    expect(thread.getTitle).toEqual(payload.title);
  });
});
