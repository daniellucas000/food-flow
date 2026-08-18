<script setup lang="ts">
import { asideMenu } from '~/constants/aside-menu';
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
        <h2>Tal coisa</h2>
        <ul>
          <li>Alguma coisa</li>
          <li>Alguma coisa</li>
          <li>Alguma coisa</li>
        </ul>
      </header>
      <div>
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
    border-right: 1px solid #f5f0eb;
    min-width: 200px;
    height: 100vh;
    padding: 20px;

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

    header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      border-bottom: 1px solid #f5f0eb;
      padding: 20px;

      ul {
        display: flex;
      }
    }

    > div {
      max-width: 1366px;
      margin: 0 auto;
    }
  }
}
</style>
