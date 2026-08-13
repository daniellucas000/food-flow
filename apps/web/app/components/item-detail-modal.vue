<script setup lang="ts">
import { Minus, Plus, Users, X } from '@lucide/vue';
import type { PublicMenuItem } from '~/types/store';

const props = defineProps<{
  item: PublicMenuItem;
  slug: string;
  storeName: string;
}>();
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
        itemOptionId: option.id,
        groupName: group.name,
        optionName: option.name,
        priceModifier: Number(option.priceModifier),
      };
    })
  );

  cartStore.addItem(props.slug, props.storeName, {
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
      <div class="modal__img-container">
        <img src="/images/flat-customer.png" alt="" />
      </div>

      <div class="modal__content">
        <header>
          <div class="modal__content--header-top">
            <h4>{{ item.name }}</h4>
            <button @click="emit('close')"><X /></button>
          </div>
          <p class="modal__content--item-description">{{ item.description }}</p>
          <span class="modal__content--info-serves"
            ><Users :size="12" /> 4 pessoas</span
          >
          <span class="modal__content--price">R$ {{ item.price }}</span>
        </header>

        <div class="modal__content--header-choices">
          <div>
            <strong>Escolha seu sanduíche</strong>
            <span class="choice-desc">Escolha 4 opções. </span>
          </div>
          <div class="flex">
            <span class="mini-tag">0/4</span>
            <span class="mini-tag">obrigatório</span>
          </div>
        </div>

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
        <div class="modal__actions">
          <div class="modal__actions--counter">
            <button @click="quantity = Math.max(1, quantity - 1)">
              <Minus />
            </button>
            <span>{{ quantity }}</span>
            <button @click="quantity++">
              <Plus />
            </button>
          </div>

          <button
            class="modal__actions--submit"
            :disabled="!isValid"
            @click="handleAddToCart"
          >
            <span> Adicionar</span>
            <span>R${{ totalPrice.toFixed(2) }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
  display: grid;
  // grid-template-columns: 1fr 1fr;
  left: 50%;
  opacity: 1;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  min-width: 1200px;
  width: fit-content;
  grid-template: 40px auto 80px / 1fr 1fr;
  height: 45vw;
  max-width: 1200px;
  max-height: 580px;
  min-height: auto;
  border-radius: 4px;

  &__content {
    &--header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 20px 1rem 0;

      h4 {
        font-size: 1rem;
        font-weight: 500;
        text-transform: uppercase;
        color: #3e3e3e;
      }
    }

    &--item-description {
      display: inline-block;
      font-size: 0.875rem;
      padding: 10px 40px 0 0px;
      font-weight: 300;
      line-height: 1.22;
      color: #717171;
      white-space: pre-line;
      word-break: break-all;
    }

    &--info-serves {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.875rem;
      line-height: 1rem;
      color: #3e3e3e;
      font-weight: 500;
      padding: 10px 0;
    }

    &--price {
      display: block;
      font-size: 1rem;
      color: #50a773;
      margin: 12px 0;
    }

    &--header-choices {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f2f2f2;
      z-index: 20;
      position: sticky;
      top: 0;
      padding: 12px 40px 10px;

      div {
        display: flex;
        flex-direction: column;

        &.flex {
          flex-direction: row;
          gap: 3px;
        }

        strong {
          font-size: 1rem;
          line-height: 1.25em;
          font-weight: 500;
          color: #3f3e3e;
        }

        span.choice-desc {
          font-weight: 100;
          font-size: 0.875rem;
          line-height: 17px;
          display: block;
          color: #717171;
        }

        .mini-tag {
          font-size: 0.625rem;
          line-height: 1;
          background-color: rgb(113, 113, 113);
          color: rgb(245, 240, 235);
          padding: 6px 6px 4px;
          height: max-content;
          border-radius: 3px;
          text-transform: uppercase;
        }
      }
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    padding: 20px;

    &--counter {
      display: flex;
      align-items: center;
      gap: 10px;
      border: 1px solid rgb(220, 220, 220);
      border-radius: 4px;

      button {
        width: 40px;
        height: 40px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        color: rgb(234, 29, 44);
      }

      span {
        font-size: 1.125rem;
      }
    }

    &--submit {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 240px;
      text-align: center;
      background: rgb(234, 29, 44);
      color: #fff;
      padding: 15px;
      border-radius: 4px;
    }
  }
}
</style>
