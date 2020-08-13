import { Archetype } from '../src/archetype';

describe('Archetypes', () => {
  it('should match snapshot for single', async () => {
    const data = await Archetype.get(214);
    expect(data).toMatchSnapshot();
  });

  it('should match snapshot with page', async () => {
    const data = await Archetype.get(226, 2);
    expect(data).toMatchSnapshot();
  });

  // it('should throw on not found', async () => {
  //   await expect(getDeck(0, 1)).rejects.toThrow('No deck 1 for event 0');
  // });
});
