<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
  errorMessage?: string;
  isLoading?: boolean;
  submitLabel?: string;
}>();

defineEmits<{ submit: [] }>();
</script>

<template>
  <div class="auth-card">
    <h1>{{ title }}</h1>
    <p v-if="subtitle" class="auth-card__subtitle">{{ subtitle }}</p>

    <div v-if="$slots.tabs" class="auth-card__tabs">
      <slot name="tabs" />
    </div>

    <form class="auth-card__form" @submit.prevent="$emit('submit')">
      <slot />

      <p v-if="errorMessage" class="auth-card__error">{{ errorMessage }}</p>

      <button type="submit" class="auth-card__submit" :disabled="isLoading">
        {{ isLoading ? 'Aguarde...' : (submitLabel ?? 'Continuar') }}
      </button>
    </form>

    <p v-if="$slots.footer" class="auth-card__footer">
      <slot name="footer" />
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
.auth-card__tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.auth-card__form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.auth-card__form :deep(input),
.auth-card__form :deep(select) {
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
