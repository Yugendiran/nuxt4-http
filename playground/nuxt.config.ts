export default defineNuxtConfig({
  modules: ["../src/module"],
  devtools: { enabled: true },
  compatibilityDate: "2025-07-20",
  http: {
    apiUrl: "http://localhost:5000/nexxauth/api",
    accessTokenCookie: "nexxauthAccessToken",
    refreshTokenCookie: "nexxauthRefreshToken",
    // middleware: {
    //   global: true,
    // },
    refreshTokenEndpoint: "/auth/refresh-token",
  },
});
