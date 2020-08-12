import { getPage } from './utils';

export type Format = { name: string; code: string };

export const getFormats = async (): Promise<Format[]> => {
  const $ = await getPage(`https://www.mtgtop8.com/`);

  const formats: Format[] = [];

  $('table')
    .eq(1)
    .find('td')
    .each((_, el) => {
      const link = $(el).find('a').attr('href');
      const linkRegexp = /https:\/\/www\.mtgtop8\.com\/format\?f=(.+)/;
      const linkMatch = link?.match(linkRegexp);
      if (!linkMatch) return;
      const code = linkMatch[1].trim().toUpperCase();

      const alt = $(el).find('img').attr('id');
      if (!alt) return;
      const name = alt
        .replace(/^menu_/, '')
        .replace(/_/g, ' ')
        .toLowerCase();

      formats.push({ name, code });
    });

  $('#other_tooltip_content div').each((_, el) => {
    const link = $(el).find('a').attr('href');
    const linkRegexp = /https:\/\/www\.mtgtop8\.com\/format\?f=(.+)/;
    const linkMatch = link?.match(linkRegexp);
    if (!linkMatch) return;
    const code = linkMatch[1].trim().toUpperCase();

    const alt = $(el).find('img').attr('id');
    if (!alt) return;
    const name = alt
      .replace(/^menu_/, '')
      .replace(/_/g, ' ')
      .toLowerCase();

    formats.push({ name, code });
  });

  return formats;
};
