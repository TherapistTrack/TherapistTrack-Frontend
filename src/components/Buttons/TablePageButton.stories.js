import { fn } from '@storybook/test'
import TablePageButton from './TablePageButton.vue'
const meta = {
  component: TablePageButton,
  args: { onClick: fn() }
}

export default meta

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    pageCount: 2,
    currentPage: 1
  }
}
