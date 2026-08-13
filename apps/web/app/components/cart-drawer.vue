<script setup lang="ts">
import { Minus, Plus, X } from '@lucide/vue';

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
          <h2 class="cart-drawer__header--title">
            Seu pedido em
            <span>{{ cartStore.storeName }}</span>
          </h2>
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
              <div>
                <strong class="cart-drawer__item--title">{{
                  item.name
                }}</strong>

                <!-- <ul
                  v-if="item.selectedOptions.length > 0"
                  class="cart-drawer__options"
                >
                  <li v-for="(option, i) in item.selectedOptions" :key="i">
                    {{ option.optionName }}
                    <span v-if="option.priceModifier > 0"
                      >(+ R$ {{ option.priceModifier.toFixed(2) }})</span
                    >
                  </li>
                </ul> -->
                <div class="cart-drawer__item--controls-wrapper">
                  <div class="cart-drawer__quantity">
                    <button @click="decreaseQuantity(item.id)">
                      <Minus :size="13" />
                    </button>
                    <span>{{ item.quantity }}</span>
                    <button @click="increaseQuantity(item.id)">
                      <Plus :size="13" />
                    </button>
                  </div>
                  <button
                    class="cart-drawer__item--remove"
                    @click="cartStore.removeItem(item.id)"
                  >
                    Remover
                  </button>
                </div>
              </div>

              <span class="cart-drawer__item--price"
                >R$ {{ itemTotal(item).toFixed(2) }}</span
              >
            </li>

            <div class="cart-drawer__info">
              <div>
                <span>Subtotal</span>
                <span>R$ 45,00 </span>
              </div>
              <div>
                <span>Taxa de serviço</span>
                <span>R$ 45,00 </span>
              </div>
              <div>
                <span>Taxa de entrega </span>
                <span>R$ 45,00 </span>
              </div>
            </div>
          </ul>

          <footer class="cart-drawer__footer">
            <div class="cart-drawer__total">
              <span>Total</span>
              <strong>R$ {{ cartStore.total.toFixed(2) }}</strong>
            </div>
            <button
              class="cart-drawer__footer--checkout"
              @click="handleCheckout"
            >
              Escolher forma de pagamento
            </button>
          </footer>
        </template>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
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
  width: 470px;
  max-width: 90vw;
  background: white;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 2.813rem;

    &--title {
      display: flex;
      flex-direction: column;
      gap: 10px;
      font-size: 0.875rem;
      color: #717171;
      font-weight: 300;

      span {
        font-size: 1.125rem;
        font-weight: 500;
        color: #3f3e3e;
      }
    }
  }

  &__list {
    flex: 1;
    display: flex;
    overflow-y: auto;
    flex-direction: column;
    gap: 1rem;
    margin: 0 2.813rem;
    border-top: 1px solid rgba(220, 220, 220, 0.5);
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 12px 0;
    border-bottom: 1px solid rgba(220, 220, 220, 0.5);

    &--title {
      font-size: 0.875rem;
      font-weight: 500;
      color: #3f3e3e;
    }

    &--controls-wrapper {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 10px;
    }

    &--remove {
      font-size: 0.875rem;
      line-height: 1em;
      color: #a6a29f;
    }

    &--price {
      font-size: 1rem;
      font-weight: 500;
      color: #50a773;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 10px;

    div {
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
        font-size: 0.875rem;
        color: #717171;
      }
    }
  }

  &__footer {
    padding: 1.25rem 2.813rem;

    &--checkout {
      width: 100%;
      background: #ea1d2c;
      color: #fff;
      border-radius: 4px;
      font-weight: 500;
      padding: 15px 0;
    }
  }
}

.cart-drawer__empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.cart-drawer__options {
  margin-top: 0.35rem;
  font-size: 0.8rem;
  color: #717171;
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

.cart-drawer__total {
  display: flex;
  justify-content: space-between;
  font-size: 1.05rem;
  margin-bottom: 1rem;
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
