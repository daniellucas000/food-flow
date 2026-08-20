<script setup lang="ts">
import {
  ArrowLeft,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Copy,
  MoreVertical,
  Pause,
  Pencil,
  Plus,
} from '@lucide/vue';
import Input from '~/components/form/input.vue';
import SearchInput from '~/components/form/search-input.vue';
import ProductDrawer from '~/components/product-drawer.vue';
import type { Category, MenuItem } from '~/types/menu';

definePageMeta({
  middleware: 'auth-staff',
  layout: 'admin',
  title: 'Cardápio',
});

const { formatBRL } = useCurrency();

const {
  fetchCategories,
  createCategory,
  deleteCategory,
  fetchMenuItems,
  deleteMenuItem,
} = useMenu();

const categories = ref<Category[]>([]);
const items = ref<MenuItem[]>([]);
const isLoading = ref(true);
const isCreatingCategory = ref(false);

const newCategoryName = ref('');
const searchQuery = ref('');
const filterCategoryId = ref('');

const collapsedCategoryIds = ref<Set<string>>(new Set());

const drawerCategoryId = ref<string | null>(null);
const drawerCategory = computed(
  () =>
    categories.value.find(
      (category) => category.id === drawerCategoryId.value
    ) ?? null
);

async function loadData() {
  isLoading.value = true;
  [categories.value, items.value] = await Promise.all([
    fetchCategories(),
    fetchMenuItems(),
  ]);
  isLoading.value = false;
}

onMounted(loadData);

async function handleCreateCategory() {
  if (!newCategoryName.value.trim()) return;
  await createCategory(newCategoryName.value);
  newCategoryName.value = '';
  isCreatingCategory.value = false;
  await loadData();
}

async function handleDeleteItem(id: string) {
  await deleteMenuItem(id);
  await loadData();
}

function itemsByCategory(categoryId: string) {
  const query = searchQuery.value.trim().toLowerCase();
  return items.value.filter((item) => {
    const matchesCategory = item.categoryId === categoryId;
    const matchesQuery = !query || item.name.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });
}

const filteredCategories = computed(() => {
  if (!filterCategoryId.value) return categories.value;
  return categories.value.filter(
    (category) => category.id === filterCategoryId.value
  );
});

function isCategoryCollapsed(categoryId: string) {
  return collapsedCategoryIds.value.has(categoryId);
}

function toggleCategoryCollapse(categoryId: string) {
  const next = new Set(collapsedCategoryIds.value);
  if (next.has(categoryId)) {
    next.delete(categoryId);
  } else {
    next.add(categoryId);
  }
  collapsedCategoryIds.value = next;
}

function openDrawerForCategory(categoryId: string) {
  drawerCategoryId.value = categoryId;
}

function closeDrawer() {
  drawerCategoryId.value = null;
}

async function handleItemCreated() {
  closeDrawer();
  await loadData();
}

const tabs = [
  { label: 'Cardápio', value: 'menu' },
  { label: 'Produtos', value: 'products' },
  { label: 'Complementos', value: 'complements' },
];

const activeTab = ref('menu');
</script>

<template>
  <div class="menu-page">
    <nav class="menu-page__tab-nav" v-if="!isCreatingCategory">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        type="button"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </button>
    </nav>

    <section>
      <div v-if="activeTab === 'menu'">
        <div class="menu-page__buttons" v-if="!isCreatingCategory">
          <div>
            <SearchInput v-model="searchQuery" placeholder="Buscar um item" />

            <select v-model="filterCategoryId">
              <option value="">Selecionar categoria</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <button @click="isCreatingCategory = true">
            Adicionar categoria
          </button>
        </div>

        <div v-if="isCreatingCategory">
          <div>
            <button @click="isCreatingCategory = false">
              <ArrowLeft />
            </button>
            <h2>Nova categoria</h2>
          </div>
          <p>Preencha as informações da nova categoria</p>

          <form
            class="menu-page__inline-form"
            @submit.prevent="handleCreateCategory"
          >
            <Input
              v-model="newCategoryName"
              placeholder="Nome da categoria"
              label="Nome"
            />
            <div>
              <button type="button" @click="isCreatingCategory = false">
                Cancelar
              </button>
              <button type="submit">Adicionar</button>
            </div>
          </form>
        </div>

        <div v-else class="menu-page__category-list">
          <p v-if="isLoading">Carregando...</p>
          <p v-else-if="!filteredCategories.length">
            Nenhuma categoria cadastrada.
          </p>

          <div
            v-for="category in filteredCategories"
            :key="category.id"
            class="category-card"
          >
            <div class="category-card__header">
              <span class="category-card__header--name">{{
                category.name
              }}</span>

              <div class="category-card__header--actions">
                <!-- <button type="button" class="category-card__header--combo">
                  Criar combo
                </button> -->
                <!-- <button
                  type="button"
                  class="category-card__header--icon"
                  title="Pausar categoria"
                >
                  <Pause :size="16" />
                </button>
                <button
                  type="button"
                  class="category-card__header--icon"
                  title="Mais opções"
                >
                  <MoreVertical :size="16" />
                </button> -->
                <button
                  type="button"
                  class="category-card__header--icon"
                  :title="
                    isCategoryCollapsed(category.id) ? 'Expandir' : 'Recolher'
                  "
                  @click="toggleCategoryCollapse(category.id)"
                >
                  <ChevronDown
                    v-if="isCategoryCollapsed(category.id)"
                    :size="16"
                  />
                  <ChevronUp v-else :size="16" />
                </button>
              </div>
            </div>

            <div
              v-show="!isCategoryCollapsed(category.id)"
              class="category-card__body"
            >
              <ul
                v-if="itemsByCategory(category.id).length"
                class="category-card__body--items"
              >
                <li
                  v-for="item in itemsByCategory(category.id)"
                  :key="item.id"
                  class="category-card__body--item"
                >
                  <img
                    v-if="item.imageUrl"
                    :src="item.imageUrl"
                    :alt="item.name"
                    class="category-card__body--item-image"
                  />
                  <div class="category-card__body--item-info">
                    <strong>{{ item.name }}</strong>
                    <span>{{ formatBRL(item.price) }}</span>
                  </div>
                  <button type="button" @click="handleDeleteItem(item.id)">
                    Excluir
                  </button>
                </li>
              </ul>

              <button
                type="button"
                class="category-card__body--add-offer"
                @click="openDrawerForCategory(category.id)"
              >
                <Plus :size="16" />
                Adicionar produto
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'products'">Conteúdo dos produtos</div>
      <div v-else-if="activeTab === 'complements'">Conteúdo dos produtos</div>
    </section>

    <ProductDrawer
      v-if="drawerCategory"
      :category="drawerCategory"
      @close="closeDrawer"
      @created="handleItemCreated"
    />
  </div>
</template>

<style scoped lang="scss">
.menu-page {
  &__tab-nav {
    display: flex;
    gap: 30px;
    padding-bottom: 10px;
    border-bottom: 1px solid #a6a6a5;
    max-width: fit-content;

    button {
      position: relative;

      &.active {
        &::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -11px;
          height: 2px;
          background: #ea1d2c;
          z-index: 1;
        }
      }
    }
  }

  &__buttons {
    display: flex;
    justify-content: space-between;
    margin: 20px 0;

    > div {
      display: flex;
      gap: 12px;
    }
  }

  &__category-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.category-card {
  border: 1px solid #ececec;
  border-radius: 12px;
  overflow: hidden;

  &__header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: #f5f5f5;

    &--name {
      flex: 1;
      font-weight: 600;
      text-decoration: underline;
    }

    &--actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &--combo {
      border: 1px solid #d0d0d0;
      border-radius: 20px;
      padding: 6px 14px;
      background: #fff;
    }

    &--icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
    }
  }

  &__body {
    padding: 12px 16px 16px;

    &--items {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 12px;
    }

    &--item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    &--item-image {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 6px;
    }

    &--item-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    &--add-offer {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 12px;
      border: 1px dashed #d0d0d0;
      border-radius: 8px;
      background: #fff;
    }
  }
}
</style>
