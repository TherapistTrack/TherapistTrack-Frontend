// src/components/Forms/InputField/SearchBar.stories.js
import SearchBar from './SearchBar.vue'

export default {
  title: 'Components/Forms/InputField/SearchBar',
  component: SearchBar,
  argTypes: {
    pholder: { control: 'text' }
  }
}

const Template = (args) => ({
  components: { SearchBar },
  setup() {
    return { args }
  },
  template: '<SearchBar v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = {
  pholder: 'Search...'
}
