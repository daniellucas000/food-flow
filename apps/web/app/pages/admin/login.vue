<script setup lang="ts">
definePageMeta({
  layout: 'admin-auth',
});

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
  <div class="auth-card">
    <h1>Acesse o painel</h1>
    <p class="auth-card__subtitle">
      Entre com sua conta para gerenciar sua loja
    </p>

    <form class="auth-card__form" @submit.prevent="handleSubmit">
      <label for="email">Email</label>
      <input id="email" v-model="email" type="email" required />

      <label for="password">Senha</label>
      <input id="password" v-model="password" type="password" required />

      <p v-if="errorMessage" class="auth-card__error">{{ errorMessage }}</p>

      <button type="submit" class="auth-card__submit" :disabled="isLoading">
        {{ isLoading ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>

    <p class="auth-card__footer">
      Ainda não tem uma loja?
      <NuxtLink to="/admin/signup">Cadastre sua loja</NuxtLink>
    </p>
  </div>
</template>

<style scoped>
.auth-card {
  width: 380px;
  padding: 2.5rem;
}

.auth-card h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.auth-card__subtitle {
  color: #666;
  margin-bottom: 1.5rem;
}

.auth-card__form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.auth-card__form input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 0.75rem;
}

.auth-card__submit {
  margin-top: 0.5rem;
  padding: 0.85rem;
  background: #e63946;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.auth-card__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-card__error {
  color: #e63946;
  font-size: 0.875rem;
}

.auth-card__footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: #666;
}
</style>
