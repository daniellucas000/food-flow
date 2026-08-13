<script setup lang="ts">
import { CheckCircle } from '@lucide/vue';

definePageMeta({
  layout: 'store',
  middleware: 'auth-customer',
});

const route = useRoute();
const slug = route.params.slug as string;
const orderId = route.params.id as string;

const { fetchOrderById } = useOrders();

const order = ref<Awaited<ReturnType<typeof fetchOrderById>> | null>(null);
const errorMessage = ref('');

try {
  order.value = await fetchOrderById(orderId);
} catch {
  errorMessage.value = 'Pedido não encontrado';
}

const statusLabels: Record<string, string> = {
  RECEIVED: 'Recebido',
  PREPARING: 'Em preparo',
  OUT_FOR_DELIVERY: 'Saiu para entrega',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
};
</script>

<template>
  <div v-if="errorMessage" class="order-page__error">{{ errorMessage }}</div>

  <div v-else-if="order" class="order-page">
    <div class="order-page__success">
      <CheckCircle :size="48" color="#50a773" />
      <h1>Pedido confirmado!</h1>
      <p>Seu pedido foi enviado para a loja.</p>
    </div>

    <section class="order-page__card">
      <div class="order-page__row">
        <span>Status</span>
        <strong>{{ statusLabels[order.status] ?? order.status }}</strong>
      </div>

      <div class="order-page__row">
        <span>Pagamento</span>
        <strong>{{
          order.paymentMethod === 'ONLINE' ? 'Online' : 'Na entrega'
        }}</strong>
      </div>

      <div v-if="order.address" class="order-page__address">
        <span>Entregar em</span>
        <p>
          {{ order.address.street }}, {{ order.address.number }}
          <span v-if="order.address.complement">
            - {{ order.address.complement }}</span
          >
          <br />
          {{ order.address.neighborhood }}, {{ order.address.city }} -
          {{ order.address.state }}
        </p>
      </div>

      <ul class="order-page__items">
        <li v-for="item in order.items" :key="item.id">
          {{ item.quantity }}x — R$ {{ item.unitPrice }}
        </li>
      </ul>

      <div class="order-page__totals">
        <div>
          <span>Subtotal</span>
          <span>R$ {{ order.subtotal }}</span>
        </div>
        <div>
          <span>Entrega</span>
          <span>R$ {{ order.deliveryFee }}</span>
        </div>
        <div class="order-page__total-final">
          <strong>Total</strong>
          <strong>R$ {{ order.total }}</strong>
        </div>
      </div>
    </section>

    <NuxtLink :to="`/${slug}`" class="order-page__back"
      >Voltar ao cardápio</NuxtLink
    >
  </div>
</template>

<style scoped>
.order-page {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
}
.order-page__error {
  text-align: center;
  padding: 3rem;
  color: #e63946;
}
.order-page__success {
  text-align: center;
  margin-bottom: 2rem;
}
.order-page__success h1 {
  font-size: 1.4rem;
  margin-top: 0.5rem;
}
.order-page__card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.5rem;
}
.order-page__row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f2f2f2;
}
.order-page__address {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f2f2f2;
  font-size: 0.9rem;
}
.order-page__address span {
  color: #717171;
  font-size: 0.8rem;
}
.order-page__items {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f2f2f2;
  font-size: 0.9rem;
}
.order-page__totals div {
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0;
  font-size: 0.9rem;
}
.order-page__total-final {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #eee;
  font-size: 1.05rem;
}
.order-page__back {
  display: block;
  text-align: center;
  margin-top: 1.5rem;
  color: #e63946;
  font-weight: 600;
  text-decoration: none;
}
</style>
