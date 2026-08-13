<script setup lang="ts">
definePageMeta({
  layout: 'store',
  middleware: 'auth-customer',
});

const route = useRoute();
const slug = route.params.slug as string;

const cartStore = useCartStore();
const { createOrder } = useOrders();

const deliveryFee = 6.0;

const form = reactive({
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zipCode: '',
  paymentMethod: 'CASH_ON_DELIVERY' as 'ONLINE' | 'CASH_ON_DELIVERY',
  notes: '',
});

const errorMessage = ref('');
const isLoading = ref(false);

const total = computed(() => cartStore.total + deliveryFee);

async function handleSubmit() {
  if (cartStore.items.length === 0) {
    errorMessage.value = 'Seu carrinho está vazio';
    return;
  }

  errorMessage.value = '';
  isLoading.value = true;

  try {
    const order = await createOrder({
      deliveryType: 'DELIVERY',
      paymentMethod: form.paymentMethod,
      deliveryFee,
      address: {
        street: form.street,
        number: form.number,
        complement: form.complement || undefined,
        neighborhood: form.neighborhood,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
      },
      items: cartStore.items.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        selectedOptions: item.selectedOptions.map((o) => ({
          itemOptionId: o.itemOptionId,
          priceModifier: o.priceModifier,
        })),
      })),
      notes: form.notes || undefined,
    });

    cartStore.clear();
    await navigateTo(`/${slug}/orders/${order.id}`);
  } catch {
    errorMessage.value =
      'Não foi possível finalizar o pedido. Tente novamente.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="checkout-page">
    <h1>Finalizar pedido</h1>

    <section class="checkout-page__summary">
      <h2>Itens</h2>
      <ul>
        <li v-for="item in cartStore.items" :key="item.id">
          {{ item.quantity }}x {{ item.name }} — R$
          {{ item.unitPrice.toFixed(2) }}
        </li>
      </ul>
      <p class="checkout-page__total">
        Subtotal: R$ {{ cartStore.total.toFixed(2) }} + Entrega: R$
        {{ deliveryFee.toFixed(2) }} =
        <strong>R$ {{ total.toFixed(2) }}</strong>
      </p>
    </section>

    <form class="checkout-page__form" @submit.prevent="handleSubmit">
      <h2>Endereço de entrega</h2>

      <label>Rua</label>
      <input v-model="form.street" required />

      <label>Número</label>
      <input v-model="form.number" required />

      <label>Complemento</label>
      <input v-model="form.complement" />

      <label>Bairro</label>
      <input v-model="form.neighborhood" required />

      <label>Cidade</label>
      <input v-model="form.city" required />

      <label>Estado</label>
      <input v-model="form.state" required maxlength="2" />

      <label>CEP</label>
      <input v-model="form.zipCode" required />

      <h2>Pagamento</h2>

      <label>
        <input
          type="radio"
          v-model="form.paymentMethod"
          value="CASH_ON_DELIVERY"
        />
        Pagar na entrega
      </label>
      <label>
        <input type="radio" v-model="form.paymentMethod" value="ONLINE" />
        Pagar online
      </label>

      <label>Observações (opcional)</label>
      <textarea v-model="form.notes" />

      <p v-if="errorMessage" class="checkout-page__error">{{ errorMessage }}</p>

      <button type="submit" :disabled="isLoading">
        {{
          isLoading
            ? 'Enviando...'
            : `Confirmar pedido — R$ ${total.toFixed(2)}`
        }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.checkout-page {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
}
.checkout-page__form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1.5rem;
}
.checkout-page__form input,
.checkout-page__form textarea {
  padding: 0.7rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}
.checkout-page__total {
  margin-top: 1rem;
  font-size: 0.95rem;
}
.checkout-page__error {
  color: #e63946;
}
.checkout-page__form button[type='submit'] {
  margin-top: 1rem;
  padding: 0.9rem;
  background: #e63946;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
</style>
