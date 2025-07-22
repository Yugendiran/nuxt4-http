import {
  defineNuxtRouteMiddleware,
  navigateTo,
  useRuntimeConfig,
  useCookie,
} from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig().public.nuxtHttp;

  const accessToken = useCookie(config.accessTokenCookie);
  const refreshToken = useCookie(config.refreshTokenCookie);

  // If user has access token, allow navigation
  if (accessToken.value) {
    return;
  }

  // If user has refresh token but no access token, allow navigation
  // (the HTTP plugin should handle token refresh)
  if (refreshToken.value) {
    return;
  }

  // If no tokens and user is trying to access login page, allow it
  if (config.loginPath && to.path === config.loginPath) {
    return;
  }

  // If no tokens and not on login page, redirect to login
  if (config.loginPath) {
    return navigateTo(config.loginPath);
  }
});
