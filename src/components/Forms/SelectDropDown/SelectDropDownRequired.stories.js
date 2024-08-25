import SelectDropDown from './SelectDropDownRequired.vue'

export default {
  title: 'Components/SelectDropDown/SelectDropDownRequired',
  component: SelectDropDown,
  argTypes: {
    modelValue: { control: 'text' },
    label: { control: 'text' },
    id: { control: 'text' },
    disabledValue: { control: 'text' },
    options: { control: 'array' },
    description: { control: 'text' }
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
  options: ['Option 1', 'Option 2'],
  description: 'This is a select drop down as required field'
}
