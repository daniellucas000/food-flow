import type { StoreSummary } from '~/types/auth';

interface UpdateStorePayload {
  name?: string;
  phone?: string;
  whatsappNumber?: string;
  logoUrl?: string;
  bannerUrl?: string;
  isOpen?: boolean;
}

export function useStoreSettings() {
  const storeStore = useStoreStore();
  const api = useApi();

  async function updateStore(payload: UpdateStorePayload) {
    const updated = await api<StoreSummary>('/stores/me', {
      method: 'PATCH',
      body: payload,
    });
    storeStore.setStore(updated);
    return updated;
  }

  return { updateStore };
}
