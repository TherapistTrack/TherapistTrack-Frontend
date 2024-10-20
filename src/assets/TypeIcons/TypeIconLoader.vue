<template>
  <div v-if="iconType == 'SHORT_TEXT'" class="container" :id="small ? 'small' : ''">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 36 29"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xml:space="preserve"
      xmlns:serif="http://www.serif.com/"
      style="fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 2"
    >
      <g>
        <path
          d="M0.045,28.292l7.282,-18.362l3.694,-0l7.204,18.362l-4.317,-0l-5.514,-15.241l1.482,-0l-5.592,15.241l-4.239,-0Zm4.135,-3.329l0,-3.329l10.014,-0l-0,3.329l-10.014,-0Z"
          style="fill: #b7b7b7; fill-rule: nonzero; stroke: #b7b7b7; stroke-width: 0.09px"
        />
        <path
          d="M24.262,18.362l-0,-3.173l4.317,0c0.798,0 1.422,-0.234 1.873,-0.702c0.45,-0.468 0.676,-1.041 0.676,-1.717c-0,-0.468 -0.104,-0.884 -0.312,-1.248c-0.208,-0.364 -0.503,-0.65 -0.884,-0.858c-0.365,-0.209 -0.815,-0.313 -1.353,-0.313l-4.317,0l-0,-3.095l3.979,0c0.676,0 1.222,-0.164 1.638,-0.494c0.417,-0.347 0.625,-0.867 0.625,-1.56c-0,-0.676 -0.208,-1.179 -0.625,-1.509c-0.416,-0.347 -0.962,-0.52 -1.638,-0.52l-3.979,0l-0,-3.173l4.759,0c1.179,0 2.176,0.217 2.991,0.65c0.832,0.434 1.465,1.015 1.899,1.743c0.433,0.728 0.65,1.534 0.65,2.419c0,1.127 -0.364,2.08 -1.092,2.861c-0.729,0.78 -1.804,1.317 -3.225,1.612l0.104,-1.378c1.543,0.294 2.731,0.893 3.563,1.794c0.849,0.902 1.274,2.012 1.274,3.329c0,1.006 -0.251,1.916 -0.754,2.731c-0.485,0.798 -1.196,1.431 -2.133,1.899c-0.919,0.468 -2.028,0.702 -3.329,0.702l-4.707,0Zm-3.121,0l-0,-18.362l4.031,0l-0,18.362l-4.031,0Z"
          style="fill: #b7b7b7; fill-rule: nonzero"
        />
      </g>
    </svg>
  </div>
  <div v-else-if="iconType == 'TEXT'" class="container" :id="small ? 'small' : ''">
    <svg
      class="text"
      width="100%"
      height="100%"
      viewBox="0 0 27 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xml:space="preserve"
      xmlns:serif="http://www.serif.com/"
      style="fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 2"
    >
      <path
        d="M-0,-0.469l26.909,-0c0.259,-0 0.469,0.21 0.469,0.469l0,2.99c0,0.259 -0.21,0.469 -0.469,0.469l-26.909,0c-0.259,0 -0.469,-0.21 -0.469,-0.469l-0,-2.99c-0,-0.259 0.21,-0.469 0.469,-0.469Zm0,10.465l26.909,-0c0.259,-0 0.469,0.21 0.469,0.469l0,2.99c0,0.259 -0.21,0.469 -0.469,0.469l-26.909,-0c-0.259,-0 -0.469,-0.21 -0.469,-0.469l-0,-2.99c-0,-0.259 0.21,-0.469 0.469,-0.469Zm-0,10.464l13.508,0c0.26,0 0.47,0.21 0.47,0.469l-0,2.99c-0,0.259 -0.21,0.469 -0.47,0.469l-13.508,0c-0.259,0 -0.469,-0.21 -0.469,-0.469l-0,-2.99c-0,-0.259 0.21,-0.469 0.469,-0.469Z"
        style="fill: #b7b7b7; fill-rule: nonzero"
      />
    </svg>
  </div>
  <div v-else-if="iconType == 'CHOICE'" class="container" :id="small ? 'small' : ''">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 31 31"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xml:space="preserve"
      xmlns:serif="http://www.serif.com/"
      style="fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 2"
    >
      <g>
        <path
          d="M14.55,24.716c0.179,0.275 0.486,0.442 0.815,0.442c0.33,-0 0.637,-0.167 0.816,-0.442c1.87,-2.873 6.461,-9.925 8.48,-13.026c0.195,-0.299 0.21,-0.681 0.04,-0.995c-0.17,-0.314 -0.499,-0.51 -0.856,-0.51c-3.892,0 -13.068,0 -16.959,0c-0.357,0 -0.686,0.196 -0.856,0.51c-0.17,0.314 -0.155,0.696 0.04,0.995c2.019,3.101 6.609,10.153 8.48,13.026Z"
          style="fill: #b7b7b7"
        />
        <path
          d="M15.365,0c8.481,0 15.366,6.885 15.366,15.365c-0,8.481 -6.885,15.366 -15.366,15.366c-8.48,-0 -15.365,-6.885 -15.365,-15.366c-0,-8.48 6.885,-15.365 15.365,-15.365Zm0,1.776c-7.5,-0 -13.589,6.089 -13.589,13.589c-0,7.501 6.089,13.59 13.589,13.59c7.501,0 13.59,-6.089 13.59,-13.59c0,-7.5 -6.089,-13.589 -13.59,-13.589Z"
          style="fill: #b7b7b7"
        />
      </g>
    </svg>
  </div>
  <div v-else-if="iconType == 'DATE'" class="container" :id="small ? 'small' : ''">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 29 29"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xml:space="preserve"
      xmlns:serif="http://www.serif.com/"
      style="fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 2"
    >
      <path
        d="M10.003,-0l0,2.858l8.575,0l-0,-2.858l2.858,-0l-0,2.858l5.716,0c0.789,0 1.429,0.64 1.429,1.429l0,22.865c0,0.789 -0.64,1.429 -1.429,1.429l-25.723,0c-0.789,0 -1.429,-0.64 -1.429,-1.429l-0,-22.865c-0,-0.789 0.64,-1.429 1.429,-1.429l5.716,0l0,-2.858l2.858,-0Zm15.72,14.291l-22.865,-0l0,11.432l22.865,0l0,-11.432Zm-18.578,-8.575l-4.287,0l0,5.716l22.865,0l0,-5.716l-4.287,0l-0,2.858l-2.858,0l-0,-2.858l-8.575,0l0,2.858l-2.858,0l0,-2.858Z"
        style="fill: #b7b7b7; fill-rule: nonzero"
      />
    </svg>
  </div>
  <div v-else-if="iconType == 'NUMBER'" class="container" :id="small ? 'small' : ''">
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 22 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xml:space="preserve"
      xmlns:serif="http://www.serif.com/"
      style="fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 2"
    >
      <path
        d="M5.012,14.569l0.557,-5.298l-5.569,0l0,-2.649l5.848,0l0.696,-6.622l2.663,-0l-0.696,6.622l5.283,0l0.696,-6.622l2.664,-0l-0.696,6.622l4.734,0l-0,2.649l-5.012,0l-0.557,5.298l5.569,0l-0,2.649l-5.848,0l-0.696,6.623l-2.663,-0l0.696,-6.623l-5.284,0l-0.696,6.623l-2.663,-0l0.696,-6.623l-4.734,0l0,-2.649l5.012,0Zm2.664,0l5.283,0l0.557,-5.298l-5.283,0l-0.557,5.298Z"
        style="fill: #b7b7b7; fill-rule: nonzero"
      />
    </svg>
  </div>
  <div v-else class="container" :id="small ? 'small' : ''">
    <!-- FLOAT -->
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 41 20"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xml:space="preserve"
      xmlns:serif="http://www.serif.com/"
      style="fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 2"
    >
      <g transform="matrix(26.2669,0,0,26.2669,40.8636,18.8783)"></g>
      <text
        x="-1.505px"
        y="18.878px"
        style="
          font-family: 'Outfit-Bold', 'Outfit';
          font-weight: 700;
          font-size: 26.267px;
          fill: #b7b7b7;
          stroke: #b7b7b7;
          stroke-width: 0.09px;
        "
      >
        .
        <tspan x="5.876px " y="18.878px ">00</tspan>
      </text>
    </svg>
  </div>
</template>

<script setup>
defineProps({
  iconType: String,
  small: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.container {
  height: 1.2rem;
  width: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}
svg {
  height: 1rem;
  width: 1rem;
}
.container#small svg {
  height: 0.8rem;
  width: 0.8rem;
}
.container#small .text {
  height: 0.7rem;
  width: 0.7rem;
}
.text {
  height: 0.8rem;
  width: 0.8rem;
}
</style>
