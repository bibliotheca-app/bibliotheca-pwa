import { Observable, ObservableInput } from 'rxjs';
import { catchError } from 'rxjs/operators';

export * from 'typeless/rx';

export const catchLog = <T, O extends ObservableInput<any>>(
  fn: (err: any, caught: Observable<T>) => O,
) =>
  catchError<T, O>((err, source) => {
    if (process.env.NODE_ENV !== 'test') {
      // tslint:disable-next-line:no-console
      console.error(err);
    }
    return fn(err, source);
  });
