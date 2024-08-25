import { fn } from '@storybook/test'
import AlertSimple from './AlertSimple.vue'

const meta = {
  component: AlertSimple,
  args: {
    onYes: fn(),
    onNo: fn()
  }
}

export default meta

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: {
    msg: 'Esta es una alerta de prueba. ¿Desea continuar?'
  }
}
