<script setup lang="ts">
import { computed, type Component } from 'vue';
import { Loader2 } from '@lucide/vue';

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit' | 'reset';
    icon?: Component;
    iconPosition?: 'left' | 'right';
    iconOnly?: boolean;
    loading?: boolean;
    disabled?: boolean;
    block?: boolean;
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    icon: undefined,
    iconPosition: 'left',
    iconOnly: false,
    loading: false,
    disabled: false,
    block: false,
  }
);

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const isDisabled = computed(() => props.disabled || props.loading);

const iconSize = computed(() => {
  if (props.size === 'sm') return 14;
  if (props.size === 'lg') return 20;
  return 16;
});

function handleClick(event: MouseEvent) {
  if (isDisabled.value) return;
  emit('click', event);
}
</script>

<template>
  <button
    class="base-button"
    :class="[
      `base-button--${variant}`,
      `base-button--${size}`,
      {
        'base-button--block': block,
        'base-button--icon-only': iconOnly,
        'base-button--loading': loading,
      },
    ]"
    :type="type"
    :disabled="isDisabled"
    @click="handleClick"
  >
    <Loader2 v-if="loading" :size="iconSize" class="base-button__spinner" />

    <template v-else>
      <component
        :is="icon"
        v-if="icon && iconPosition === 'left'"
        :size="iconSize"
        class="base-button__icon"
      />
      <slot v-if="!iconOnly" />
      <component
        :is="icon"
        v-if="icon && iconPosition === 'right' && !iconOnly"
        :size="iconSize"
        class="base-button__icon"
      />
    </template>
  </button>
</template>

<style scoped lang="scss">
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  border: 1.5px solid transparent;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    opacity 0.15s ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &--sm {
    padding: 6px 12px;
    font-size: 13px;
  }

  &--md {
    padding: 10px 18px;
    font-size: 14px;
  }

  &--lg {
    padding: 13px 24px;
    font-size: 15px;
  }

  &--icon-only {
    padding: 0;

    &.base-button--sm {
      width: 28px;
      height: 28px;
    }

    &.base-button--md {
      width: 36px;
      height: 36px;
    }

    &.base-button--lg {
      width: 44px;
      height: 44px;
    }
  }

  &--block {
    width: 100%;
  }

  &--primary {
    background: #ea1d2c;
    border-color: #ea1d2c;
    color: #fff;

    &:not(:disabled):hover {
      background: #cf1926;
      border-color: #cf1926;
    }
  }

  &--secondary {
    background: #3f3e3e;
    border-color: #3f3e3e;
    color: #fff;

    &:not(:disabled):hover {
      background: #2a2929;
      border-color: #2a2929;
    }
  }

  &--outline {
    background: #fff;
    border-color: #d0d0d0;
    color: #3f3e3e;

    &:not(:disabled):hover {
      background: #f5f5f5;
    }
  }

  &--ghost {
    background: transparent;
    border-color: transparent;
    color: #3f3e3e;

    &:not(:disabled):hover {
      background: #f0f0f0;
    }
  }

  &--danger {
    background: #fff;
    border-color: #ea1d2c;
    color: #ea1d2c;

    &:not(:disabled):hover {
      background: rgba(234, 29, 44, 0.06);
    }
  }
}

.base-button__spinner {
  animation: base-button-spin 0.7s linear infinite;
}

@keyframes base-button-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
