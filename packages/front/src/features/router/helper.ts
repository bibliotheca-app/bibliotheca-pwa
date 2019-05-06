export const getDefaultRoute = () => {
  const isSmartphone = !!('ontouchstart' in window);

  return isSmartphone ? '/borrow-or-return' : '/book-list';
};
