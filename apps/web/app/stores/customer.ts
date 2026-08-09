import { defineStore } from 'pinia';
import type { CustomerUser } from '~/types/customer';

export const useCustomerStore = defineStore('customer', () => {
  const customer = ref<CustomerUser | null>(null);

  function setCustomer(newCustomer: CustomerUser) {
    customer.value = newCustomer;
  }

  function clearCustomer() {
    customer.value = null;
  }

  return { customer, setCustomer, clearCustomer };
});
