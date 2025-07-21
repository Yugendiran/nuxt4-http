import { defineNuxtRouteMiddleware, navigateTo } from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
  console.log("[Auth Middleware] Middleware executed successfully");
});
