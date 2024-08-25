<template>
  <div class="overlay-container">
    <div class="alert-container">
      <h2>{{ msg }}</h2>

      <div class="alert-options">
        <ButtonSimple :msg="'SI'" :color="'white'" :on-click="handleClickYes" />
        <ButtonSimple :msg="'NO'" :color="'red'" :on-click="handleClickNo" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ButtonSimple from '@/components/Buttons/ButtonSimple.vue'
const props = defineProps({
  msg: {
    type: String,
    default: ''
  },
  onYes: Function,
  onNo: Function
})

const handleClickYes = () => {
  props.onYes()
}
const handleClickNo = () => {
  props.onNo()
}
</script>

<style>
.overlay-container {
  height: 100%;
  width: 100%;
  z-index: 500;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
}

.alert-container {
  background-color: var(--white);
  padding: 2rem;
  border-radius: 1rem;
  width: 60vw;
  max-width: 400px;
  text-align: center;
}

.alert-options {
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  margin: 0 2rem 0 2rem;
}
</style>
