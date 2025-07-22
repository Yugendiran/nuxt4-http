export default defineNuxtConfig({
  modules: ["../src/module"],
  devtools: { enabled: true },
  compatibilityDate: "2025-07-20",
  http: {
    apiUrl: "https://api.crackaspire.com/nexxauth/api",
    accessTokenCookie: "nexxauthAccessToken",
    refreshTokenCookie: "nexxauthRefreshToken",
    // middleware: {
    //   global: true,
    // },
    refreshTokenEndpoint: "/auth/refresh-token",
    // loginPath: "/login",
    enforceTokenExpiryUtc: true,
  },
});
