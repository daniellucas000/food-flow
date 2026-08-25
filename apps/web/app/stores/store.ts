import { defineStore } from 'pinia';
import type { StoreSummary } from '~/types/auth';

export const useStoreStore = defineStore(
  'store',
  () => {
    const store = ref<StoreSummary | null>(null);

    function setStore(newStore: StoreSummary) {
      store.value = newStore;
    }

    function clearStore() {
      store.value = null;
    }

    return { store, setStore, clearStore };
  },
  { persist: true }
);
