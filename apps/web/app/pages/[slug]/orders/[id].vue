<script setup lang="ts">
import type { Order, OrderStatusValue } from '~/types/order';

definePageMeta({ layout: 'store', middleware: 'auth-customer' });
const route = useRoute();
const orderId = route.params.id as string;
const config = useRuntimeConfig();

const { data: order } = await useFetch<Order>(
  `${config.public.apiBase}/order/${orderId}`
);
const currentStatus = ref<OrderStatusValue>(order.value?.status ?? 'RECEIVED');

const statusLabels: Record<OrderStatusValue, string> = {
  RECEIVED: 'Aguardando confirmação da loja',
  PREPARING: 'Loja aceitou! Preparando seu pedido',
  OUT_FOR_DELIVERY: 'Saiu para entrega',
  DELIVERED: 'Entregue',
  CANCELLED: 'Pedido cancelado',
};

const statusSteps: OrderStatusValue[] = [
  'RECEIVED',
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

useOrderTracking(orderId, (status) => {
  currentStatus.value = status as OrderStatusValue;
});
</script>

<template>
  <div class="order-tracking">
    <h1>Acompanhe seu pedido</h1>

    <p class="order-tracking__status">{{ statusLabels[currentStatus] }}</p>

    <ul v-if="currentStatus !== 'CANCELLED'" class="order-tracking__steps">
      <li
        v-for="step in statusSteps"
        :key="step"
        :class="{
          active:
            statusSteps.indexOf(currentStatus) >= statusSteps.indexOf(step),
        }"
      >
        {{ statusLabels[step] }}
      </li>
    </ul>
  </div>
</template>
