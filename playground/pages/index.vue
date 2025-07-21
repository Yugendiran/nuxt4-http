<script setup>
// definePageMeta({
//   middleware: "auth",
// });
</script>

<template>
  <div>Playground</div>
</template>

<script>
export default {
  async mounted() {
    await this.$http.get("/user/profile");
    //
    // Composables
    // useAuth().testAuthComposable();
    // console.log(useAuth().isAuthenticated);
    //
    // Store
    // useAuthStore().testStore();
    // console.log(useAuthStore().authenticated);
  },
};
</script>
