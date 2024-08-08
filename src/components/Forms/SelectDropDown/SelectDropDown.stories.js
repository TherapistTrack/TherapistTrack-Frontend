import SelectDropDown from './SelectDropDown.vue'

export default {
  title: 'Components/SelectDropDown/SelectDropDown',
  component: SelectDropDown,
  argTypes: {
    modelValue: { control: 'text' },
    label: { control: 'text' },
    id: { control: 'text' },
    disabledValue: { control: 'text' },
    options: { control: 'array' }
  }
}

const Template = (args) => ({
  components: { SelectDropDown },
  setup() {
    return { args }
  },
  template: '<SelectDropDown v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = {
  label: 'Select Drop Down',
  id: 'input-id',
  disabledValue: 'Pick an Option',
  options: ['Option 1', 'Option 2']
}
