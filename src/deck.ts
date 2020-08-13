import { getPage, url, match, ListOf, WithCount, parseDeckLink } from './utils';

import { ShortArchetype } from './archetype';
import { ShortFormat } from './format';

export type ShortDeck = { eventId: number; id: number; name: string };

export type CardGroup = 'mainboard' | 'sideboard' | 'commander';

export type Card = { name: string; isCompanion?: boolean };

export class Deck implements ShortDeck {
  public static async get(eventId: number, id: number): Promise<Deck> {
    const $ = await getPage(url.deck(eventId, id));

    if ($('table table table td td .hover_tr').html() == null) {
      throw new Error(`No deck ${id} for event ${eventId}`);
    }

    return new Deck($);
  }

  eventId: number;
  id: number;
  name: string;

  format: ShortFormat;
  archetype: ShortArchetype;
  player: string;
  result: string;

  mainboard: ListOf<Card> = [];
  sideboard: ListOf<Card> = [];
  commander: ListOf<Card> = [];

  private constructor($: CheerioStatic) {
    const chosenLinkData = parseDeckLink($('.chosen_tr a').attr('href'));

    this.eventId = chosenLinkData.event;

    this.id = chosenLinkData.deck;

    this.name = $('table .chosen_tr :not([align=right]) .topic').text().trim();

    this.format = {
      name: match($('table table td[align="center"]').html() || '', /(.+) <div/)[0].trim(),
      code: chosenLinkData.format,
    };

    const [archetypeId, archetypeName] = match(
      $('.Nav_link').eq(1).html() || '',
      /^<a href="archetype\?a=(\d+)">(.+)<br>decks<\/a>$/
    );

    this.archetype = {
      id: parseInt(archetypeId, 10),
      name: archetypeName.trim(),
    };

    this.player = $('table .chosen_tr [align=right] .topic').text().trim();

    this.result = $('table .chosen_tr [align=center]').text().trim();

    let currentGroup: CardGroup = 'mainboard';
    $('table table table td td').each((_, el) => {
      const isCard = $('.hover_tr', el).length > 0;
      if (isCard) {
        this[currentGroup].push(parseCard($(el)));
      } else {
        currentGroup = parseGroup($(el));
      }
    });
  }
}

const parseCard = ($el: Cheerio): WithCount<Card> => {
  const [count, name] = match($el.text(), /^(\d+) (.+)$/);

  const card: WithCount<Card> = {
    count: parseInt(count, 10),
    name: name.trim(),
  };

  const isCompanion = $el.find('[id="companion_%%%"]').length > 0;
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
