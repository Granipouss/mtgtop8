import { Event } from '../src';

describe('Event', () => {
  it('should get one', async () => {
    const event = await Event.get(26728);
    expect(event).toMatchSnapshot();
  });

  it('should throw when not found', async () => {
    await expect(Event.get(-1)).rejects.toThrow('No event for id -1');
  });
});
