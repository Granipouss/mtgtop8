import { Deck } from '../src/deck';

describe('Decks', () => {
  it('should match snapshot for Pioneer deck', async () => {
    const data = await Deck.get(26845, 409141);
    expect(data).toMatchSnapshot();
  });

  it('should match snapshot for EDH deck', async () => {
    const data = await Deck.get(26139, 397720);
    expect(data).toMatchSnapshot();
  });

  it('should throw on not found', async () => {
    await expect(Deck.get(0, 1)).rejects.toThrow('No deck 1 for event 0');
  });
});
