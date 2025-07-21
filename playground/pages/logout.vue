<template>
  <div>
    <h1>Logout Page</h1>
    <button @click="logout">Logout</button>
    <p>Check console for logout response.</p>
  </div>
</template>

<script>
export default {
  methods: {
    async logout() {
      useAuthStore().logout();
    },
  },
};
</script>
