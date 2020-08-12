import { fetchSample } from '../src/sample';

test('Sample test', async () => {
  const data = await fetchSample();

  expect(data).toMatchInlineSnapshot(`
    Object {
      "player": "Marek Vardžik",
      "result": "5-8",
    }
  `);
});
