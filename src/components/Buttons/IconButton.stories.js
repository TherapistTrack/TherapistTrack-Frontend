import { fn } from '@storybook/test'
import MyButton from './IconButton.vue'
import { RiAddLine, RiFilterFill } from '@remixicon/vue'

export default {
  title: 'Components/Buttons/IconButton',
  component: MyButton,
  args: { onClick: fn(), firstIcon: RiFilterFill, secondIcon: RiAddLine },
  argTypes: {
    msg: { control: 'text' }
  }
}

const Template = (args) => ({
  components: { MyButton },
  setup() {
    return { args }
  },
  template: '<MyButton v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = { msg: 'Nuevo Filtro' }
