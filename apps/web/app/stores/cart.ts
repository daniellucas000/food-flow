import { defineStore } from 'pinia';
export interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  selectedOptions: {
    groupName: string;
    optionName: string;
    priceModifier: number;
  }[];
}

export const useCartStore = defineStore(
  'cart',
  () => {
    const items = ref<CartItem[]>([]);
    const storeId = ref<string | null>(null);
    const storeName = ref<string | null>(null);
    const isOpen = ref(false);

    const total = computed(() =>
      items.value.reduce((sum, item) => {
        const optionsTotal = item.selectedOptions.reduce(
          (optionSum, option) => optionSum + option.priceModifier,
          0
        );
        return sum + (item.unitPrice + optionsTotal) * item.quantity;
      }, 0)
    );

    const itemCount = computed(() =>
      items.value.reduce((sum, item) => sum + item.quantity, 0)
    );

    function addItem(
      newStoreId: string,
      newStoreName: string,
      item: Omit<CartItem, 'id'>
    ) {
      if (storeId.value && storeId.value !== newStoreId) {
        items.value = [];
      }
      storeId.value = newStoreId;
      storeName.value = newStoreName;
      items.value.push({ ...item, id: crypto.randomUUID() });
    }

    function removeItem(id: string) {
      items.value = items.value.filter((item) => item.id !== id);
    }

    function clear() {
      items.value = [];
      storeId.value = null;
      storeName.value = null;
    }

    function open() {
      isOpen.value = true;
    }

    function close() {
      isOpen.value = false;
    }

    return {
      items,
      storeId,
      storeName,
      isOpen,
      total,
      itemCount,
      addItem,
      removeItem,
      clear,
      open,
      close,
    };
  },
  {
    persist: {
      pick: ['items', 'storeId', 'storeName'],
    },
  }
);
