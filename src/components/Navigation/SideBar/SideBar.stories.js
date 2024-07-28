// src/components/Navigation/SideBar/SideBar.stories.js
import SideBar from './SideBar.vue'

export default {
  title: 'Components/Navigation/SideBar',
  component: SideBar
}

const Template = (args) => ({
  components: { SideBar },
  setup() {
    return { args }
  },
  template: '<SideBar v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = {}
