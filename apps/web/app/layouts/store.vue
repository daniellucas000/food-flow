<script setup lang="ts">
import { Handbag, LogOut } from '@lucide/vue';

const route = useRoute();
const slug = route.params.slug as string;

const customerStore = useCustomerStore();
const cartStore = useCartStore();

const { fetchProfile, logout } = useCustomerAuth();
const token = useCookie('customer_token');

if (token.value && !customerStore.customer) {
  try {
    await fetchProfile();
  } catch {
    token.value = null;
  }
}

async function handleLogout() {
  logout();
  await navigateTo(`/${slug}`);
}
</script>

<template>
  <div class="store-layout">
    <header class="store-header">
      <NuxtLink to="/" class="store-nav__logo">Ifoode</NuxtLink>

      <div class="store-nav__search">
        <input placeholder="Busque por item" />
      </div>

      <div v-if="customerStore.customer" class="store-header__user">
        <span class="store-header__user-name"
          >Olá, {{ customerStore.customer.name }}</span
        >
        <button
          :class="['store-header__cart', { active: cartStore.itemCount > 0 }]"
          @click="cartStore.open()"
        >
          <Handbag :size="24" />
          <div>
            <span class="store-header__cart--cost">
              R$ {{ cartStore.total }}
            </span>
            <span class="store-header__cart--items">
              {{ cartStore.itemCount }}
              {{ cartStore.itemCount === 1 ? 'item' : 'itens' }}
            </span>
          </div>
        </button>
        <button class="store-header__logout" @click="handleLogout">
          <LogOut />
        </button>
      </div>

      <NuxtLink v-else :to="`/${slug}/login`" class="store-nav__login">
        Entrar
      </NuxtLink>
    </header>
    <slot />
  </div>
  <CartDrawer />
</template>

<style scoped lang="scss">
.store-layout {
  position: relative;
}
.store-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  position: sticky;
  width: 100vw;
  height: 80px;
  background-color: #fff;
  box-shadow: inset 0 -1px 0 #dcdcdc;
  top: 0;
  z-index: 9997;
  padding: 20px 42px;

  &__user {
    display: flex;
    gap: 24px;

    > span {
      font-size: 1rem;
      color: #717171;
      font-weight: 500;
      display: flex;
      align-items: center;
      text-align: left;
      line-break: anywhere;
    }
  }

  &__cart {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 200px;
    gap: 10px;
    transition: background-color 0.3s ease-in-out;

    &:hover {
      background-color: #f7f7f7;
    }

    &.active {
      background: #ea1d2c;
      color: #fff;

      span {
        color: #fff;
      }
    }

    div {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    &--cost {
      font-size: 0.75rem;
      line-height: 1rem;
      color: #717171;
    }

    &--items {
      font-size: 0.625rem;
      line-height: 0.75rem;
      color: #717171;
    }
  }
}

.store-nav__logo {
  font-weight: 700;
  font-size: 1.25rem;
  color: #e63946;
  text-decoration: none;
}

.store-nav__search {
  flex: 1;
  max-width: 500px;
}

.store-nav__search input {
  width: 100%;
  padding: 0.6rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.store-nav__user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.store-nav__login {
  color: #333;
  text-decoration: none;
  font-size: 0.9rem;
}
</style>
