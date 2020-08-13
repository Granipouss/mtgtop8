import fetch from 'node-fetch';
import { load } from 'cheerio';
import { decode } from 'iconv-lite';

// = Types ===

export type WithCount<T> = T & { count: number };
export type ListOf<T> = WithCount<T>[];

export const isDefined = <T>(item: T | undefined): item is T => item != null;

// = Request ===

const ENCODING = 'windows-1252';

export const url = {
  base: (): string => `https://www.mtgtop8.com`,
  format: (format: string, page = 1): string => `${url.base()}/format?f=${format}&cp=${page}`,
  event: (id: number): string => `${url.base()}/event?e=${id}`,
  deck: (eventId: number, deckId: number): string => `${url.event(eventId)}&d=${deckId}`,
  archetype: (id: number, page = 1): string => `${url.base()}/archetype?a=${id}&current_page=${page}`,
};

export const getPage = async (url: string): Promise<CheerioStatic> => {
  const response = await fetch(url);
  return load(decode(await response.buffer(), ENCODING));
};

// = String ===

export const match = (text = '', rexgep: RegExp): string[] => {
  const found = text.match(rexgep);
  if (!found) throw new Error('No match found');
  const [, ...params] = found;
  return params;
};

export const parseDeckLink = (link = ''): { event: number; deck: number; format: string } => {
  const [e, d, f] = match(link, /\?e=(\d+)&d=(\d+)&f=(.+)/);
  return {
    event: parseInt(e, 10),
    deck: parseInt(d, 10),
    format: f.trim(),
  };
};
