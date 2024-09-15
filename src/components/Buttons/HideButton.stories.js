import { fn } from '@storybook/test'
import MyButton from './HideButton.vue'

const meta = {
  component: MyButton,
  args: { onClick: fn(), onClickOutside: fn() }
}

export default meta

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {}
}
