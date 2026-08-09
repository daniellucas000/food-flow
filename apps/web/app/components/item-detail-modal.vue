<script setup lang="ts">
import type { PublicMenuItem } from '~/types/store';

const props = defineProps<{ item: PublicMenuItem; slug: string }>();
const emit = defineEmits<{ close: [] }>();

const cartStore = useCartStore();
const quantity = ref(1);

const selections = reactive<Record<string, string[]>>({});

props.item.optionGroups.forEach((group) => {
  selections[group.id] = [];
});

function toggleOption(
  group: PublicMenuItem['optionGroups'][number],
  optionId: string
) {
  const current = selections[group.id]!;

  if (group.maxSelect === 1) {
    selections[group.id] = [optionId];
    return;
  }

  if (current.includes(optionId)) {
    selections[group.id] = current.filter((id) => id !== optionId);
  } else if (current.length < group.maxSelect) {
    selections[group.id] = [...current, optionId];
  }
}

const isValid = computed(() =>
  props.item.optionGroups.every((group) => {
    const count = selections[group.id]!.length;
    return count >= group.minSelect && count <= group.maxSelect;
  })
);

const totalPrice = computed(() => {
  const optionsTotal = props.item.optionGroups.reduce((sum, group) => {
    return (
      sum +
      selections[group.id]!.reduce((s, optionId) => {
        const option = group.options.find((o) => o.id === optionId);
        return s + (option ? Number(option.priceModifier) : 0);
      }, 0)
    );
  }, 0);

  return (Number(props.item.price) + optionsTotal) * quantity.value;
});

function handleAddToCart() {
  const selectedOptions = props.item.optionGroups.flatMap((group) =>
    selections[group.id]!.map((optionId) => {
      const option = group.options.find((o) => o.id === optionId)!;
      return {
        groupName: group.name,
        optionName: option.name,
        priceModifier: Number(option.priceModifier),
      };
    })
  );

  cartStore.addItem(props.slug, {
    menuItemId: props.item.id,
    name: props.item.name,
    unitPrice: Number(props.item.price),
    quantity: quantity.value,
    selectedOptions,
  });

  emit('close');
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal">
      <button class="modal__close" @click="emit('close')">×</button>

      <h2>{{ item.name }}</h2>
      <p v-if="item.description">{{ item.description }}</p>
      <span class="modal__price">R$ {{ item.price }}</span>

      <div
        v-for="group in item.optionGroups"
        :key="group.id"
        class="modal__group"
      >
        <h3>
          {{ group.name }}
          <small v-if="group.required">(obrigatório)</small>
        </h3>

        <label
          v-for="option in group.options"
          :key="option.id"
          class="modal__option"
        >
          <input
            :type="group.maxSelect === 1 ? 'radio' : 'checkbox'"
            :name="group.id"
            :checked="selections[group.id]?.includes(option.id)"
            @change="toggleOption(group, option.id)"
          />
          {{ option.name }}
          <span v-if="Number(option.priceModifier) > 0"
            >+ R$ {{ option.priceModifier }}</span
          >
        </label>
      </div>

      <div class="modal__quantity">
        <button @click="quantity = Math.max(1, quantity - 1)">-</button>
        <span>{{ quantity }}</span>
        <button @click="quantity++">+</button>
      </div>

      <button
        class="modal__submit"
        :disabled="!isValid"
        @click="handleAddToCart"
      >
        Adicionar — R$ {{ totalPrice.toFixed(2) }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.modal {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 420px;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
}
.modal__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  border: none;
  background: none;
  font-size: 1.5rem;
  cursor: pointer;
}
.modal__price {
  font-weight: 600;
  color: #50a773;
}
.modal__group {
  margin-top: 1.5rem;
}
.modal__option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
}
.modal__quantity {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
}
.modal__submit {
  width: 100%;
  padding: 0.85rem;
  background: #e63946;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
.modal__submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
