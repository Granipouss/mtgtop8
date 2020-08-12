import { getPage } from './utils';

const URL = `https://www.mtgtop8.com/event?e=26139&d=397720&f=EDH`;

type Deck = {
  player: string;
  result: string;
};

export const fetchSample = async (): Promise<Deck> => {
  const $ = await getPage(URL);

  return {
    player: $('table .chosen_tr [align=right] .topic').text().trim(),
    result: $('table .chosen_tr [align=center]').text().trim(),
  };
};
