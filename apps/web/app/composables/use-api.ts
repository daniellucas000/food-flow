export function useApi(
  tokenCookieName: 'auth_token' | 'customer_token' = 'auth_token'
) {
  const token = useCookie<string | null>(tokenCookieName);
  const config = useRuntimeConfig();

  return $fetch.create({
    baseURL: 'http://localhost:3333',
    onRequest({ options }) {
      if (token.value) {
        options.headers = {
          ...options.headers,
        };
      }
    },
  });
}
