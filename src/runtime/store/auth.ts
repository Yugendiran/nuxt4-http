import { defineStore } from "pinia";
import { useCookie, useRuntimeConfig } from "#app";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: false,
  }),
  actions: {
    async authenticateUser(
      accessToken: string,
      accessTokenExp: string,
      refreshToken: string,
      refreshTokenExp: string
    ) {
      const CONFIG = useRuntimeConfig().public.nuxtHttp;

      let accessTokenCookie = useCookie(CONFIG.accessTokenCookie, {
        expires: new Date(accessTokenExp),
      });
      accessTokenCookie.value = accessToken;

      let refreshTokenCookie = useCookie(CONFIG.refreshTokenCookie, {
        expires: new Date(refreshTokenExp),
      });
      refreshTokenCookie.value = refreshToken;

      this.authenticated = true;

      return true;
    },
  },
});
