import { Archetype } from '../src/archetype';

describe('Archetypes', () => {
  it('should match snapshot', async () => {
    const data = await Archetype.get(214);
    expect(data).toMatchSnapshot();
  });

  it('should match get decks', async () => {
    const archetype = await Archetype.get(226);
    const data = await archetype.getDecks(2);
    expect(data).toMatchSnapshot();
  });

  // it('should throw on not found', async () => {
  //   await expect(getDeck(0, 1)).rejects.toThrow('No deck 1 for event 0');
  // });
});
