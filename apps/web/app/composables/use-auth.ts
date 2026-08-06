import { useAuthStore } from '~/stores/auth.store';
import type { AuthResponse } from '~/types/auth';

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

  function logout() {
    token.value = null;
    authStore.clearUser();
  }

  return { login, logout };
}
