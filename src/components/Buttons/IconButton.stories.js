import { fn } from '@storybook/test'
import MyButton from './IconButton.vue'

export default {
  title: 'Components/Buttons/IconButton',
  component: MyButton,
  args: { onClick: fn() }
}

const Template = (args) => ({
  components: { MyButton },
  setup() {
    return { args }
  },
  template: '<MyButton v-bind="args" />'
})

export const Sort = Template.bind({})
Sort.args = {
  type: 'sort'
}

export const Filter = Template.bind({})
Filter.args = {
  type: 'filter'
}
