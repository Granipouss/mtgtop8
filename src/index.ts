import ms from 'ms';

import lunchtime from './lunchtime';
import millisecondsUntil from './millisecondsUntil';

export default function howLongUntilLunch(hours = 12, minutes = 30): string {
  const millisecondsUntilLunchTime = millisecondsUntil(
    lunchtime(hours, minutes)
  );
  return ms(millisecondsUntilLunchTime, { long: true });
}
