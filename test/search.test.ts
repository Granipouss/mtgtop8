import { Search, Level } from '../src';

describe('Search', () => {
  it('should search for nice decks', async () => {
    const response = await Search.make()
      .setDeckName('faerie')
      .setFormat('MO')
      .setLevels([Level.Professional, Level.Competitive])
      .setDateEnd(new Date('2018-04-16'))
      .run();

    expect(response).toMatchSnapshot();
  });

  it('should not fail', async () => {
    const response = await Search.make().setDateStart(new Date('1990-04-16')).setDateEnd(new Date('1990-04-16')).run();

    expect(response).toEqual({ count: 0, results: [] });
  });
});
