<script setup lang="ts">
import { vMaska } from 'maska/vue';

definePageMeta({
  layout: 'admin-auth',
});

const currentStep = ref(1);
const errorMessage = ref('');
const isLoading = ref(false);

const form = reactive({
  name: '',
  slug: '',
  phone: '',
  street: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
  zipCode: '',
  ownerName: '',
  ownerEmail: '',
  ownerPassword: '',
});

watch(
  () => form.name,
  (newName) => {
    form.slug = newName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
);

function nextStep() {
  currentStep.value++;
}

function prevStep() {
  currentStep.value--;
}

const { registerStore } = useAuth();

async function handleSubmit() {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    await registerStore({
      store: {
        name: form.name,
        slug: form.slug,
        phone: form.phone,
        street: form.street,
        number: form.number,
        neighborhood: form.neighborhood,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
        openingHours: {},
      },
      owner: {
        name: form.ownerName,
        email: form.ownerEmail,
        password: form.ownerPassword,
      },
    });
    await navigateTo('/admin');
  } catch {
    errorMessage.value = 'Não foi possível criar a loja. Verifique os dados.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="auth-card">
    <h1>Cadastre sua loja</h1>
    <p class="auth-card__subtitle">Passo {{ currentStep }} de 3</p>

    <form
      class="auth-card__form"
      @submit.prevent="currentStep === 3 ? handleSubmit() : nextStep()"
    >
      <!-- Step 1 — Dados da loja -->
      <template v-if="currentStep === 1">
        <label for="name">Nome da loja</label>
        <input id="name" v-model="form.name" required />

        <label for="slug">Slug (URL)</label>
        <input id="slug" v-model="form.slug" required />

        <label for="phone">Telefone</label>
        <input
          id="phone"
          v-model="form.phone"
          required
          v-maska
          data-maska="['(##) ####-####', '(##) #####-####']"
        />
      </template>

      <!-- Step 2 — Endereço -->
      <template v-if="currentStep === 2">
        <label for="street">Rua</label>
        <input id="street" v-model="form.street" required />

        <label for="number">Número</label>
        <input id="number" v-model="form.number" required type="number" />

        <label for="neighborhood">Bairro</label>
        <input id="neighborhood" v-model="form.neighborhood" required />

        <label for="city">Cidade</label>
        <input id="city" v-model="form.city" required />

        <label for="state">Estado</label>
        <input id="state" v-model="form.state" required maxlength="2" />

        <label for="zipCode">CEP</label>
        <input id="zipCode" v-model="form.zipCode" required type="number" />
      </template>

      <!-- Step 3 — Dados do dono -->
      <template v-if="currentStep === 3">
        <label for="ownerName">Seu nome</label>
        <input id="ownerName" v-model="form.ownerName" required />

        <label for="ownerEmail">Seu email</label>
        <input
          id="ownerEmail"
          v-model="form.ownerEmail"
          type="email"
          required
        />

        <label for="ownerPassword">Senha</label>
        <input
          id="ownerPassword"
          v-model="form.ownerPassword"
          type="password"
          required
          minlength="6"
        />
      </template>

      <p v-if="errorMessage" class="auth-card__error">{{ errorMessage }}</p>

      <div class="auth-card__actions">
        <button v-if="currentStep > 1" type="button" @click="prevStep">
          Voltar
        </button>
        <button type="submit" class="auth-card__submit" :disabled="isLoading">
          {{
            currentStep === 3
              ? isLoading
                ? 'Criando...'
                : 'Criar loja'
              : 'Próximo'
          }}
        </button>
      </div>
    </form>

    <p class="auth-card__footer">
      Já tem uma conta?
      <NuxtLink to="/admin/login">Entrar</NuxtLink>
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
  margin-bottom: 0.25rem;
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

.auth-card__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.auth-card__submit {
  flex: 1;
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
