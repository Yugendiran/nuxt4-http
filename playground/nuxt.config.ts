export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  compatibilityDate: '2025-07-20',
  http: {
    accessTokenCookie: 'nexxauthAccessToken2',
    refreshTokenCookie: 'nexxauthRefreshToken2',
    apiUrl: 'https://api.crackaspire.com/nexxauth/api',
  },
})
