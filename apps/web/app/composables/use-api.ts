export function useApi(
  tokenCookieName: 'auth_token' | 'customer_token' = 'auth_token'
) {
  const token = useCookie<string | null>(tokenCookieName);
  const config = useRuntimeConfig();

  return $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      if (token.value) {
        const headers = new Headers(options.headers);
        headers.set('Authorization', `Bearer ${token.value}`);
        options.headers = headers;
      }
    },
  });
}
