import { getPage, url, match } from './utils';

import { ShortDeck } from './deck';

export type ShortArchetype = { id: number; name: string };

export class Archetype implements ShortArchetype {
  public static async get(id: number, page = 1): Promise<Archetype> {
    const $ = await getPage(url.archetype(id, page));
    return new Archetype($);
  }

  id: number;
  name: string;

  decks: ShortDeck[];

  private constructor($: CheerioStatic) {
    this.id = parseInt(match($('table table option').attr('value'), /archetype\?a=(\d+)&f=.+&meta=.+/)[0], 10);

    this.name = $('table table').eq(1).find('tr:first-child').text().replace('decks', '').trim();

    this.decks = $('table table[align=center] .hover_tr')
      .get()
      .map((el) => {
        const [eventString, deckString, name] = match(
          $(el).find('td').eq(1).html() || '',
          /^<a href="event\?e=(\d+)&amp;d=(\d+)&amp;f=MO">(.+)<\/a>$/
        );

        return {
          eventId: parseInt(eventString, 10),
          id: parseInt(deckString, 10),
          name: name.trim(),
        };
      });
  }
}
