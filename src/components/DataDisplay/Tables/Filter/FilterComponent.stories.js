import { fn } from '@storybook/test'
import FilterComponent from './FilterComponent.vue'

const meta = {
  component: FilterComponent,
  args: {}
}

export default meta

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

export const Filtro = {
  args: {
    field: 'Field',
    operation: 'es',
    value: 'Valor',
    onClose: fn(),
    type: true
  }
}

export const SortUp = {
  args: {
    field: 'Field',
    onClose: fn(),
    type: false,
    mode: true
  }
}
export const SortDown = {
  args: {
    field: 'Field',
    onClose: fn(),
    type: false,
    mode: false
  }
}
