import { getFormats } from '../src/formats';

describe('Formats', () => {
  it('should match snapshot', async () => {
    const data = await getFormats();
    expect(data).toMatchSnapshot();
  });
});
