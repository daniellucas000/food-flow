<script setup lang="ts">
import { ChevronDown } from '@lucide/vue';
import { asideMenu } from '~/constants/aside-menu';

const route = useRoute();
const headerTitle = useHeaderTitle();

const storeStore = useStoreStore();
const { logout } = useAuth();

const isProfileOpen = ref(false);

function toggleProfile() {
  isProfileOpen.value = !isProfileOpen.value;
}

async function handleLogout() {
  logout();
  await navigateTo('/admin/login');
}

watch(
  () => route.meta.title,
  (title) => {
    headerTitle.value = (title as string) ?? '';
  },
  { immediate: true }
);
</script>

<template>
  <div class="admin-layout">
    <aside class="admin-layout__aside">
      <h1>Logo</h1>

      <NuxtLink
        class="admin-layout__aside--link"
        v-for="item in asideMenu"
        :key="item.to"
        :to="item.to"
      >
        <component :is="item.icon" />

        <span>
          {{ item.label }}
        </span>
      </NuxtLink>
    </aside>
    <main class="admin-layout__main">
      <header>
        <h2>{{ headerTitle }}</h2>

        <div ref="profileRef" class="profile">
          <button class="profile__trigger" @click="toggleProfile">
            <img
              v-if="storeStore.store?.logoUrl"
              :src="storeStore.store.logoUrl"
              :alt="storeStore.store?.name"
            />
            <span v-else class="profile__trigger--placeholder">
              {{ storeStore.store?.name?.charAt(0) }}
            </span>

            <span class="store-profile__name">{{
              storeStore.store?.name
            }}</span>
            <ChevronDown />
          </button>

          <div v-if="isProfileOpen" class="profile__dropdown">
            <NuxtLink
              to="/admin/settings"
              class="profile__dropdown--item"
              @click="isProfileOpen = false"
            >
              Alterar perfil
            </NuxtLink>
            <button
              class="profile__dropdown--item danger"
              @click="handleLogout"
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      <div class="admin-layout__main--wrapper">
        <slot />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.admin-layout {
  display: flex;

  &__aside {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 200px;
    height: 100vh;
    padding: 20px;
    background: #fff;
    border-right: 1px solid #f0f0f3;

    h1 {
      margin-bottom: 20px;
    }

    &--link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 0;
    }
  }

  &__main {
    flex: 1;
    background: #f5f5fa;

    &--wrapper {
      max-width: 1366px;
      margin: 0 auto;
      padding: 2rem;
    }

    header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      background: #fff;
      padding: 20px;
      border-bottom: 1px solid #f0f0f3;

      .profile {
        position: relative;

        &__trigger {
          display: flex;
          align-items: center;
          gap: 20px;

          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }

          &--placeholder {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #5e81f4;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            color: #fff;
          }
        }

        &__dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          z-index: 100;
          background: #fff;
          border: 1px solid #ececec;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          min-width: 180px;
          overflow: hidden;

          &--item {
            display: block;
            width: 100%;
            padding: 10px 16px;
            text-align: left;
            background: transparent;
            border: none;
            cursor: pointer;

            &.danger {
              color: #d32f2f;
            }
          }
        }
      }
    }
  }
}
</style>
