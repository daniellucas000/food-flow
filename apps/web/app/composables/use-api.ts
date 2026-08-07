export function useApi(
  tokenCookieName: 'auth_token' | 'customer_token' = 'auth_token'
) {
  const token = useCookie<string | null>(tokenCookieName);

  return $fetch.create({
    baseURL: 'http://localhost:3333',
    onRequest({ options }) {
      if (token.value) {
        const headers = new Headers(options.headers);
        headers.set('Authorization', `Bearer ${token.value}`);
        options.headers = headers;
      }
    },
  });
}
