<!-- app/pages/[slug]/index.vue -->
<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;
const config = useRuntimeConfig();

const { data, pending, error } = await useFetch(
  `http://localhost:3333/stores/${slug}/menu`
);

const searchTerm = ref('');

const filteredCategories = computed(() => {
  if (!data.value) return [];
  if (!searchTerm.value.trim()) return data.value.categories;

  const term = searchTerm.value.toLowerCase();

  return data.value.categories
    .map((category) => ({
      ...category,
      menuItems: category.menuItems.filter((item) =>
        item.name.toLowerCase().includes(term)
      ),
    }))
    .filter((category) => category.menuItems.length > 0);
});
</script>

<template>
  <div v-if="pending" class="store-page__loading">Carregando cardápio...</div>

  <div v-else-if="error" class="store-page__loading">Loja não encontrada</div>

  <div v-else class="store-page">
    <header class="store-page__header"></header>

    <div class="store-page__info">
      <div class="store-page__info--name">
        <span class="store-page__info--logo">
          {{ data.store.name.charAt(0) }}
        </span>
        <h1 class="store-page__info--title">{{ data.store.name }}</h1>
      </div>

      <div class="store-header__details">
        <div class="store-header__meta">
          <span>Taxa de entrega: R$ {{ data.store.deliveryFee }}</span>
        </div>
        <span
          v-if="!data.store.isOpen"
          class="store-header__badge store-header__badge--closed"
        >
          Fechado no momento
        </span>
        <span v-else class="store-header__badge store-header__badge--open"
          >Aberto</span
        >
      </div>
    </div>

    <div class="store-header__search">
      <input v-model="searchTerm" placeholder="Buscar no cardápio" />
    </div>

    <main class="store-menu">
      <section
        v-for="category in filteredCategories"
        :key="category.id"
        class="store-menu__category"
      >
        <h2>{{ category.name }}</h2>

        <div class="store-menu__grid">
          <article
            v-for="item in category.menuItems"
            :key="item.id"
            class="menu-card"
          >
            <div class="menu-card__info">
              <h3>{{ item.name }}</h3>
              <p v-if="item.description">{{ item.description }}</p>
              <span class="menu-card__price">R$ {{ item.price }}</span>
            </div>

            <div class="menu-card__image">
              <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" />
              <div v-else class="menu-card__image-placeholder" />
            </div>
          </article>
        </div>
      </section>

      <p v-if="filteredCategories.length === 0" class="store-menu__empty">
        Nenhum item encontrado
      </p>
    </main>
  </div>
</template>

<style scoped lang="scss">
.store-page__loading {
  padding: 3rem;
  text-align: center;
  color: #666;
}

.store-page {
  max-width: 1366px;
  margin: 0 auto;

  &__header {
    padding: 35px 30px 0;
    max-width: 1366px;
    margin: 35px auto;
    background: #e63946;
    height: 250px;
  }

  &__info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    &--name {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    &--logo {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: white;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
      color: #e63946;
    }

    &--title {
      font-size: 2.25rem;
      line-height: 44px;
    }
  }
}

.store-header__badge {
  font-size: 0.8rem;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
}

.store-header__badge--open {
  background: #e6f7ec;
  color: #1a7f37;
}

.store-header__badge--closed {
  background: #fdeaea;
  color: #e63946;
}

.store-header__meta {
  max-width: 800px;
  margin: 1rem auto 0;
  padding: 0 1.5rem;
  color: #666;
  font-size: 0.9rem;
}

.store-header__search {
  max-width: 800px;
  margin: 1rem auto 0;
  padding: 0 1.5rem 1.5rem;
}

.store-header__search input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.store-menu {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
}

.store-menu__category {
  margin-bottom: 2.5rem;
}

.store-menu__category h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.store-menu__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.menu-card {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
}

.menu-card__info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
}

.menu-card__info h3 {
  font-size: 0.95rem;
}

.menu-card__info p {
  font-size: 0.8rem;
  color: #777;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.menu-card__price {
  font-weight: 600;
  color: #1a7f37;
}

.menu-card__image {
  width: 90px;
  height: 90px;
  flex-shrink: 0;
}

.menu-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.menu-card__image-placeholder {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  border-radius: 8px;
}

.store-menu__empty {
  text-align: center;
  color: #999;
  padding: 2rem;
}

@media (max-width: 600px) {
  .store-menu__grid {
    grid-template-columns: 1fr;
  }
}
</style>
