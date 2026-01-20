export function formatDate(iso?: Date) {
  if (!iso) return '';
  return iso.toLocaleString();
}
