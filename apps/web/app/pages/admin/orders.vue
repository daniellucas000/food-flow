<script setup lang="ts">
import type { Order, OrderStatusValue } from '~/types/order';

definePageMeta({
  middleware: 'auth-staff',
  layout: 'admin',
  title: 'Pedidos',
});

const { fetchStoreOrders, updateOrderStatus } = useOrders();

const orders = ref<Order[]>([]);
const isLoading = ref(true);

async function loadOrders() {
  isLoading.value = true;
  orders.value = await fetchStoreOrders();
  isLoading.value = false;
}

onMounted(loadOrders);

const statusLabels: Record<OrderStatusValue, string> = {
  RECEIVED: 'Recebido',
  PREPARING: 'Em preparo',
  OUT_FOR_DELIVERY: 'Saiu para entrega',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
};

const nextStatus: Partial<Record<OrderStatusValue, OrderStatusValue>> = {
  RECEIVED: 'PREPARING',
  PREPARING: 'OUT_FOR_DELIVERY',
  OUT_FOR_DELIVERY: 'DELIVERED',
};

async function advanceStatus(order: Order) {
  const next = nextStatus[order.status];
  if (!next) return;

  await updateOrderStatus(order.id, next);
  await loadOrders();
}

async function cancelOrder(order: Order) {
  await updateOrderStatus(order.id, 'CANCELLED');
  await loadOrders();
}

const authStore = useAuthStore();

useOrderSocket(authStore.user!.storeId, (newOrder) => {
  orders.value.unshift(newOrder);
});
</script>

<template>
  <div class="orders-page">
    <div v-if="isLoading">Carregando...</div>

    <div v-else-if="orders.length === 0" class="orders-page__empty">
      Nenhum pedido ainda
    </div>

    <ul v-else class="orders-page__list">
      <li v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-card__header">
          <strong>#{{ order.id.slice(0, 8) }}</strong>
          <span
            :class="[
              'order-card__status',
              `order-card__status--${order.status.toLowerCase()}`,
            ]"
          >
            {{ statusLabels[order.status] }}
          </span>
        </div>

        <p v-if="order.customer">
          {{ order.customer.name }} — {{ order.customer.phone }}
        </p>

        <ul class="order-card__items">
          <li v-for="item in order.items" :key="item.id">
            {{ item.quantity }}x — R$ {{ item.unitPrice }}
          </li>
        </ul>

        <p class="order-card__total">Total: R$ {{ order.total }}</p>

        <div class="order-card__actions">
          <button v-if="nextStatus[order.status]" @click="advanceStatus(order)">
            Avançar para "{{ statusLabels[nextStatus[order.status]!] }}"
          </button>
          <button
            v-if="!['DELIVERED', 'CANCELLED'].includes(order.status)"
            class="order-card__cancel"
            @click="cancelOrder(order)"
          >
            Cancelar
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.orders-page__empty {
  color: #999;
  padding: 2rem 0;
}
.orders-page__list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.order-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1rem;
}
.order-card__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.order-card__status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  background: #f2f2f2;
}
.order-card__status--delivered {
  background: #e6f7ec;
  color: #1a7f37;
}
.order-card__status--cancelled {
  background: #fdeaea;
  color: #e63946;
}
.order-card__items {
  font-size: 0.85rem;
  color: #666;
  margin: 0.5rem 0;
}
.order-card__total {
  font-weight: 600;
}
.order-card__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}
.order-card__actions button {
  padding: 0.5rem 0.9rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  font-size: 0.85rem;
}
.order-card__cancel {
  color: #e63946;
  border-color: #e63946;
}
</style>
