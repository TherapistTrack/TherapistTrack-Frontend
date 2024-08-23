// src/components/Navigation/SideBar/RecordSideBar.stories.js
import SideBar from './RecordSideBar.vue'

export default {
  title: 'Components/Navigation/RecordSideBar',
  component: SideBar,
  argTypes: {
    localMin: { control: 'boolean' }
  }
}

const Template = (args) => ({
  components: { SideBar },
  setup() {
    return { args }
  },
  template: '<SideBar v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = { localMin: false }
