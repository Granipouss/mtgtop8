import { Deck } from '../src';

describe('Deck', () => {
  it('should get a Pioneer deck', async () => {
    const deck = await Deck.get(26845, 409141);
    expect(deck).toMatchSnapshot();
  });

  it('should get an EDH deck', async () => {
    const deck = await Deck.get(26139, 397720);
    expect(deck).toMatchSnapshot();
  });

  it('should throw when not found', async () => {
    await Promise.all([
      expect(Deck.get(0, 1)).rejects.toThrow('No deck 1 for event 0'),
      expect(Deck.get(26845, 1)).rejects.toThrow('No deck 1 for event 26845'),
    ]);
  });
});
