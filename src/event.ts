import { getPage, url, match, parseDeckLink, isDefined } from './utils';
import { ShortFormat } from './format';
import { ShortDeck } from './deck';

export type ShortEvent = { id: number; name: string };

type WithRanks<T> = T & { ranks: number[] };

export class Event implements ShortEvent {
  public static async get(id: number): Promise<Event> {
    const $ = await getPage(url.event(id));

    if ($.html().includes('No event could be found.')) {
      throw new Error(`No event ${id}`);
    }

    return new Event($);
  }

  id: number;
  name: string;

  format: ShortFormat;
  rank: number;
  playerCount: number;
  date: Date;
  decks: WithRanks<ShortDeck>[] = [];

  private constructor($: CheerioStatic) {
    const chosenLinkData = parseDeckLink($('.chosen_tr a').attr('href'));

    this.id = chosenLinkData.event;

    this.name = $('.w_title td:first-child').text().trim();

    this.format = {
      name: match($('table table td[align="center"]').html() || '', /(.+) <div/)[0].trim(),
      code: chosenLinkData.format,
    };

    const stars = $('img[src="/graph/star.png"]').length;
    const bigstars = $('img[src="/graph/bigstar.png"]').length;
    this.rank = 10 * bigstars + stars;

    const [playerCount, date] = match($('table table td[align="center"]').html() || '', /(\d+) players - (.+)/);

    this.playerCount = parseInt(playerCount, 10);

    this.date = new Date(`${date}Z`);

    this.decks = $('.hover_tr, .chosen_tr')
      .get()
      .map((el) => {
        try {
          const linkData = parseDeckLink($(el).find('a').first().attr('href'));
          return {
            ranks: $(el).find('div:first-child').text().split('-').map(Number),
            eventId: linkData.event,
            id: linkData.deck,
            name: $(el).find('a').first().text(),
          };
        } catch (error) {
          return;
        }
      })
      .filter(isDefined);
  }
}
