<template>
  <div class="icon-button-component" :class="{ disabled: props.disabled }" @click="handleClick">
    <component v-if="firstIcon" :is="firstIcon" size="1.5rem" color="var(--gray-2)" />
    <p>{{ msg }}</p>
    <component v-if="secondIcon" :is="secondIcon" size="1.5rem" color="var(--gray-2)" />
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
    required: false,
    default: null
  },
  secondIcon: {
    type: Object,
    required: false,
    default: null
  },
  onClick: {
    type: Function,
    default: null
  }
})

function handleClick() {
  if (!props.disabled && props.onClick) {
    props.onClick()
  }
}
</script>

<style scoped>
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

.icon-button-component.disabled {
  cursor: not-allowed;
  opacity: 0.6;
  pointer-events: none;
}
</style>
