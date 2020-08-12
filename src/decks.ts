import { getPage } from './utils';

export type ShortArchetype = { name: string; id: number };

export type CardGroup = 'mainboard' | 'sideboard' | 'commander';

export type Card = { count: number; name: string; isCompanion?: boolean };

export type Deck = {
  id: number;
  eventId: number;
  format: string;
  name: string;
  archetype: ShortArchetype;
  player: string;
  result: string;
} & {
  [group in CardGroup]: Card[];
};

const parseFormat = ($el: Cheerio): string => {
  const match = $el.html()?.match(/(.+) <div/);
  if (!match) throw new Error(`Cannot parse format: ${$el.text()}`);
  return match[1].trim();
};

const parseArchetype = ($el: Cheerio): ShortArchetype => {
  const regexp = /^<a href="archetype\?a=(\d+)">(.+)<br>decks<\/a>$/;
  const match = $el.html()?.match(regexp);
  if (!match) throw new Error(`Cannot parse archetype: ${$el.text()}`);

  const id = parseInt(match[1], 10);
  const name = match[2].trim();

  return { id, name };
};

const parseCard = ($el: Cheerio): Card => {
  const text = $el.text();
  const match = text.match(/^(\d+) (.+)$/);
  if (!match) throw new Error(`Cannot parse card: ${text}`);

  const count = parseInt(match[1], 10);
  const name = match[2].trim();
  const isCompanion = $el.find('[id="companion_%%%"]').length > 0;

  const card: Card = { count, name };
  if (isCompanion) card.isCompanion = true;

  return card;
};

const parseGroup = ($el: Cheerio): CardGroup => {
  switch ($el.text()) {
    case 'COMMANDER':
      return 'commander';
    case 'SIDEBOARD':
      return 'sideboard';
    default:
      return 'mainboard';
  }
};

export const getDeck = async (eventId: number, id: number): Promise<Deck> => {
  const $ = await getPage(`https://www.mtgtop8.com/event?e=${eventId}&d=${id}`);

  if ($.html().includes('No event could be found.')) {
    throw new Error(`No deck ${id} for event ${eventId}`);
  }

  const deck: Deck = {
    id,
    eventId,
    name: $('table .chosen_tr :not([align=right]) .topic').text().trim(),
    player: $('table .chosen_tr [align=right] .topic').text().trim(),
    result: $('table .chosen_tr [align=center]').text().trim(),
    format: parseFormat($('table table td[align="center"]').first()),
    archetype: parseArchetype($('.Nav_link').eq(1)),
    mainboard: [],
    sideboard: [],
    commander: [],
  };

  let currentGroup: CardGroup = 'mainboard';
  $('table table table td td').each((_, el) => {
    const isCard = $('.hover_tr', el).length > 0;
    if (isCard) {
      deck[currentGroup].push(parseCard($(el)));
    } else {
      currentGroup = parseGroup($(el));
    }
  });

  return deck;
};
