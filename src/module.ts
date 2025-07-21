import { defineNuxtModule, addPlugin, createResolver } from "@nuxt/kit";

// Module options TypeScript interface definition
export interface ModuleOptions {
  apiUrl: string;
  accessTokenCookie?: string;
  refreshTokenCookie?: string;
  loginPath?: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-http",
    configKey: "http",
  },
  // Default configuration options of the Nuxt module
  defaults: {
    accessTokenCookie: "appAccessToken",
    refreshTokenCookie: "appRefreshToken",
    loginPath: "/login",
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    // Add the module options to the runtime config
    nuxt.options.runtimeConfig.public.nuxtHttp = {
      accessTokenCookie: options.accessTokenCookie || "appAccessToken",
      refreshTokenCookie: options.refreshTokenCookie || "appRefreshToken",
      apiUrl: options.apiUrl,
      loginPath: options.loginPath || "/login",
    };

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve("./runtime/plugin.js"));
  },
});
