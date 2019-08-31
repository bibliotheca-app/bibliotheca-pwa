export const Isbn = {
  normalize(isbn: string): string | null {
    switch (isbn.length) {
      case 10:
        const tmp = '978' + isbn.substring(0, 9);
        return tmp + isbn13CheckDigit(tmp);
      case 13:
        return isbn;
      default:
        return null;
    }
  },
};

// https://en.wikipedia.org/wiki/International_Standard_Book_Number#ISBN-13_check_digit_calculation
function isbn13CheckDigit(withoutCd: string): string {
  const s = Array.from(withoutCd)
    .map(c => Number(c))
    .reduce((acc, cur, idx) => acc + (idx % 2 !== 0 ? cur * 3 : cur));
  const r = 10 - (s % 10);
  return `${r % 10}`;
}
