import { getPage, url, match } from './utils';

import { ShortDeck } from './deck';

export type ShortArchetype = { id: number; name: string };

export class Archetype implements ShortArchetype {
  public static async get(id: number): Promise<Archetype> {
    const $ = await getPage(url.archetype(id));

    if ($('table table[align=center] .hover_tr').html() == null) {
      throw new Error(`No archetype for id ${id}`);
    }

    return new Archetype($);
  }

  id: number;
  name: string;

  private constructor($: CheerioStatic) {
    this.id = parseInt(match($('table table option').attr('value'), /archetype\?a=(\d+)&f=.+&meta=.+/)[0], 10);

    this.name = $('table table').eq(1).find('tr:first-child').text().replace('decks', '').trim();
  }

  async getDecks(page = 1): Promise<ShortDeck[]> {
    const $ = await getPage(url.archetype(this.id, page));
    return $('table table[align=center] .hover_tr')
      .get()
      .map((el) => {
        const [eventId, deckId, name] = match(
          $(el).find('td').eq(1).html() || '',
          /^<a href="event\?e=(\d+)&amp;d=(\d+)&amp;f=MO">(.+)<\/a>$/
        );

        return {
          eventId: parseInt(eventId, 10),
          id: parseInt(deckId, 10),
          name: name.trim(),
        };
      });
  }
}
