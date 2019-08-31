import { Isbn } from './Isbn';

it('normalize from 10-digit to 13-digit', () => {
  expect(Isbn.normalize('0306406152')).toBe('9780306406157');
});
it('return identity from 13-digit', () => {
  expect(Isbn.normalize('9780306406157')).toBe('9780306406157');
});
it('return null from other format', () => {
  expect(Isbn.normalize('aaa')).toBe(null);
});
