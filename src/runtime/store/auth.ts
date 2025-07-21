import { defineStore } from "pinia";
import { useCookie, useRuntimeConfig } from "#app";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const utcToLocal = (utc: string, format?: string) => {
  return dayjs
    .utc(utc)
    .tz(dayjs.tz.guess())
    .format(format || "YYYY-MM-DD hh:mm:ss A");
};

const localToUtc = (local: string, format?: string) => {
  return dayjs(local)
    .utc()
    .format(format || "YYYY-MM-DD hh:mm:ss A");
};

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
      try {
        const CONFIG = useRuntimeConfig().public.nuxtHttp;

        let accessTokenCookie = useCookie(CONFIG.accessTokenCookie, {
          expires: new Date(
            CONFIG.enforceTokenExpiryUtc
              ? utcToLocal(accessTokenExp, "YYYY-MM-DD HH:mm:ss")
              : accessTokenExp
          ),
        });
        accessTokenCookie.value = accessToken;

        let refreshTokenCookie = useCookie(CONFIG.refreshTokenCookie, {
          expires: new Date(
            CONFIG.enforceTokenExpiryUtc
              ? utcToLocal(refreshTokenExp, "YYYY-MM-DD HH:mm:ss")
              : refreshTokenExp
          ),
        });
        refreshTokenCookie.value = refreshToken;

        this.authenticated = true;

        return true;
      } catch (error) {
        console.error("Authentication failed:", error);
        this.authenticated = false;
        return false;
      }
    },
    async authenticateUserRefresh() {
      try {
        const CONFIG = useRuntimeConfig().public.nuxtHttp;

        const refreshToken = useCookie(CONFIG.refreshTokenCookie);

        const res = await fetch(
          `${CONFIG.apiUrl}${CONFIG.refreshTokenEndpoint}`,
          {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              refreshToken: refreshToken.value,
            }),
          }
        ).then((res) => res.json());

        if (res.success) {
          const accessToken = useCookie(CONFIG.accessTokenCookie, {
            expires: new Date(
              CONFIG.enforceTokenExpiryUtc
                ? utcToLocal(res.accessTokenExp, "YYYY-MM-DD HH:mm:ss")
                : res.accessTokenExp
            ),
          });
          accessToken.value = res.accessToken;

          const refreshToken = useCookie(CONFIG.refreshTokenCookie, {
            expires: new Date(
              CONFIG.enforceTokenExpiryUtc
                ? utcToLocal(res.refreshTokenExp, "YYYY-MM-DD HH:mm:ss")
                : res.refreshTokenExp
            ),
          });
          refreshToken.value = res.refreshToken;

          this.authenticated = true;

          return res;
        } else {
          return null;
        }
      } catch (error) {
        console.error("Refresh token authentication failed:", error);
        this.authenticated = false;
        return null;
      }
    },
    logUserOut() {
      try {
        const CONFIG = useRuntimeConfig().public.nuxtHttp;

        this.authenticated = false;
        const accessToken = useCookie(CONFIG.accessTokenCookie);
        accessToken.value = null;
        const refreshToken = useCookie(CONFIG.refreshTokenCookie);
        refreshToken.value = null;

        return true;
      } catch (error) {
        console.error("Logout failed:", error);
        return false;
      }
    },
  },
});
