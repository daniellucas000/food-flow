<script setup lang="ts">
import { X } from '@lucide/vue';
import type { Category } from '~/types/menu';

const props = defineProps<{
  category: Category;
}>();

const emit = defineEmits<{
  close: [];
  created: [];
}>();

const { createMenuItem, uploadImage } = useMenu();

const name = ref('');
const description = ref('');
const price = ref(0);
const imageUrl = ref('');
const isUploadingImage = ref(false);
const isSubmitting = ref(false);

async function handleImageChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  isUploadingImage.value = true;
  try {
    imageUrl.value = await uploadImage(file);
  } catch {
    alert('Falha ao enviar imagem. Tente novamente.');
  } finally {
    isUploadingImage.value = false;
  }
}

async function handleSubmit() {
  if (!name.value.trim()) return;

  isSubmitting.value = true;
  try {
    await createMenuItem({
      categoryId: props.category.id,
      name: name.value,
      description: description.value || undefined,
      price: Number(price.value),
      imageUrl: imageUrl.value || undefined,
    });
    emit('created');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="product-drawer__overlay" @click.self="emit('close')">
    <aside class="product-drawer">
      <header class="product-drawer__header">
        <div>
          <h2>Detalhes do produto</h2>
        </div>
        <button type="button" @click="emit('close')">
          <X :size="20" />
        </button>
      </header>

      <form class="product-drawer__form" @submit.prevent="handleSubmit">
        <label>
          Nome do produto
          <input v-model="name" placeholder="Ex: Pizza de calabresa" required />
        </label>

        <label>
          Descrição (opcional)
          <input v-model="description" placeholder="Descrição" />
        </label>

        <label>
          Preço
          <input
            v-model.number="price"
            type="number"
            step="0.01"
            placeholder="0,00"
            required
          />
        </label>

        <label class="product-drawer__image-field">
          Imagem do item
          <input
            ref="imageInputRef"
            type="file"
            accept="image/*"
            @change="handleImageChange"
          />
        </label>

        <p v-if="isUploadingImage" class="product-drawer__uploading">
          Enviando imagem...
        </p>
        <img
          v-else-if="imageUrl"
          :src="imageUrl"
          alt="Pré-visualização"
          class="product-drawer__preview"
        />

        <div class="product-drawer__actions">
          <button type="button" @click="emit('close')">Cancelar</button>
          <button type="submit" :disabled="isUploadingImage || isSubmitting">
            Adicionar
          </button>
        </div>
      </form>
    </aside>
  </div>
</template>

<style scoped lang="scss">
.product-drawer {
  &__overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: flex-end;
    z-index: 50;
  }

  width: 420px;
  max-width: 100%;
  height: 100%;
  background: #fff;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 16px;

    label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 14px;
    }
  }

  &__preview {
    width: 100%;
    max-height: 160px;
    object-fit: cover;
    border-radius: 8px;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: auto;
  }
}
</style>
