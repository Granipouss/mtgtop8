import { Format } from '../src';

describe('Format', () => {
  it('should get all the list', async () => {
    const formats = await Format.getAll();
    expect(formats).toEqual([
      { code: 'VI', name: 'vintage' },
      { code: 'LE', name: 'legacy' },
      { code: 'MO', name: 'modern' },
      { code: 'PI', name: 'pioneer' },
      { code: 'ST', name: 'standard' },
      { code: 'EDH', name: 'commander' },
      { code: 'PAU', name: 'pauper' },
      { code: 'PEA', name: 'peasant' },
      { code: 'BL', name: 'block' },
      { code: 'EX', name: 'extended' },
      { code: 'HIGH', name: 'highlander' },
      { code: 'CHL', name: 'canadian highlander' },
    ]);
  });

  it('should get one', async () => {
    await expect(Format.get('MO')).resolves.toBeTruthy();
  });

  it('should get paginated events', async () => {
    const format = await Format.get('ST');
    await Promise.all([
      expect(format.getEvents(1)).resolves.toEqual(expect.any(Array)),
      expect(format.getEvents(2)).resolves.toEqual(expect.any(Array)),
    ]);
  });

  it('should throw when not found', async () => {
    await expect(Format.get('XX')).rejects.toThrow('No format for code XX');
  });
});
