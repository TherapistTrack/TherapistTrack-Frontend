// src/components/Feedback/Toast/
import ToastLoader from './ToastLoader.vue'
export default {
  title: 'Components/Feedback/Toast/ToastLoader',
  component: ToastLoader
}

const Template = (args) => ({
  components: { ToastLoader },
  setup() {
    return { args }
  },
  template: '<ToastLoader v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = {
  toastList: [
    { type: 0, content: 'error message' },
    { type: 1, content: 'success message' },
    { type: 2, content: 'warning message' }
  ]
}
