<template>
  <div class="loader">
    <div class="loaderBar"></div>
  </div>
</template>

<style scoped>
body {
  background: #333;
}
.loader {
  width: 50%;
  height: 3px;
  margin: 0 auto;
  border-radius: 10px;
  position: relative;
}

.loader .loaderBar {
  position: absolute;
  border-radius: 10px;
  top: 0;
  right: 100%;
  height: 100%;
  bottom: 0;
  left: 0;
  background: var(--blue-1);
  width: 0;
  animation: borealisBar 2s linear infinite;
}

@keyframes borealisBar {
  0% {
    left: 0%;
    right: 100%;
    width: 0%;
  }
  10% {
    left: 0%;
    right: 75%;
    width: 25%;
  }
  90% {
    right: 0%;
    left: 75%;
    width: 25%;
  }
  100% {
    left: 100%;
    right: 0%;
    width: 0%;
  }
}
</style>
