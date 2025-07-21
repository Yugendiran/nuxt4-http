<template>
  <div>
    <h1>Login Page</h1>
    <button @click="login">Login</button>
    <p>Check console for login response.</p>
  </div>
</template>

<script>
export default {
  methods: {
    async login() {
      let response = await this.$http.post("/auth/login", {
        email: {
          email: "yyugi64@gmail.com",
        },
        platform: "nexxavy",
        product: "auth",
        password: "112233",
      });

      if (response.success) {
        let cookie = await useAuthStore().authenticateUser(
          response.accessToken,
          response.accessTokenExp,
          response.refreshToken,
          response.refreshTokenExp
        );

        console.log("Login successful, cookies set:", cookie);
      }
    },
  },
};
</script>
