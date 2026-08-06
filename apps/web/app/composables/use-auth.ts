import type { AuthResponse } from '~/types/auth';

interface RegisterStorePayload {
  store: {
    name: string;
    slug: string;
    phone: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    openingHours: object;
  };
  owner: { name: string; email: string; password: string };
}

export function useAuth() {
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60,
    sameSite: 'strict',
  });
  const authStore = useAuthStore();
  const api = useApi();

  async function login(email: string, password: string) {
    const { access_token, user } = await api<AuthResponse>('/auth/signin', {
      method: 'POST',
      body: { email, password },
    });
    token.value = access_token;
    authStore.setUser(user);
  }

  async function registerStore(payload: RegisterStorePayload) {
    const { access_token, user } = await api<AuthResponse>(
      '/auth/store-signup',
      {
        method: 'POST',
        body: payload,
      }
    );
    token.value = access_token;
    authStore.setUser(user);
  }

  function logout() {
    token.value = null;
    authStore.clearUser();
  }

  return { login, registerStore, logout };
}
