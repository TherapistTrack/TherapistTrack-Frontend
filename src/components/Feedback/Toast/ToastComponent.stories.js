// src/components/Feedback/Toast/
import Toast from './ToastComponent.vue'
import { fn } from '@storybook/test'
export default {
  title: 'Components/Feedback/Toast/ToastComponent',
  component: Toast
}

const Template = (args) => ({
  components: { Toast },
  setup() {
    return { args }
  },
  template: '<Toast v-bind="args" />'
})

export const Default = Template.bind({})
Default.args = {
  content: 'This is an example error message, here is the content on what went wrong',
  type: 0, // Assuming type 0 is for Error
  onClose: fn()
}

// Default Error case
export const Error = Template.bind({})
Error.args = {
  content: 'This is an example error message, here is the content on what went wrong',
  type: 0, // Assuming type 0 is for Error
  onClose: fn()
}

// Success case
export const Success = Template.bind({})
Success.args = {
  content: 'This is an example success message, everything went fine',
  type: 1, // Assuming type 2 is for Success
  onClose: fn()
}

// Warning case
export const Warning = Template.bind({})
Warning.args = {
  content: 'This is an example warning message, please be cautious',
  type: 2, // Assuming type 1 is for Warning
  onClose: fn()
}
