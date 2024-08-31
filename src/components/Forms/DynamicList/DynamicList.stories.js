import DynamicList from './DynamicList.vue'

export default {
  title: 'Components/Forms/DynamicList',
  component: DynamicList,
  argTypes: {
    title: { control: 'text' },
    modelArray: { control: 'array' }
  }
}

const Template = (args) => ({
  components: { DynamicList },
  setup() {
    return { args }
  },
  template: '<DynamicList v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = {
  title: 'Dynamic List Title',
  modelArray: ['Item 1', 'Item 2', 'Item 3']
}
