<template>
  <div class="icon-button-component" @click="handleClick">
    <component :is="firstIcon" size="1.5rem" color="var(--gray-2)" />

    <p>{{ msg }}</p>

    <component :is="secondIcon" size="1.5rem" color="var(--gray-2)" />
  </div>
</template>

<script setup>
const props = defineProps({
  msg: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  firstIcon: {
    type: Object,
    required: true
  },
  secondIcon: {
    type: Object,
    required: true
  },
  onClick: Function
})
function handleClick() {
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
  font-size: 2.2vh;
}

.icon-button-component:hover {
  background-color: var(--gray-3);
}
</style>
