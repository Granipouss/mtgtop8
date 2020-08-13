// import { getFormats, getFormat } from '../src/formats';
import { Format } from '../src/format';

it('should get all formats', async () => {
  const data = await Format.getAll();
  expect(data).toMatchSnapshot();
});

it('should get one format', async () => {
  const data = await Format.get('LE');
  expect(data).toMatchSnapshot();
});

it('should get events for a format', async () => {
  const format = await Format.get('MO');
  const data = await format.getEvents(3);
  expect(data).toMatchSnapshot();
});

it('should throw on no format found', async () => {
  await expect(Format.get('XX')).rejects.toThrow('No format for code XX');
});
