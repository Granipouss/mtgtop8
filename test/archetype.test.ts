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

  it('should throw on not found', async () => {
    await expect(Archetype.get(-1)).rejects.toThrow('No archetype for id -1');
  });
});
