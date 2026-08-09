import type { CustomerAuthResponse, CustomerUser } from '~/types/customer';

export function useCustomerAuth() {
  const token = useCookie<string | null>('customer_token', {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'strict',
  });
  const customerStore = useCustomerStore();
  const api = useApi('customer_token');

  async function signUp(
    slug: string,
    data: { name: string; phone: string; email: string; password: string }
  ) {
    const { access_token, customer } = await api<CustomerAuthResponse>(
      '/auth/customer/signup',
      { method: 'POST', body: { slug, ...data } }
    );
    token.value = access_token;
    customerStore.setCustomer(customer);
  }

  async function signIn(slug: string, email: string, password: string) {
    const { access_token, customer } = await api<CustomerAuthResponse>(
      '/auth/customer/signin',
      { method: 'POST', body: { slug, email, password } }
    );
    token.value = access_token;
    customerStore.setCustomer(customer);
  }

  async function continueAsGuest(
    slug: string,
    data: { name: string; phone: string }
  ) {
    const { access_token, customer } = await api<CustomerAuthResponse>(
      '/auth/customer/guest',
      { method: 'POST', body: { slug, ...data } }
    );
    token.value = access_token;
    customerStore.setCustomer(customer);
  }

  async function fetchProfile() {
    const customer = await api<CustomerUser>('/auth/customer/me');
    customerStore.setCustomer(customer);
  }

  function logout() {
    token.value = null;
    customerStore.clearCustomer();
  }

  return { signUp, signIn, continueAsGuest, fetchProfile, logout };
}
