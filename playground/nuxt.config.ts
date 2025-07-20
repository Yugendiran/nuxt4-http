export default defineNuxtConfig({
  compatibilityDate: "2025-07-20",
  modules: ["../src/module"],
  http: {
    accessTokenCookie: "nexxauthAccessToken2",
    refreshTokenCookie: "nexxauthRefreshToken2",
    apiUrl: "https://api.crackaspire.com/nexxauth/api",
  },
  devtools: { enabled: true },
});
