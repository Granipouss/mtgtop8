import fetch from 'node-fetch';
import { load } from 'cheerio';
import { decode } from 'iconv-lite';

const ENCODING = 'windows-1252';

export const getPage = async (url: string): Promise<CheerioStatic> => {
  const response = await fetch(url);
  return load(decode(await response.buffer(), ENCODING));
};
