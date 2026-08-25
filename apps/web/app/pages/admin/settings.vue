<script setup lang="ts">
import Input from '~/components/form/input.vue';

definePageMeta({
  middleware: 'auth-staff',
  layout: 'admin',
  title: 'Configurações da loja',
});

const storeStore = useStoreStore();
const { updateStore } = useStoreSettings();
const api = useApi();

const name = ref(storeStore.store?.name ?? '');
const phone = ref('');
const whatsappNumber = ref('');
const isOpen = ref(true);

const logoFile = ref<File | null>(null);
const bannerFile = ref<File | null>(null);

const isSaving = ref(false);
const error = ref('');
const success = ref(false);

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const { url } = await api<{ url: string }>('/upload/image', {
    method: 'POST',
    body: formData,
  });

  return url;
}

async function handleSave() {
  error.value = '';
  success.value = false;
  isSaving.value = true;

  try {
    let logoUrl: string | undefined;
    let bannerUrl: string | undefined;

    if (logoFile.value) {
      logoUrl = await uploadImage(logoFile.value);
    }
    if (bannerFile.value) {
      bannerUrl = await uploadImage(bannerFile.value);
    }

    await updateStore({
      name: name.value,
      phone: phone.value,
      whatsappNumber: whatsappNumber.value,
      isOpen: isOpen.value,
      ...(logoUrl && { logoUrl }),
      ...(bannerUrl && { bannerUrl }),
    });

    success.value = true;
  } catch (err) {
    error.value = 'Não foi possível salvar as alterações.';
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <div class="settings-page">
    <section class="settings-page__section">
      <h2>Dados da loja</h2>
      <form @submit.prevent="handleSave">
        <Input v-model="name" label="Nome da loja" />
        <Input v-model="phone" label="Telefone" />
        <Input v-model="whatsappNumber" label="WhatsApp" />

        <img
          v-if="storeStore.store?.logoUrl"
          :src="storeStore.store.logoUrl"
          alt="Logo atual"
          class="settings-page__preview settings-page__preview--logo"
        />
        <Input
          v-model="logoFile"
          label="Alterar logo"
          type="file"
          accept="image/*"
        />

        <img
          v-if="storeStore.store?.bannerUrl"
          :src="storeStore.store.bannerUrl"
          alt="Banner atual"
          class="settings-page__preview settings-page__preview--banner"
        />
        <Input
          v-model="bannerFile"
          label="Alterar banner"
          type="file"
          accept="image/*"
        />

        <label class="settings-page__checkbox">
          <input type="checkbox" v-model="isOpen" />
          Loja aberta
        </label>

        <p v-if="error" class="settings-page__error">{{ error }}</p>
        <p v-if="success" class="settings-page__success">Alterações salvas.</p>

        <button type="submit" :disabled="isSaving">
          {{ isSaving ? 'Salvando...' : 'Salvar alterações' }}
        </button>
      </form>
    </section>
  </div>
</template>

<style scoped lang="scss">
.settings-page {
  &__preview {
    display: block;
    border-radius: 8px;
    margin-bottom: 8px;
    object-fit: cover;

    &--logo {
      width: 80px;
      height: 80px;
    }

    &--banner {
      width: 100%;
      max-width: 480px;
      height: 140px;
    }
  }

  &__checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__error {
    color: #d32f2f;
    font-size: 14px;
  }

  &__success {
    color: #2e7d32;
    font-size: 14px;
  }
}
</style>
