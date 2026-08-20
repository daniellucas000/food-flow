export function useHeaderTitle() {
  return useState<string>('header-title', () => '');
}
