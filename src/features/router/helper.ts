export const getDefaultRoute = () => {
  const isSmartphone = !!('ontouchstart' in window);

  return isSmartphone ? '/barcode-load' : '/book-list';
};
