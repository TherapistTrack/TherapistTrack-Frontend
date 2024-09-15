import { fn } from '@storybook/test'
import MyButton from './ButtonSimple.vue'

const meta = {
  component: MyButton,
  args: { onClick: fn() }
}

export default meta

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Green = {
  args: {
    msg: 'Button',
    color: '',
    disabled: false
  }
}

export const Yellow = {
  args: {
    msg: 'Button',
    color: 'yellow',
    disabled: false
  }
}

export const Red = {
  args: {
    msg: 'Button',
    color: 'red',
    disabled: false
  }
}
export const White = {
  args: {
    msg: 'Button',
    color: 'white',
    disabled: false
  }
}
export const Disabled = {
  args: {
    msg: 'Button',
    color: '',
    disabled: true
  }
}
