const number = new Intl.NumberFormat("id-ID");

export function formatNumber(value: number) {
  return number.format(value);
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}
