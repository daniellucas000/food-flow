export function useCurrency() {
  function formatBRL(value: number | string): string {
    const numericValue = typeof value === 'string' ? Number(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numericValue);
  }

  return { formatBRL };
}
