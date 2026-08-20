<script setup lang="ts">
import { X } from '@lucide/vue';
import type { Category } from '~/types/menu';
import Input from './form/input.vue';
import Button from './button.vue';

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
const price = ref('');
const imageUrl = ref('');
const isUploadingImage = ref(false);
const isSubmitting = ref(false);

const imageFile = ref<File | null>(null);

const isOpen = ref(true);

function requestClose() {
  isOpen.value = false;
}

watch(imageFile, async (file) => {
  if (!file) return;

  isUploadingImage.value = true;
  try {
    imageUrl.value = await uploadImage(file);
  } catch {
    alert('Falha ao enviar imagem. Tente novamente.');
  } finally {
    isUploadingImage.value = false;
  }
});

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
  <Teleport to="body">
    <Transition name="fade" appear>
      <div
        v-if="isOpen"
        class="product-drawer__overlay"
        @click.self="requestClose"
      />
    </Transition>

    <Transition name="slide" appear @after-leave="emit('close')">
      <aside v-if="isOpen" class="product-drawer">
        <header class="product-drawer__header">
          <div>
            <h2>Detalhes do produto</h2>
          </div>
          <button type="button" @click="requestClose">
            <X :size="20" />
          </button>
        </header>

        <form class="product-drawer__form" @submit.prevent="handleSubmit">
          <Input
            v-model="name"
            placeholder="Ex: Pizza de calabresa"
            label="Nome do produto"
            required
          />

          <Input
            v-model="description"
            placeholder="Descrição"
            label="Descrição (opcional)"
          />

          <Input
            v-model="price"
            type="number"
            placeholder="0,00"
            label="Preço"
            required
          />

          <Input
            v-model="imageFile"
            label="Adicionar imagem"
            type="file"
            accept="image/*"
          />

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
            <Button type="button" @click="requestClose" variant="outline"
              >Cancelar</Button
            >
            <Button type="submit" :disabled="isUploadingImage || isSubmitting"
              >Adicionar</Button
            >
          </div>
        </form>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.product-drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 420px;
  max-width: 90vw;
  background: #fff;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  z-index: 51;

  &__overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 50;
  }

  &__header {
    display: flex;
    justify-content: space-between;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 100%;

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
