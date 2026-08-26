<script setup lang="ts">
import Dropdown from '~/components/ui/dropdown.vue';
import type { Order, OrderStatusValue } from '~/types/order';
import { ORDER_STATUS_LABELS } from '~/utils/order-status';

definePageMeta({
  middleware: 'auth-staff',
  layout: 'admin',
  title: 'Pedidos',
});

const { fetchStoreOrders, updateOrderStatus } = useOrders();

const orders = ref<Order[]>([]);
const isLoading = ref(true);
const statusFilter = ref<OrderStatusValue | 'ALL'>('ALL');
const periodFilter = ref<'today' | 'last7' | 'all'>('today');

async function loadOrders() {
  isLoading.value = true;
  orders.value = await fetchStoreOrders();
  isLoading.value = false;
}

onMounted(loadOrders);

const nextStatus: Partial<Record<OrderStatusValue, OrderStatusValue>> = {
  RECEIVED: 'PREPARING',
  PREPARING: 'OUT_FOR_DELIVERY',
  OUT_FOR_DELIVERY: 'DELIVERED',
};

const statusPriority: Record<OrderStatusValue, number> = {
  RECEIVED: 0,
  PREPARING: 1,
  OUT_FOR_DELIVERY: 2,
  DELIVERED: 3,
  CANCELLED: 4,
};

const statusFilterOptions: Array<{
  value: OrderStatusValue | 'ALL';
  label: string;
}> = [
  { value: 'ALL', label: 'Todos' },
  ...Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({
    value: value as OrderStatusValue,
    label,
  })),
];

const periodFilterOptions: Array<{
  value: typeof periodFilter.value;
  label: string;
}> = [
  { value: 'today', label: 'Hoje' },
  { value: 'last7', label: 'Últimos 7 dias' },
  { value: 'all', label: 'Tudo' },
];

const statusCounts = computed(() => {
  const counts: Partial<Record<OrderStatusValue, number>> = {};
  for (const order of ordersInPeriod.value) {
    counts[order.status] = (counts[order.status] ?? 0) + 1;
  }
  return counts;
});

const ordersInPeriod = computed(() => {
  if (periodFilter.value === 'all') return orders.value;

  const now = new Date();
  const cutoff = new Date(now);

  if (periodFilter.value === 'today') {
    cutoff.setHours(0, 0, 0, 0);
  } else {
    cutoff.setDate(cutoff.getDate() - 7);
  }

  return orders.value.filter((order) => new Date(order.createdAt) >= cutoff);
});

const filteredOrders = computed(() => {
  const base =
    statusFilter.value === 'ALL'
      ? ordersInPeriod.value
      : ordersInPeriod.value.filter(
          (order) => order.status === statusFilter.value
        );

  return [...base].sort((a, b) => {
    const priorityDiff = statusPriority[a.status] - statusPriority[b.status];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
});

const now = ref(Date.now());
let clockInterval: ReturnType<typeof setInterval>;

onMounted(() => {
  clockInterval = setInterval(() => {
    now.value = Date.now();
  }, 30_000);
});

onUnmounted(() => {
  clearInterval(clockInterval);
});

function elapsedLabel(createdAt: string): string {
  const diffMs = now.value - new Date(createdAt).getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return 'agora mesmo';
  if (diffMin < 60) return `há ${diffMin} min`;

  const diffHours = Math.floor(diffMin / 60);
  return `há ${diffHours}h${diffMin % 60 ? ` ${diffMin % 60}min` : ''}`;
}

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
    <div class="orders-page__toolbar">
      <div class="orders-page__filters">
        <button
          v-for="option in statusFilterOptions"
          :key="option.value"
          :class="[
            'orders-page__filter',
            { 'orders-page__filter--active': statusFilter === option.value },
          ]"
          @click="statusFilter = option.value"
        >
          {{ option.label }}
          <span
            v-if="
              option.value !== 'ALL' &&
              statusCounts[option.value as OrderStatusValue]
            "
            class="orders-page__filter-count"
          >
            {{ statusCounts[option.value as OrderStatusValue] }}
          </span>
        </button>
      </div>
      <Dropdown
        v-model="periodFilter"
        :options="periodFilterOptions"
        placeholder="Período"
      />
    </div>

    <div v-if="isLoading">Carregando...</div>

    <div v-else-if="filteredOrders.length === 0" class="orders-page__empty">
      Nenhum pedido {{ statusFilter === 'ALL' ? '' : 'nesse status' }}
    </div>

    <ul v-else class="orders-page__list">
      <li v-for="order in filteredOrders" :key="order.id" class="order-card">
        <div class="order-card__header">
          <strong>#{{ order.id.slice(0, 8) }}</strong>
          <span class="order-card__elapsed">{{
            elapsedLabel(order.createdAt)
          }}</span>
          <span
            :class="[
              'order-card__status',
              `order-card__status--${order.status.toLowerCase()}`,
            ]"
          >
            {{ ORDER_STATUS_LABELS[order.status] }}
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
            Avançar para "{{ ORDER_STATUS_LABELS[nextStatus[order.status]!] }}"
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
.orders-page__toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
}
.orders-page__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.orders-page__filter {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  font-size: 0.8rem;
  color: #555;
}
.orders-page__filter--active {
  background: #1a1a1a;
  color: white;
  border-color: #1a1a1a;
}
.orders-page__filter-count {
  background: rgba(0, 0, 0, 0.08);
  border-radius: 999px;
  padding: 0.05rem 0.4rem;
  font-size: 0.7rem;
  font-weight: 600;
}
.orders-page__filter--active .orders-page__filter-count {
  background: rgba(255, 255, 255, 0.2);
}
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
  background: #fff;
}
.order-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}
.order-card__elapsed {
  font-size: 0.75rem;
  color: #999;
  margin-left: auto;
  margin-right: 0.5rem;
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
