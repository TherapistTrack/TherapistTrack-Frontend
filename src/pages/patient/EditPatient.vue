<template>
  <div v-if="ready" class="overlayContainer" @click="goBack()" :id="start ? 'init' : 'end'">
    <div class="view-record" @click.stop="" :id="start ? 'init' : 'end'">
      <div class="top">
        <h1>
          <b>{{ userData['Nombre'] }}</b>
        </h1>
        <RiCloseLine
          class-name="icon"
          size="2rem"
          color="var(--gray-2)"
          alt="close"
          @click="goBack()"
        />
      </div>
      <div class="mid">
        <span v-for="header in userHeaders" :key="header">
          <span
            v-if="fieldInfo[header].options !== null && fieldInfo[header].options !== undefined"
          >
            <span v-if="fieldInfo[header].required">
              <SelectDropDownRequired
                :label="header"
                :disabled-value="'Escoga una opción'"
                :model-value="userData[header]"
                :options="fieldInfo[header].options"
              />
            </span>
            <span v-else>
              <SelectDropDown
                :label="header"
                :disabled-value="'Escoga una opción'"
                :model-value="userData[header]"
                :options="fieldInfo[header].options"
              />
            </span>
          </span>
          <span v-else>
            <span v-if="fieldInfo[header].required">
              <InputFieldRequired
                :label="header"
                :model-value="userData[header]"
                :type="fieldInfo[header].type"
              />
            </span>
            <span v-else>
              <InputField
                :label="header"
                :model-value="userData[header]"
                :type="fieldInfo[header].type"
              />
            </span>
          </span>
        </span>
      </div>
      <div class="bottom">
        <ButtonSimple :msg="'Guardar'" :color="'yellow'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { RiCloseLine } from '@remixicon/vue'
import { ref, onMounted, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import InputField from '@/components/Forms/InputField/InputField.vue'
import InputFieldRequired from '@/components/Forms/InputField/InputFieldRequired.vue'
import SelectDropDown from '@/components/Forms/SelectDropDown/SelectDropDown.vue'
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'

import SelectDropDownRequired from '@/components/Forms/SelectDropDown/SelectDropDownRequired.vue'

const start = ref(false)
const router = useRouter()
const props = defineProps({
  fileId: String,
  viewData: Object,
  allData: Object,
  fields: Object
})
const ready = ref(false)

const userData = ref(null)
const userHeaders = ref([])
const fieldInfo = ref(JSON.parse(JSON.stringify(toRaw(props.fields))))

onMounted(() => {
  userData.value = props.viewData.filter((item) => item.fileId === props.fileId)[0]
  userHeaders.value = Object.keys(userData.value)
  ready.value = true
  setTimeout(() => {
    start.value = true
  }, 2) // You can adjust the delay if needed
})

const goBack = () => {
  start.value = false
  setTimeout(() => {
    router.back()
    router.back()
  }, 250) // You can adjust the delay if needed
}
</script>

<style>
.overlayContainer {
  height: 100%;
  width: 100%;
  z-index: 300;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: end;
  align-items: center;
  transition: background-color 0.3s;
}

.overlayContainer#init {
  background-color: rgba(0, 0, 0, 0.4);
}
.overlayContainer#end {
  background-color: none;
}
.view-record {
  position: absolute;
  right: -400px;
  z-index: 400;
  background-color: white;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 2vh 0 0 2vh;
  width: 400px;
  height: 100vh;
  padding: 2rem;
  transition: right 0.3s;
}
.view-record#init {
  right: 0;
}
.view-record#end {
  right: -400px;
}

.view-record .icon,
.view-record .act-edit,
.view-record .act-delete {
  cursor: pointer;
  max-height: 5vh;
  transition: fill 0.1s;
}

.act-edit:hover {
  fill: var(--yellow-1);
}
.act-delete:hover {
  fill: var(--red-1);
}

.view-record .top {
  display: flex;
  justify-content: space-between;
  padding-bottom: 1rem;
}
.view-record .mid {
  padding: 1rem;
  height: 360px;
  overflow-y: auto;
}

.view-record .bottom {
  border-top: 1px solid var(--gray-3);
  padding-top: 1rem;
  width: 100%;
  display: flex;
  justify-content: end;
}

@media (max-aspect-ratio: 1/1) {
  .view-record {
    width: 280px;
  }
  .view-record .mid {
    height: 65vh;
  }
}
</style>
