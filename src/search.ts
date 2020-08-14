import { url, getPage, match, parseDeckLink, isDefined } from './utils';

import { Level } from './event';
import { ShortDeck } from './deck';

export type SearchQuery = Partial<{
  eventName: string;
  deckName: string;
  player: string;
  formatCode: string;
  archetypeId: number;
  levels: Level[];
  lookInMainboard: boolean;
  lookInSideboard: boolean;
  cards: string[];
  dateStart: Date;
  dateEnd: Date;
}>;

export type SearchResponse = {
  results: ShortDeck[];
  count: number;
};

type SearchPayload = Partial<{
  event_titre: string;
  deck_titre: string;
  player: string;
  format: string;
  'archetype_sel[VI]': number;
  'archetype_sel[LE]': number;
  'archetype_sel[MO]': number;
  'archetype_sel[PI]': number;
  'archetype_sel[EX]': number;
  'archetype_sel[ST]': number;
  'archetype_sel[BL]': number;
  'archetype_sel[PAU]': number;
  'archetype_sel[EDH]': number;
  'archetype_sel[HIGH]': number;
  'archetype_sel[EDHP]': number;
  'archetype_sel[CHL]': number;
  'archetype_sel[PEA]': number;
  'archetype_sel[EDHM]': number;
  'compet_check[P]': 1;
  'compet_check[M]': 1;
  'compet_check[C]': 1;
  'compet_check[R]': 1;
  MD_check: 1;
  SB_check: 1;
  cards: string;
  date_start: string;
  date_end: string;
}>;

const formatDate = (date: Date): string =>
  [date.getDate(), date.getMonth() + 1, date.getFullYear()].map((n) => n.toString().padStart(2, '0')).join('/');

const makePayload = (query: SearchQuery): SearchPayload => {
  const payload: SearchPayload = {};

  if (query.deckName) payload['deck_titre'] = query.deckName;
  if (query.eventName) payload['event_titre'] = query.eventName;
  if (query.player) payload['player'] = query.player;
  if (query.formatCode) {
    payload['format'] = query.formatCode;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (query.archetypeId) payload[`archetype_sel[${query.formatCode}]`] = query.archetypeId;
  }
  if (query.levels) {
    if (query.levels.includes(Level.Professional)) payload['compet_check[P]'] = 1;
    if (query.levels.includes(Level.Major)) payload['compet_check[M]'] = 1;
    if (query.levels.includes(Level.Competitive)) payload['compet_check[C]'] = 1;
    if (query.levels.includes(Level.Regular)) payload['compet_check[R]'] = 1;
  }
  if (query.lookInMainboard) payload['MD_check'] = 1;
  if (query.lookInSideboard) payload['SB_check'] = 1;
  if (query.cards) payload['cards'] = query.cards.join('\n');
  if (query.dateStart) payload['date_start'] = formatDate(query.dateStart);
  if (query.dateEnd) payload['date_end'] = formatDate(query.dateEnd);

  return payload;
};

const makeQuery = (record: Record<string, string | number | boolean | undefined>): string =>
  Object.entries(record)
    .filter(([, value]) => isDefined(value))
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map(([key, value]) => `${key}=${value!}`)
    .join('&');

export class Search {
  public static make(query: SearchQuery = {}): Search {
    return new Search(query);
  }

  private constructor(public query: SearchQuery = {}) {}

  public setEventName(eventName: string): Search {
    return new Search({ ...this.query, eventName });
  }

  public setDeckName(deckName: string): Search {
    return new Search({ ...this.query, deckName });
  }

  public setPlayer(player: string): Search {
    return new Search({ ...this.query, player });
  }

  public setFormat(formatCode: string, archetypeId?: number): Search {
    return new Search({ ...this.query, formatCode, archetypeId });
  }

  public setLevels(levels: Level[]): Search {
    return new Search({ ...this.query, levels });
  }

  public setLookInMainboard(lookInMainboard: boolean): Search {
    return new Search({ ...this.query, lookInMainboard });
  }

  public setLookInSideboard(lookInSideboard: boolean): Search {
    return new Search({ ...this.query, lookInSideboard });
  }

  public setCards(cards: string[]): Search {
    return new Search({ ...this.query, cards });
  }

  public setDateStart(dateStart: Date): Search {
    return new Search({ ...this.query, dateStart });
  }

  public setDateEnd(dateEnd: Date): Search {
    return new Search({ ...this.query, dateEnd });
  }

  public async run(page = 1): Promise<SearchResponse> {
    const $ = await getPage(`${url.search()}?${makeQuery(makePayload(this.query))}&current_page=${page}`);

    const [count] = match($('table table').eq(1).find('tr:first-child div').text(), /(\d+) decks?/);

    const decks: ShortDeck[] = $('table table')
      .eq(1)
      .find('.hover_tr')
      .get()
      .map((el) => {
        const linkData = parseDeckLink($(el).find('a').first().attr('href'));
        const name = $(el).find('a').first().text();
        return {
          eventId: linkData.event,
          id: linkData.deck,
          name: name.trim(),
        };
      });

    return {
      count: parseInt(count, 10),
      results: decks,
    };
  }
}
