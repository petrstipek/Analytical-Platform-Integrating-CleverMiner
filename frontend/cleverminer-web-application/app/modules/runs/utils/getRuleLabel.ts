export const getLabel = (
  cedent: { variable: string; categories: (string | number)[] }[] | undefined,
) => {
  if (!cedent) return '';
  return cedent.map((c) => `${c.variable}(${c.categories.join(', ')})`).join(' & ');
};
