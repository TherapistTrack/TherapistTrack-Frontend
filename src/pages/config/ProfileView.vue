<template>
  <div class="profile-container">
    <!-- Usando la SideBarConfig con color azul -->
    <SideBarConfig
      backgroundColor="#1f3a93"
      arrowColor="#ffffff"
      iconColor="#ffffff"
      userName="Jose Marchena"
      userRole="Usuario"
      selectedOption="Mi Cuenta"
    />

    <div class="content">
      <h1>Jose Marchena</h1>
      <div class="account-info">
        <div class="user-info-row">
          <p class="label"><strong>Usuario:</strong></p>
          <p class="value">marchiUwU</p>
        </div>
        <div class="user-info-row">
          <p class="label"><strong>Contraseña:</strong></p>
          <p class="value">· · · · · · · ·</p>
          <a href="#" class="change-password-link">Cambiar contraseña</a>
        </div>
      </div>

      <h2>Sesiones abiertas</h2>
      <div class="session-list">
        <div class="session-item">
          <span class="device-icon">📱</span>
          <div>
            <p><strong>Honor X8</strong></p>
            <p>Última actividad hoy a las 4:59 pm</p>
          </div>
        </div>
        <div class="session-item selected">
          <span class="device-icon">📱</span>
          <div>
            <p><strong>Ipad Pro Max</strong></p>
            <p>Última actividad 2 de enero a las 4:59 pm</p>
          </div>
        </div>
        <div class="session-item">
          <span class="device-icon">💻</span>
          <div>
            <p><strong>Apple M1</strong></p>
            <p>Última actividad hoy a las 4:59 pm</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SideBarConfig from '@/components/Navigation/SideBar/SideBarConfig.vue' // Cambiado a SideBarConfig
</script>

<style scoped>
.profile-container {
  display: flex;
  height: 100vh; /* Asegura que la altura cubra toda la pantalla */
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.content {
  flex-grow: 1;
  padding: 65px;
  background-color: #fff;
  border-radius: 8px;
  height: 100vh; /* Asegura que el contenedor cubra toda la altura de la pantalla */
  margin-left: 0;
  box-shadow: none;
  overflow-y: hidden; /* Evita el scroll vertical */
}

h1 {
  font-size: 32px;
  margin-bottom: 20px;
}

.account-info {
  display: flex;
  flex-direction: column; /* Alinea las filas de usuario y contraseña verticalmente */
  margin-bottom: 30px;
}

.user-info-row {
  display: flex;
  align-items: center; /* Alinea los elementos en la misma fila verticalmente */
  margin-bottom: 10px;
}

.user-info-row .label {
  width: 100px; /* Asegura que las etiquetas tengan un ancho consistente */
  margin: 0;
  font-size: 18px;
  color: #333;
  padding-right: 200px; /* Añade espacio entre la etiqueta y el valor */
}

.user-info-row .value {
  margin: 0 15px 0 0;
  font-size: 16px;
  color: #555;
}

.change-password-link {
  margin-left: 100px; /* Añade espacio entre la contraseña y el enlace */
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}

.session-list {
  margin-top: 20px;
}

.session-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
}

.session-item.selected {
  background-color: #f0f0f0;
}

.device-icon {
  font-size: 24px;
  margin-right: 15px;
}

/* Asegurando que el texto de "Jose Marchena" y "Usuario" sea blanco */
.userData {
  color: #ffffff !important;
}
</style>
