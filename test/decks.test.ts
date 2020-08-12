import { getDeck } from '../src/decks';

describe('Decks', () => {
  it('should match snapshot for Pioneer deck', async () => {
    const data = await getDeck(26845, 409141);
    expect(data).toMatchSnapshot();
  });

  it('should match snapshot for EDH deck', async () => {
    const data = await getDeck(26139, 397720);
    expect(data).toMatchSnapshot();
  });

  it('should throw on not found', async () => {
    await expect(getDeck(0, 1)).rejects.toThrow('No deck 1 for event 0');
  });
});
