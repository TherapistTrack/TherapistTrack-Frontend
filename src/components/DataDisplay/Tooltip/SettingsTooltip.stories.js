import { fn } from '@storybook/test'
import SettingsTooltip from './SettingsTooltip.vue'

const meta = {
  component: SettingsTooltip,
  args: { onLogout: fn(), onProfile: fn(), onClickOutside: fn() },
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
