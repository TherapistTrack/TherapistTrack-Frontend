import { fn } from '@storybook/test'
import AlertDelete from './AlertDelete.vue'

const meta = {
  component: AlertDelete,
  args: {
    onYes: fn(),
    onNo: fn()
  }
}

export default meta

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    name: 'Josué Marroquín'
  }
}
