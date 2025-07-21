import {
  defineNuxtRouteMiddleware,
  navigateTo,
  useRuntimeConfig,
  useCookie,
  abortNavigation,
} from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig().public.nuxtHttp;

  const accessToken = useCookie(config.accessTokenCookie);
  const refreshToken = useCookie(config.refreshTokenCookie);

  if (!accessToken.value) {
    if (refreshToken.value) {
      return;
    }

    abortNavigation();
    return navigateTo(config.loginPath);
  }
});
