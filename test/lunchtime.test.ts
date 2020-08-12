import howLongUntilLunch from '..';

test('howLongUntilLunch', () => {
  let now = new Date();
  jest.spyOn(Date, 'now').mockImplementation(() => now.getTime());

  const mockNow = (hours: number, minutes: number, seconds: number) => {
    now = new Date();
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(seconds);
  };

  mockNow(11, 30, 0);
  expect(howLongUntilLunch(12, 30)).toBe('60 minutes');

  mockNow(10, 30, 0);
  expect(howLongUntilLunch(12, 30)).toBe('2 hours');

  mockNow(12, 25, 0);
  expect(howLongUntilLunch(12, 30)).toBe('5 minutes');

  // some of us like an early lunch
  mockNow(10, 30, 0);
  expect(howLongUntilLunch(11, 0)).toBe('30 minutes');
});
