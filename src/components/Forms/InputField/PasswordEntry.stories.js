// src/components/Forms/InputField/PasswordEntry.stories.js
import PasswordEntry from './PasswordEntry.vue'

export default {
  title: 'Components/Forms/InputField/PasswordEntry',
  component: PasswordEntry
}

const Template = (args) => ({
  components: { PasswordEntry },
  setup() {
    return { args }
  },
  template: '<PasswordEntry v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = {}
