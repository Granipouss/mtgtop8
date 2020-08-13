import { Event } from '../src/event';

test('event', async () => {
  const data = await Event.get(26728);
  expect(data).toMatchSnapshot();
});

test('no event', async () => {
  await expect(Event.get(-1)).rejects.toThrow('No event for id -1');
});
