// src/components/Feedback/Spinner/DataLoader.stories.js
import DataLoader from './DataLoader.vue'

export default {
  title: 'Components/Feedback/Spinner/DataLoader',
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
