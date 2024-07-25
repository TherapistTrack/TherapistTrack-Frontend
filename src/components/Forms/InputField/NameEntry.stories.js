// src/components/Forms/InputField/NameEntry.stories.js
import NameEntry from './NameEntry.vue'

export default {
  title: 'Components/Forms/InputField/NameEntry',
  component: NameEntry
}

const Template = (args) => ({
  components: { NameEntry },
  setup() {
    return { args }
  },
  template: '<NameEntry v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = {}
