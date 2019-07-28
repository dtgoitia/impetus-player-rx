import { take, map } from 'rxjs/operators';
import { timer } from 'rxjs';

export const countDownTimer = start => {
  return timer(0, 1000)
    .pipe(
      take(start + 1),
      map(time => start - time),
    );
}
