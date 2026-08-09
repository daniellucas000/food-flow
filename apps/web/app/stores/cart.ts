import { defineStore } from 'pinia';

export interface CartItem {
  id: string; // id único da linha do carrinho (não do menuItem)
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

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);
  const storeId = ref<string | null>(null);

  const total = computed(() =>
    items.value.reduce((sum, item) => {
      const optionsTotal = item.selectedOptions.reduce(
        (s, o) => s + o.priceModifier,
        0
      );
      return sum + (item.unitPrice + optionsTotal) * item.quantity;
    }, 0)
  );

  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  );

  function addItem(newStoreId: string, item: Omit<CartItem, 'id'>) {
    if (storeId.value && storeId.value !== newStoreId) {
      items.value = [];
    }
    storeId.value = newStoreId;
    items.value.push({ ...item, id: crypto.randomUUID() });
  }

  function removeItem(id: string) {
    items.value = items.value.filter((item) => item.id !== id);
  }

  function clear() {
    items.value = [];
    storeId.value = null;
  }

  return { items, total, itemCount, addItem, removeItem, clear };
});
