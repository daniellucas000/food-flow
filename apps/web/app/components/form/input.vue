<script setup lang="ts">
import { computed, useId } from 'vue';
import { Image } from '@lucide/vue';

const props = withDefaults(
  defineProps<{
    label?: string;
    placeholder?: string;
    type?: string;
    accept?: string;
    fileButtonText?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
  }>(),
  {
    label: '',
    placeholder: '',
    type: 'text',
    accept: undefined,
    fileButtonText: 'Adicionar imagem',
    error: '',
    disabled: false,
    required: false,
  }
);

const model = defineModel<string | number | File | null>();

const inputId = useId();

const isFile = computed(() => props.type === 'file');
const hasError = computed(() => Boolean(props.error));

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;

  if (isFile.value) {
    model.value = target.files?.[0] ?? null;
    return;
  }

  model.value = props.type === 'number' ? target.valueAsNumber : target.value;
}
</script>

<template>
  <div
    class="base-input"
    :class="{ 'base-input--error': hasError, 'base-input--disabled': disabled }"
  >
    <label v-if="label" :for="inputId" class="base-input__label">
      {{ label }}
      <span v-if="required" class="base-input__required">*</span>
    </label>

    <template v-if="isFile">
      <label :for="inputId" class="base-input__file-button">
        <Image :size="18" />
        {{ fileButtonText }}
      </label>
      <input
        :id="inputId"
        class="base-input__file-input"
        type="file"
        :accept="accept"
        :disabled="disabled"
        :required="required"
        @change="handleInput"
      />
    </template>

    <div v-else class="base-input__field">
      <span v-if="$slots.icon" class="base-input__icon">
        <slot name="icon" />
      </span>

      <input
        :id="inputId"
        class="base-input__control"
        :type="type"
        :value="model as string | number"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        @input="handleInput"
      />
    </div>

    <p v-if="hasError" class="base-input__error">{{ error }}</p>
  </div>
</template>

<style scoped lang="scss">
.base-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;

  &__label {
    font-size: 14px;
    font-weight: 500;
  }

  &__required {
    color: #e53935;
  }

  &__field {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #d0d0d0;
    border-radius: 8px;
    padding: 0 12px;
    background: #fff;
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    color: #8a8a8a;
  }

  &__file-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    width: fit-content;
    padding: 10px 16px;
    border: 1.5px solid #ea1d2c;
    border-radius: 8px;
    color: #ea1d2c;
    font-size: 14px;
    font-weight: 600;
    background: #fff;
    cursor: pointer;
  }

  &__file-input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  &__control {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    padding: 10px 0;
    font-size: 14px;

    &::placeholder {
      color: #a0a0a0;
    }
  }

  &__error {
    font-size: 12px;
    color: #e53935;
  }

  &--error &__field {
    border-color: #e53935;
  }

  &--disabled {
    opacity: 0.6;

    .base-input__field {
      background: #f5f5f5;
    }

    .base-input__file-button {
      cursor: not-allowed;
      pointer-events: none;
    }
  }
}
</style>
