<script setup lang="ts">
import { ArrowLeft } from '@lucide/vue';
import type { Category, MenuItem } from '~/types/menu';

definePageMeta({
  middleware: 'auth-staff',
  layout: 'admin',
});

const {
  fetchCategories,
  createCategory,
  deleteCategory,
  fetchMenuItems,
  createMenuItem,
  deleteMenuItem,
  uploadImage,
} = useMenu();

const categories = ref<Category[]>([]);
const items = ref<MenuItem[]>([]);
const isLoading = ref(true);
const isCreatingCategory = ref(false);

const newCategoryName = ref('');

const newItem = reactive({
  categoryId: '',
  name: '',
  description: '',
  price: 0,
  imageUrl: '',
});

const isUploadingImage = ref(false);
const imageInputRef = ref<HTMLInputElement | null>(null);

async function handleImageChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  isUploadingImage.value = true;
  try {
    newItem.imageUrl = await uploadImage(file);
  } catch {
    alert('Falha ao enviar imagem. Tente novamente.');
  } finally {
    isUploadingImage.value = false;
  }
}

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
    imageUrl: newItem.imageUrl || undefined,
  });

  newItem.name = '';
  newItem.description = '';
  newItem.price = 0;
  newItem.imageUrl = '';
  if (imageInputRef.value) imageInputRef.value.value = '';
  await loadData();
}

async function handleDeleteItem(id: string) {
  await deleteMenuItem(id);
  await loadData();
}

function itemsByCategory(categoryId: string) {
  return items.value.filter((item) => item.categoryId === categoryId);
}

const tabs = [
  {
    label: 'Cardápio',
    value: 'menu',
  },
  {
    label: 'Produtos',
    value: 'products',
  },
  {
    label: 'Complementos',
    value: 'complements',
  },
];

const activeTab = ref('menu');
</script>

<template>
  <div class="menu-page">
    <h1>Cardápio</h1>
    <p>Defina quais os itens seus clientes podem pedir</p>

    <nav class="tab-nav">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        type="button"
        :class="{ 'tab-nav__item--active': activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </button>
    </nav>

    <section>
      <div v-if="activeTab === 'menu'">
        <div v-if="!isCreatingCategory">
          <input type="text" placeholder="buscar item" />
          <button>dropdown</button>
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
            <input v-model="newCategoryName" placeholder="Nome da categoria" />
            <button type="submit">Adicionar</button>
          </form>
        </div>
      </div>

      <div v-else-if="activeTab === 'products'">Conteúdo dos produtos</div>

      <div v-else-if="activeTab === 'complements'">Conteúdo dos produtos</div>
    </section>

    <!-- <section class="menu-page__section">
      <h2>Categorias</h2>


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

        <label class="menu-page__image-field">
          Imagem do item
          <input
            ref="imageInputRef"
            type="file"
            accept="image/*"
            @change="handleImageChange"
          />
        </label>

        <p v-if="isUploadingImage" class="menu-page__uploading">
          Enviando imagem...
        </p>
        <img
          v-else-if="newItem.imageUrl"
          :src="newItem.imageUrl"
          alt="Pré-visualização"
          class="menu-page__preview"
        />

        <button type="submit" :disabled="isUploadingImage">Criar item</button>
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
    </section> -->
  </div>
</template>

<style scoped>
.menu-page {
  max-width: 1366px;
  margin: 0 auto;
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

.menu-page__image-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: #555;
}

.menu-page__preview {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #eee;
}

.menu-page__uploading {
  font-size: 0.85rem;
  color: #999;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.tab-nav {
  display: flex;
  gap: 1rem;

  &__item {
    padding: 0.5rem 1rem;
    border: 0;
    background: transparent;
    cursor: pointer;

    &--active {
      font-weight: 600;
      border-bottom: 2px solid currentColor;
    }
  }
}
</style>
