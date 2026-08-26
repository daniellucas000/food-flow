<script setup lang="ts" generic="T extends string | number">
interface DropdownOption<T> {
  value: T;
  label: string;
  count?: number;
}

const props = defineProps<{
  options: DropdownOption<T>[];
  placeholder?: string;
}>();

const model = defineModel<T>({ required: true });

const isOpen = ref(false);
const rootRef = ref<HTMLElement | null>(null);

const selectedOption = computed(() =>
  props.options.find((option) => option.value === model.value)
);

function toggle() {
  isOpen.value = !isOpen.value;
}

function select(option: DropdownOption<T>) {
  model.value = option.value;
  isOpen.value = false;
}

onClickOutside(rootRef, () => {
  isOpen.value = false;
});
</script>

<template>
  <div ref="rootRef" class="dropdown">
    <button type="button" class="dropdown__trigger" @click="toggle">
      <span>{{ selectedOption?.label ?? placeholder ?? 'Selecione' }}</span>
      <span class="dropdown__arrow" :class="{ 'dropdown__arrow--open': isOpen }"
        >▾</span
      >
    </button>

    <ul v-if="isOpen" class="dropdown__menu">
      <li
        v-for="option in options"
        :key="option.value"
        :class="[
          'dropdown__item',
          { 'dropdown__item--active': option.value === model },
        ]"
        @click="select(option)"
      >
        <span>{{ option.label }}</span>
        <span v-if="option.count !== undefined" class="dropdown__count">{{
          option.count
        }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}
.dropdown__trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.45rem 0.9rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  font-size: 0.85rem;
  color: #333;
}
.dropdown__trigger:hover {
  border-color: #bbb;
}
.dropdown__arrow {
  font-size: 0.7rem;
  color: #999;
  transition: transform 0.15s ease;
}
.dropdown__arrow--open {
  transform: rotate(180deg);
}
.dropdown__menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 180px;
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  z-index: 10;
  padding: 0.35rem;
  list-style: none;
  margin: 0;
}
.dropdown__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  color: #333;
}
.dropdown__item:hover {
  background: #f5f5f5;
}
.dropdown__item--active {
  background: #f0f0f0;
  font-weight: 600;
}
.dropdown__count {
  font-size: 0.7rem;
  color: #999;
}
</style>
