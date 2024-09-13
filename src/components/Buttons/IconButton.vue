<template>
  <div class="icon-button-component" @click="handleClick">
    <RiArrowUpDownLine v-if="type == 'sort'" size="1.2rem" color="var(--gray-2)" />
    <RiFilterFill size="1.2rem" color="var(--gray-2)" v-else />

    <p v-if="type == 'sort'">Ordenar</p>
    <p v-else>Nuevo Filtro</p>
    <RiAddLine size="1.2rem" color="var(--gray-2)" />
  </div>
</template>

<script setup>
import { RiArrowUpDownLine, RiFilterFill, RiAddLine } from '@remixicon/vue'
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  type: String,
  onClick: Function
})
const handleClick = () => {
  props.onClick()
}
</script>

<style>
.icon-button-component {
  padding: 0.4rem 1rem;
  border-radius: 0.7vh;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: fit-content;
}

.icon-button-component p {
  color: var(--gray-1);
  font-size: small;
}

.icon-button-component:hover {
  background-color: var(--gray-3);
}
</style>
