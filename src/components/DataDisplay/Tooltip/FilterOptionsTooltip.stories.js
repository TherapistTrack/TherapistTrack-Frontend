import FilterOptionsTooltip from './FilterOptionsTooltip.vue'

const meta = {
  component: FilterOptionsTooltip,
  args: {},
  decorators: [
    () => ({
      template:
        '<div style="display: flex; position: relative; align-items: center; justify-content: center; margin-top: 9rem;"><story /></div>'
    })
  ]
}

export default meta

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {}
}
