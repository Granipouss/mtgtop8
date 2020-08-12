import { getPage } from './utils';

export type ShortDeck = {
  id: number;
  eventId: number;
  name: string;
};

export type Archetype = { id: number; name: string; decks: ShortDeck[] };

const parseName = ($el: Cheerio): string =>
  $el
    .eq(1)
    .text()
    .trim()
    .replace(/ decks$/, '');

const parseDeck = ($el: Cheerio): ShortDeck => {
  const regexp = /^<a href="event\?e=(\d+)&amp;d=(\d+)&amp;f=MO">(.+)<\/a>$/;
  const match = $el.find('td').eq(1).html()?.match(regexp);
  if (!match) throw new Error(`Cannot parse deck: ${$el.text()}`);

  const eventId = parseInt(match[1], 10);
  const id = parseInt(match[2], 10);
  const name = match[3].trim();

  return { eventId, id, name };
};

export const getArchetype = async (
  id: number,
  page = 1
): Promise<Archetype> => {
  const $ = await getPage(
    `https://www.mtgtop8.com/archetype?a=${id}&current_page=${page}`
  );

  const archetype: Archetype = {
    id,
    name: parseName($('.w_title')),
    decks: [],
  };

  $('table table[align=center] .hover_tr').each((_, el) => {
    archetype.decks.push(parseDeck($(el)));
  });

  return archetype;
};
