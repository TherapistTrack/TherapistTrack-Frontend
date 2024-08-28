import { ref } from 'vue'

export function useContextMenu() {
  const position = ref({ x: 0, y: 0 })
  const visible = ref(false)

  function showContextMenu(event) {
    position.value = { x: event.clientX, y: event.clientY }
    visible.value = true
    event.preventDefault() // Prevenir el menú contextual predeterminado del navegador
  }

  function hideContextMenu() {
    visible.value = false
  }

  return {
    position,
    visible,
    showContextMenu,
    hideContextMenu
  }
}
