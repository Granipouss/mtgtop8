import { getPage, match, ListOf, isDefined, url } from './utils';

import { ShortArchetype } from './archetype';
import { ShortEvent } from './event';

export type ShortFormat = { name: string; code: string };

export class Format implements ShortFormat {
  public static async get(code: string): Promise<Format> {
    const $ = await getPage(url.format(code));

    if (getTableRows($, /Metagame Breakdown/).length === 1) {
      throw new Error(`No format for code ${code}`);
    }

    return new Format($);
  }

  public static async getAll(): Promise<ShortFormat[]> {
    const $ = await getPage(url.base());
    return [...$('table').eq(1).find('td').get(), ...$('#other_tooltip_content div').get()]
      .map((el) => {
        try {
          const [code] = match($(el).find('a').attr('href'), /https:\/\/www\.mtgtop8\.com\/format\?f=(.+)/);

          const alt = $(el).find('img').attr('id');
          if (!alt) return;
          const name = alt
            .replace(/^menu_/, '')
            .replace(/_/g, ' ')
            .toLowerCase();

          return { name, code };
        } catch (error) {
          return;
        }
      })
      .filter(isDefined);
  }

  public name: string;
  public code: string;

  public archetypes: ListOf<ShortArchetype> = [];

  private constructor($: CheerioStatic) {
    this.code = match($('table table .hover_tr a').attr('href'), /archetype\?a=.+&meta=.+&f=(.+)/)[0];

    this.name = $('table table a[target=_blank]')
      .text()
      .replace(/ Construction Rules$/, '')
      .toLowerCase()
      .trim();

    this.archetypes = getTableRows($, /Metagame Breakdown/)
      .filter((el) => $(el).is('.hover_tr'))
      .map((el) => {
        const [idString] = match($(el).find('a').attr('href'), /archetype\?a=(\d+)&meta=.+&f=.+/);
        return {
          id: parseInt(idString, 10),
          name: $(el).find('a').text().trim(),
          count: parseInt($(el).find('[align=right]').first().text(), 10),
        };
      });
  }

  async getEvents(page = 1): Promise<ShortEvent[]> {
    const $ = await getPage(url.format(this.code, page));
    return getTableRows($, /^(Events \d+ to \d+|Last \d+ events)$/).map((el) => {
      const [idString] = match($(el).find('a').attr('href'), /event\?e=(\d+)&f=.+/);
      return {
        id: parseInt(idString, 10),
        name: $(el).find('a').text().trim(),
      };
    });
  }
}

const getTableRows = ($: CheerioStatic, title: RegExp): CheerioElement[] => {
  try {
    const table: CheerioElement | undefined = $('table table')
      .get()
      .find((el) => $('tr:first-child', el).text().match(title));
    return table ? $(table).find('tr').get().splice(1) : [];
  } catch (error) {
    return [];
  }
};
