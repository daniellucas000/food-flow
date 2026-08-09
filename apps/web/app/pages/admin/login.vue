<script setup lang="ts">
definePageMeta({ layout: 'auth' });

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const { login } = useAuth();

async function handleSubmit() {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    await login(email.value, password.value);
    await navigateTo('/admin');
  } catch {
    errorMessage.value = 'Email ou senha inválidos';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <AuthCard
    title="Acesse o painel"
    subtitle="Entre com sua conta para gerenciar sua loja"
    :error-message="errorMessage"
    :is-loading="isLoading"
    submit-label="Entrar"
    @submit="handleSubmit"
  >
    <label for="email">Email</label>
    <input id="email" v-model="email" type="email" required />
    <label for="password">Senha</label>
    <input id="password" v-model="password" type="password" required />

    <template #footer>
      Ainda não tem uma loja?
      <NuxtLink to="/admin/signup">Cadastre sua loja</NuxtLink>
    </template>
  </AuthCard>
</template>
