<script setup lang="ts">
definePageMeta({
  middleware: 'auth-staff',
  layout: 'admin',
});

const authStore = useAuthStore();
const { logout } = useAuth();

async function handleLogout() {
  logout();
  await navigateTo('/admin/login');
}
</script>

<template>
  <div>
    <h1>Painel — {{ authStore.user?.name }}</h1>
    <p>Cargo: {{ authStore.user?.role }}</p>
    <button @click="handleLogout">Sair</button>
  </div>
</template>
