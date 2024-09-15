import { fn } from '@storybook/test'
import ConfigButton from './ConfigButton.vue'

export default {
  title: 'Components/Buttons/ConfigButton',
  component: ConfigButton,
  args: { onClick: fn() }
}

const Template = (args) => ({
  components: { ConfigButton },
  setup() {
    return { args }
  },
  template: '<ConfigButton v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = {}
