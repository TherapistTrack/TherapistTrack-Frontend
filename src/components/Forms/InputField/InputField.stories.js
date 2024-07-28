import InputField from './InputField.vue'

export default {
  title: 'Components/Forms/InputField',
  component: InputField,
  argTypes: {
    label: { control: 'text' },
    id: { control: 'text' },
    type: { control: 'text' },
    placeholder: { control: 'text' },
    maxlength: { control: 'number' },
    showIcon: { control: 'boolean' }
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
  label: 'Input Label',
  id: 'input-id',
  type: 'text',
  placeholder: 'Enter text...',
  maxlength: 255,
  showIcon: false
}
