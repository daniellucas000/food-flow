<script setup lang="ts">
import type { Category, MenuItem } from '~/types/menu';

definePageMeta({
  middlewares: 'auth-staff',
  layout: 'admin',
});

const {
  fetchCategories,
  createCategory,
  deleteCategory,
  fetchMenuItems,
  createMenuItem,
  deleteMenuItem,
} = useMenu();

const categories = ref<Category[]>([]);
const items = ref<MenuItem[]>([]);
const isLoading = ref(true);

const newCategoryName = ref('');

const newItem = reactive({
  categoryId: '',
  name: '',
  description: '',
  price: 0,
});

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
  await loadData();
}

async function handleDeleteCategory(id: string) {
  await deleteCategory(id);
  await loadData();
}

async function handleCreateItem() {
  if (!newItem.name.trim() || !newItem.categoryId) return;
  await createMenuItem({
    categoryId: newItem.categoryId,
    name: newItem.name,
    description: newItem.description || undefined,
    price: Number(newItem.price),
  });
  newItem.name = '';
  newItem.description = '';
  newItem.price = 0;
  await loadData();
}

async function handleDeleteItem(id: string) {
  await deleteMenuItem(id);
  await loadData();
}

function itemsByCategory(categoryId: string) {
  return items.value.filter((item) => item.categoryId === categoryId);
}
</script>

<template>
  <div class="menu-page">
    <h1>Cardápio</h1>

    <section class="menu-page__section">
      <h2>Categorias</h2>
      <form
        class="menu-page__inline-form"
        @submit.prevent="handleCreateCategory"
      >
        <input v-model="newCategoryName" placeholder="Nome da categoria" />
        <button type="submit">Adicionar</button>
      </form>

      <ul>
        <li v-for="category in categories" :key="category.id">
          {{ category.name }}
          <button @click="handleDeleteCategory(category.id)">Excluir</button>
        </li>
      </ul>
    </section>

    <section class="menu-page__section">
      <h2>Novo item</h2>
      <form class="menu-page__item-form" @submit.prevent="handleCreateItem">
        <select v-model="newItem.categoryId" required>
          <option value="" disabled>Selecione a categoria</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
        <input v-model="newItem.name" placeholder="Nome do item" required />
        <input
          v-model="newItem.description"
          placeholder="Descrição (opcional)"
        />
        <input
          v-model.number="newItem.price"
          type="number"
          step="0.01"
          placeholder="Preço"
          required
        />
        <button type="submit">Criar item</button>
      </form>
    </section>

    <section v-if="!isLoading" class="menu-page__section">
      <h2>Itens por categoria</h2>
      <div
        v-for="category in categories"
        :key="category.id"
        class="menu-page__category-block"
      >
        <h3>{{ category.name }}</h3>
        <ul>
          <li v-for="item in itemsByCategory(category.id)" :key="item.id">
            {{ item.name }} — R$ {{ item.price }}
            <button @click="handleDeleteItem(item.id)">Excluir</button>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<style scoped>
.menu-page {
  padding: 2rem;
  max-width: 800px;
}

.menu-page__section {
  margin-bottom: 2rem;
}

.menu-page__inline-form,
.menu-page__item-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.menu-page__item-form {
  flex-direction: column;
  max-width: 320px;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}
</style>
