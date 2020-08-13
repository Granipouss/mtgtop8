import { Archetype } from '../src';

describe('Archetype', () => {
  it('should get one', async () => {
    const archetype = await Archetype.get(214);
    expect(archetype).toMatchSnapshot();
  });

  it('should get paginated decks', async () => {
    const archetype = await Archetype.get(226);
    await Promise.all([
      expect(archetype.getDecks(1)).resolves.toEqual(expect.any(Array)),
      expect(archetype.getDecks(2)).resolves.toEqual(expect.any(Array)),
    ]);
  });

  it('should throw when not found', async () => {
    await expect(Archetype.get(-1)).rejects.toThrow('No archetype for id -1');
  });
});
