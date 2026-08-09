<script setup lang="ts">
import { vMaska } from 'maska/vue';

definePageMeta({ layout: 'auth' });

const route = useRoute();
const slug = route.params.slug as string;

const mode = ref<'guest' | 'signin' | 'signup'>('guest');
const errorMessage = ref('');
const isLoading = ref(false);

const form = reactive({
  name: '',
  phone: '',
  email: '',
  password: '',
});

const { signUp, signIn, continueAsGuest } = useCustomerAuth();

async function handleSubmit() {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    if (mode.value === 'guest') {
      await continueAsGuest(slug, { name: form.name, phone: form.phone });
    } else if (mode.value === 'signup') {
      await signUp(slug, form);
    } else {
      await signIn(slug, form.email, form.password);
    }

    await navigateTo(`/${slug}`);
  } catch {
    errorMessage.value = 'Não foi possível continuar. Verifique os dados.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <AuthCard
    title="Entrar na loja"
    :error-message="errorMessage"
    :is-loading="isLoading"
    submit-label="Continuar"
    @submit="handleSubmit"
  >
    <template #tabs>
      <button
        type="button"
        :class="{ active: mode === 'guest' }"
        @click="mode = 'guest'"
      >
        Sem cadastro
      </button>
      <button
        type="button"
        :class="{ active: mode === 'signin' }"
        @click="mode = 'signin'"
      >
        Entrar
      </button>
      <button
        type="button"
        :class="{ active: mode === 'signup' }"
        @click="mode = 'signup'"
      >
        Criar conta
      </button>
    </template>

    <template v-if="mode === 'guest'">
      <label for="name">Nome</label>
      <input id="name" v-model="form.name" required />

      <label for="phone">Telefone</label>
      <input
        id="phone"
        v-model="form.phone"
        required
        v-maska
        data-maska="['(##) ####-####', '(##) #####-####']"
      />
    </template>

    <template v-else-if="mode === 'signin'">
      <label for="email">Email</label>
      <input id="email" v-model="form.email" type="email" required />

      <label for="password">Senha</label>
      <input id="password" v-model="form.password" type="password" required />
    </template>

    <template v-else>
      <label for="signupName">Nome</label>
      <input id="signupName" v-model="form.name" required />

      <label for="signupPhone">Telefone</label>
      <input
        id="signupPhone"
        v-model="form.phone"
        required
        v-maska
        data-maska="['(##) ####-####', '(##) #####-####']"
      />

      <label for="signupEmail">Email</label>
      <input id="signupEmail" v-model="form.email" type="email" required />

      <label for="signupPassword">Senha</label>
      <input
        id="signupPassword"
        v-model="form.password"
        type="password"
        required
        minlength="6"
      />
    </template>
  </AuthCard>
</template>

<style scoped>
.auth-card__tabs button {
  flex: 1;
  padding: 0.6rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}

.auth-card__tabs button.active {
  background: #e63946;
  color: white;
  border-color: #e63946;
}
</style>
