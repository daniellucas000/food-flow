<!-- app/components/CartDrawer.vue -->
<script setup lang="ts">
import { Minus, Plus, Trash2, X } from '@lucide/vue';

const route = useRoute();
const slug = route.params.slug as string;

const cartStore = useCartStore();

function itemTotal(item: (typeof cartStore.items)[number]) {
  const optionsTotal = item.selectedOptions.reduce(
    (sum, o) => sum + o.priceModifier,
    0
  );
  return (item.unitPrice + optionsTotal) * item.quantity;
}

function increaseQuantity(id: string) {
  const item = cartStore.items.find((i) => i.id === id);
  if (item) item.quantity++;
}

function decreaseQuantity(id: string) {
  const item = cartStore.items.find((i) => i.id === id);
  if (item && item.quantity > 1) item.quantity--;
  else if (item) cartStore.removeItem(id);
}

async function handleCheckout() {
  cartStore.close();
  await navigateTo(`/${slug}/checkout`);
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="cartStore.isOpen"
        class="drawer-overlay"
        @click.self="cartStore.close()"
      />
    </Transition>

    <Transition name="slide">
      <aside v-if="cartStore.isOpen" class="cart-drawer">
        <header class="cart-drawer__header">
          <h2>Seu carrinho</h2>
          <button @click="cartStore.close()"><X :size="20" /></button>
        </header>

        <div v-if="cartStore.items.length === 0" class="cart-drawer__empty">
          <p>Seu carrinho está vazio</p>
        </div>

        <template v-else>
          <ul class="cart-drawer__list">
            <li
              v-for="item in cartStore.items"
              :key="item.id"
              class="cart-drawer__item"
            >
              <div class="cart-drawer__item-info">
                <strong>{{ item.name }}</strong>

                <ul
                  v-if="item.selectedOptions.length > 0"
                  class="cart-drawer__options"
                >
                  <li v-for="(option, i) in item.selectedOptions" :key="i">
                    {{ option.optionName }}
                    <span v-if="option.priceModifier > 0"
                      >(+ R$ {{ option.priceModifier.toFixed(2) }})</span
                    >
                  </li>
                </ul>

                <button
                  class="cart-drawer__remove"
                  @click="cartStore.removeItem(item.id)"
                >
                  <Trash2 :size="13" /> Remover
                </button>
              </div>

              <div class="cart-drawer__item-controls">
                <div class="cart-drawer__quantity">
                  <button @click="decreaseQuantity(item.id)">
                    <Minus :size="13" />
                  </button>
                  <span>{{ item.quantity }}</span>
                  <button @click="increaseQuantity(item.id)">
                    <Plus :size="13" />
                  </button>
                </div>
                <span class="cart-drawer__price"
                  >R$ {{ itemTotal(item).toFixed(2) }}</span
                >
              </div>
            </li>
          </ul>

          <footer class="cart-drawer__footer">
            <div class="cart-drawer__total">
              <span>Total</span>
              <strong>R$ {{ cartStore.total.toFixed(2) }}</strong>
            </div>
            <button class="cart-drawer__checkout" @click="handleCheckout">
              Finalizar pedido
            </button>
          </footer>
        </template>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9998;
}

.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 400px;
  max-width: 90vw;
  background: white;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
}

.cart-drawer__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eee;
}

.cart-drawer__header button {
  background: none;
  border: none;
  cursor: pointer;
}

.cart-drawer__empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.cart-drawer__list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-drawer__item {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f2f2f2;
}

.cart-drawer__options {
  margin-top: 0.35rem;
  font-size: 0.8rem;
  color: #717171;
}

.cart-drawer__remove {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
  background: none;
  border: none;
  color: #e63946;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0;
}

.cart-drawer__item-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.cart-drawer__quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.2rem 0.5rem;
}

.cart-drawer__quantity button {
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.cart-drawer__price {
  font-weight: 600;
  color: #50a773;
  font-size: 0.9rem;
}

.cart-drawer__footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid #eee;
}

.cart-drawer__total {
  display: flex;
  justify-content: space-between;
  font-size: 1.05rem;
  margin-bottom: 1rem;
}

.cart-drawer__checkout {
  width: 100%;
  padding: 0.85rem;
  background: #e63946;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
