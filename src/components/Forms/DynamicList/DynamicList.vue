<template>
  <div class="dynamic-list">
    <b class="title">{{ title }}</b>
    <div class="list">
      <div class="list-item" v-for="(item, index) in localList" :key="index">
        <DynamicListField
          v-if="index < localList.length - 1"
          v-model:model-value="localList[index]"
          :onClose="() => removeItem(index)"
        />
        <DynamicListField
          v-else
          :is-dummy="true"
          v-model:model-value="localList[index]"
          :onClose="() => removeItem(index)"
          @change="addItem"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import DynamicListField from '../InputField/DynamicListField.vue'
import { ref, watch } from 'vue'

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

watch(
  localList,
  () => {
    if (localList.value.slice(0, -1).includes('')) {
      let index = localList.value.slice(0, -1).indexOf('')
      localList.value.splice(index, 1)
      emit('update:modelArray', localList.value)
    }
  },
  { deep: true }
)

if (props.modelArray === null || props.modelArray === undefined) {
  localList.value = ['']
} else {
  localList.value = JSON.parse(JSON.stringify(props.modelArray))
  localList.value.push('')
}

const emit = defineEmits(['update:modelArray'])

const removeItem = (index) => {
  localList.value.splice(index, 1)
  emit('update:modelArray', localList.value)
  emit('change', localList.value)
}
const addItem = () => {
  localList.value.push('')
  emit('update:modelArray', localList.value.slice(0, -1))
}
</script>

<style>
.dynamic-list {
  display: flex;
}
.dynamic-list .title {
  align-self: flex-start;
  margin-top: 1.5rem;
  font-size: 0.8rem;
}

.dynamic-list .list {
  padding: 1rem;
  border-radius: 0.5rem;
  display: grid;
  gap: 1rem;
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
