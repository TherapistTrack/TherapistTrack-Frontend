// src/components/Forms/InputField/CustomInput.stories.js
import CustomInput from './CustomInput.vue'

export default {
  title: 'Components/Forms/InputField/CustomInput',
  component: CustomInput,
  argTypes: {
    pholder: { control: 'text' }
  }
}

const Template = (args) => ({
  components: { CustomInput },
  setup() {
    return { args }
  },
  template: '<CustomInput v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = {
  pholder: 'Search...'
}
