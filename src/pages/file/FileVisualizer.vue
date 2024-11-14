<template>
  <div class="doc-view">
    <div class="doc-head" :id="idConfig.viewerHeader">
      <RiAddLine @click="zoomIn" class="icon" size="1.5rem" color="white" :id="idConfig.zoomIn" />

      <select class="zoom" :id="idConfig.zoom" disabled="true">
        <option v-for="n in Array.from({ length: 60 }, (_, i) => i + 1)" :key="n" :value="n / 10">
          {{ n * 10 }}%
        </option>
      </select>
      <RiSubtractLine
        @click="zoomOut"
        class="icon"
        size="1.5rem"
        color="white"
        :id="idConfig.zoomOut"
      />
      <RiExpandDiagonalLine
        class="icon"
        size="1.2rem"
        color="white"
        :id="idConfig.presentationMode"
      />
    </div>
    <div class="doc-body">
      <VuePdfApp
        :pdf="pdfSrc"
        :id-config="idConfig"
        :config="{ toolbar: false }"
        :page-number="1"
        v-model:page-scale="scale"
      />
    </div>
  </div>
</template>

<script setup>
import { RiAddLine, RiSubtractLine, RiExpandDiagonalLine } from '@remixicon/vue'
import { ref, watch } from 'vue'
// import test from './test.pdf'
import VuePdfApp from 'vue3-pdf-app'

const scale = ref('60')
watch(
  scale,
  () => {
    console.log(scale)
  },
  { deep: true }
)

const idConfig = {
  zoomIn: 'zoomInId',
  zoomOut: 'zoomOutId',
  viewerHeader: 'vieweHeaderId',
  presentationMode: 'presentationModeId',
  zoom: 'scaleSelect'
}

const pdfSrc = ref(
  'https://bucket-therapisttrack-test.s3.us-east-2.amazonaws.com/648a4fbdc3b1f5a3f8b7e5cd/647b8fbdc3b1f5a3f8b7e4cd/1731527451544-test.pdf?response-content-disposition=inline&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFsaCXVzLWVhc3QtMiJIMEYCIQCwkX09eEBdby11tMhYJ%2F2x2POKrXxXOL9maBnqpFsBAwIhAIL34FPGXrGhrX4X2%2FnwrxmpZpMt7OW1q%2FgPDsruGD8MKtADCOT%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMOTc1MDQ5OTM5MTM2IgwCIEWVL0ye86HKiGoqpANIeZyPBB%2BSKOS27lQ67bpqGFAWh3amnW6%2FOZr8gg2UvAXzVWDQO6DHLCINtEBYi%2Bn813rTK1Es%2BEljlvtjgHg1Kfek%2FaC1ymXjcOt0B%2FDXzRBEKFLrZ7fYK%2FgZxzGSsTTdI0Yt6chLB72vrX3gLIiMtFAjEoomvlgnT1rl58QnzEh6Iiz6%2BDBH1Eqx4IYB%2FRoCML9IPlqpJKFlqAyDYKab4%2B36rQd3da6et6cz%2FMxfdpQ4np5STBaUNH6UiI8mLWFD%2BlCRLk2oovSVatg0x2nDqaLO3r2JcJhXZa%2FXKtnHZiHYXofca4JeUqYaEFJ5cOw03E3o0%2B9zgwRDIsE%2FKHQg6ktiK10rEVeFKWSCdX0mZWJNmYd0IyOkM5Vf3VEwBvCHhflxUCkVunXqHQGYjcATM6OYJR25krQJEWssHWsSVWTZDwkhJ1Dm0W2l8%2BN1wOUp3l%2B2Rky44H%2BLe9UYHFi7XO%2BnwaUSSZwW6NYlnoBNYNM9R9iCQ3G7gzgHa34P3GVx6UnuMZgyF58on5%2Bu7PD%2BjbkNd7aDKErrNJZ9PCWuBq6apLkwn9LTuQY64wJKoIcTTeZxgAOaPf5wEjt9q4qTsCXh9%2FpQm0GTOQoCIlvpLIhJA4bUMSHBg1VRaEmIQ%2B0lqIZlvcsBg01Ky0a5kOmcfMT1%2B%2FurhCrSXv9REFizm%2FIDKrMTB%2Fppie8ijZ68NgfGlwcmJ1EGmiyX%2FKKFjp%2FnWZ9KF1tnKW5eqtiYca5JJkQy40LU4E8eU8NKQQ2Eqjhzcvs8ew6NvARkSCv2mVCsflNFYgpyYBUs3XBnBKqAHTFOMDX%2FjIgsQkRxlgPoLtmR1PoN4Pbf3mmtU7%2FjI7HlMChYkbnI6OkPrdlNl4TwfglWcwHVNWel6E1t8eCPuU2VwG69St5zKmBauVzLMVwkh2%2FMejaJ9FFmlbFXloEQogaHbW%2F5BjAT%2F4faGnajuaKmTGkvHNHO0Gqa%2Fhz8Bnvf6fOXcXpqpWK8Etnc2BdMYf5u37WxYzalrU5SD3VptG2JAAfJKXv68voEkGBPnjFA&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA6GBMBLDAOFTLN5IW%2F20241114%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20241114T023146Z&X-Amz-Expires=600&X-Amz-SignedHeaders=host&X-Amz-Signature=c495044f3432526a11228e15da083f43c2f7fa989254f0c3af049fd6a393b4bb'
)
</script>

<style scoped>
.zoom {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 2.3rem;
  border: none;
  background-color: var(--blue-1);
  color: white;
}
.doc-view {
  width: 80%;
  justify-content: center;
}

.doc-head {
  background-color: var(--blue-1);
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 1rem 1rem 0 0;
}
.doc-head p {
  color: white;
}

.doc-body {
  background-color: var(--white);
  padding: 1rem;
  height: 65vh;
  overflow-x: scroll;
}

.icon {
  cursor: pointer;
}

.pdf-app.dark,
.pdf-app.light {
  --pdf-app-background-color: var(--white);
}
</style>
