// src/components/Feedback/Spinner/DataLoader.stories.js
import DataLoader from './OverlayLoader.vue'

export default {
  title: 'Components/Feedback/Spinner/OverlayLoader',
  component: DataLoader
}

const Template = (args) => ({
  components: { DataLoader },
  setup() {
    return { args }
  },
  template: '<DataLoader v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = {}
