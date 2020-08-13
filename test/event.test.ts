import { Event } from '../src/event';

test('event', async () => {
  const data = await Event.get(26728);
  expect(data).toMatchSnapshot();
});
