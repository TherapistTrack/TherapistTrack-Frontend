import InputField from './InputFieldSimple.vue'

export default {
  title: 'Components/Forms/InputFieldSimple',
  component: InputField,
  argTypes: {
    id: { control: 'text' },
    type: { control: 'text' },
    placeholder: { control: 'text' },
    maxlength: { control: 'number' }
  }
}

const Template = (args) => ({
  components: { InputField },
  setup() {
    return { args }
  },
  template: '<InputField v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = {
  id: 'input-id',
  type: 'text',
  placeholder: 'Enter text...',
  maxlength: 255,
  showIcon: false
}
