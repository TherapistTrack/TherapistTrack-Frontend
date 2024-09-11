<template>
  <span class="dynamic-list">
    <div class="title">
      <div>{{ title }}</div>
      <RiAddCircleLine fill="var(--green-1)" class="addIcon" @click="() => addItem()" />
    </div>
    <div class="list">
      <div class="list-item" v-for="(item, index) in localList" :key="index">
        <div class="dc-component" :id="item">
          <RiCloseCircleLine color="var(--red-1)" class="icon" @click="() => removeItem(index)" />
          <InputFieldSimple :id="item" v-model:model-value="localList[index]" />
        </div>
      </div>
    </div>
  </span>
</template>

<script setup>
import { RiAddCircleLine, RiCloseCircleLine } from '@remixicon/vue'
import InputFieldSimple from '../InputField/InputFieldSimple.vue'
import { ref } from 'vue'

const localList = ref([])
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  modelArray: {
    type: Array,
    required: true
  }
})
if (props.modelArray === null || props.modelArray === undefined) {
  localList.value = []
} else {
  localList.value = props.modelArray
}

const emit = defineEmits(['update:modelArray'])

const removeItem = (index) => {
  localList.value.splice(index, 1)
  emit('update:modelArray', localList.value)
}
const addItem = () => {
  try {
    localList.value.push('')
  } catch {
    localList.value.push('')
  }
  emit('update:modelArray', localList.value)
}
</script>

<style>
.dynamic-list .title {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.dynamic-list .list {
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 1rem;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  margin-bottom: 2rem;
  transition: height 1s;
}
.dynamic-list .addIcon {
  transition: fill 0.1s;
}
.dynamic-list .addIcon:hover {
  fill: var(--green-2);
}

.dc-component {
  height: fit-content;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}

.dc-component .icon {
  transition: fill 0.1s;
}
.dc-component .icon:hover {
  fill: var(--red-2);
}
</style>
