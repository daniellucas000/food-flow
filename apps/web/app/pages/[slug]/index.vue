<script setup lang="ts">
definePageMeta({
  layout: 'store',
});
import SearchInput from '~/components/form/search-input.vue';
import type {
  PublicStoreMenu,
  PublicCategory,
  PublicMenuItem,
} from '~/types/store';

const route = useRoute();
const slug = route.params.slug as string;

const selectedItem = ref<PublicMenuItem | null>(null);

const config = useRuntimeConfig();

const { data, pending, error } = await useFetch<PublicStoreMenu>(
  `${config.public.apiBase}/stores/${slug}/menu`
);

const storeData = computed(() => data.value!);

const searchTerm = ref('');

const filteredCategories = computed<PublicCategory[]>(() => {
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
          {{ storeData.store.name.charAt(0) }}
        </span>
        <h1 class="store-page__info--title">{{ storeData.store.name }}</h1>
      </div>

      <div class="store-page__details">
        <button class="store-page__details--button">Ver mais</button>
        <span class="store-page__details--minimum-order"
          >Pedido mínimo R$ 20,00</span
        >
      </div>
    </div>

    <div class="store-page__header-wrapper">
      <SearchInput placeholder="Buscar no cardápio" v-model="searchTerm" />

      <div class="store-page__header-wrapper--scheduling">
        <button>Entrega</button>
        <div>
          <span class="store-page__header-wrapper--day">Hoje</span>
          <div class="store-page__header-wrapper--subtitle">
            <span>38-48 min • </span>
            <span>R$ {{ storeData.store.deliveryFee }}</span>
          </div>
        </div>
      </div>
    </div>

    <ul class="store-page__menu">
      <li v-for="category in filteredCategories" :key="category.id" class="">
        <h2 class="store-page__menu--category-title">{{ category.name }}</h2>

        <div
          class="store-page__menu--dish-card"
          v-for="item in category.menuItems"
          :key="item.id"
          @click="selectedItem = item"
        >
          <div>
            <div>
              <h3 class="store-page__menu--item-description">
                {{ item.name }}
              </h3>
              <p class="store-page__menu--item-details" v-if="item.description">
                {{ item.description }}
              </p>

              <span class="store-page__menu--info-serves"> Serve 1 pessoa</span>
              <span class="store-page__menu--item-price"
                >R$ {{ item.price }}</span
              >
            </div>

            <div class="">
              <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" />
              <div v-else class="menu-card__image-placeholder" />
            </div>
          </div>
        </div>
      </li>

      <p v-if="filteredCategories.length === 0" class="store-menu__empty">
        Nenhum item encontrado
      </p>
    </ul>
  </div>

  <ItemDetailModal
    v-if="selectedItem"
    :item="selectedItem"
    :slug="slug"
    :store-name="storeData.store.name"
    @close="selectedItem = null"
  />
</template>

<style scoped lang="scss">
.store-page__loading {
  padding: 3rem;
  text-align: center;
  color: #666;
}

.store-page {
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
    margin-bottom: 30px;

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

  &__details {
    display: flex;
    align-items: center;
    gap: 30px;

    &--button {
      font-size: 1rem;
      line-height: 19.79px;
      font-weight: 700;
      color: #ea1d2c;
    }

    &--minimum-order {
      font-size: 0.75rem;
      color: #a6a6a5;
      font-weight: 400;
      line-height: 16px;
    }
  }

  &__header-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;

    label {
      max-width: 100%;
    }

    &--scheduling {
      display: flex;
      align-items: center;
      gap: 1rem;
      max-width: 230px;
      width: 100%;

      button {
        background: #fff;
        border: 1px solid #f2f2f2;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
        border-radius: 4px;
        cursor: pointer;
        padding: 16px 1rem;
        font-size: 14px;
      }
    }

    &--day {
      font-size: 0.875rem;
      text-align: left;
      color: #3e3e3e;
      line-height: 1.125rem;
      font-weight: 400;
    }

    &--subtitle {
      display: flex;
      align-items: center;
      margin-top: 2px;
      line-height: 1rem;

      span {
        text-align: left;
        color: #717171;
        font-size: 0.75rem;
        padding: 0 2px 0 0;
        font-weight: 300;
      }
    }
  }

  &__menu {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 30px;

    @media (max-width: 742px) {
      grid-template-columns: repeat(1, minmax(420px, 1fr));
    }

    &--category-title {
      font-size: 1.5rem;
      letter-spacing: -1px;
      padding: 40px 0 20px;
      font-weight: 500;
      color: #3f3e3e;
    }

    &--dish-card {
      width: 100%;
      background: #fff;
      text-decoration: none;
      transition: 0.2s;
      overflow: hidden;
      padding: 15px;
      min-width: 320px;
      border: 1px solid #f2f2f2;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 30px;

      &:hover {
        border: 1px solid #dbdad9;
      }

      > div {
        display: grid;
        grid-template-columns: 1fr 180px;
        grid-gap: 15px;
        min-height: 147px;

        > div {
          display: flex;
          flex-direction: column;
        }

        img {
          object-fit: contain;
          width: 170px;
          height: 170px;
          border-radius: 4px;
        }
      }
    }

    &--item-description {
      font-size: 1.125rem;
      line-height: 1.5rem;
      color: #3e3e3e;
      font-weight: 400;
      margin-bottom: 18px;
    }

    &--item-details {
      font-size: 0.875rem;
      line-height: 1rem;
      font-weight: lighter;
      color: #717171;
      word-break: break-word;
      margin-bottom: 10px;
    }

    &--info-serves {
      display: flex;
      align-items: center;
      padding: 10px 0;
      font-size: 0.875rem;
      line-height: 1rem;
      color: #3e3e3e;
      font-weight: 500;
    }

    &--item-price {
      font-size: 1rem;
      line-height: 1.25rem;
      font-weight: 400;
      color: #50a773;
      margin-top: auto;
    }
  }
}
</style>
