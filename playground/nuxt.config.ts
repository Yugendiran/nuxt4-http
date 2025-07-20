export default defineNuxtConfig({
  compatibilityDate: "2025-07-20",
  modules: ["../src/module"],
  http: {
    accessTokenCookie: "nexxauthAccessToken2",
    refreshTokenCookie: "nexxauthRefreshToken2",
  },
  devtools: { enabled: true },
});
