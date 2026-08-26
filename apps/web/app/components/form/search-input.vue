<script setup lang="ts">
import { Search } from '@lucide/vue';

defineProps<{
  placeholder?: string;
}>();

const model = defineModel<string>();
</script>

<template>
  <label class="search-input">
    <Search :size="22" class="search-input__icon" />
    <input type="text" :placeholder="placeholder" v-model="model" />
  </label>
</template>

<style lang="scss" scoped>
.search-input {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f7f7f7;
  padding: 15px 1rem;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;

  &__icon {
    color: #ea1d2c;
    flex-shrink: 0;
  }

  input {
    border: none;
    background: none;
    outline: none;
    width: 100%;
    font-size: 0.875rem;
    color: #3e3e3e;

    &::placeholder {
      color: #999;
    }
  }
}
</style>
