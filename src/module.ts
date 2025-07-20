import { defineNuxtModule, addPlugin, createResolver } from "@nuxt/kit";

// Module options TypeScript interface definition
export interface ModuleOptions {
  accessTokenCookie?: string;
  refreshTokenCookie?: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "my-module",
    configKey: "myModule",
  },
  // Default configuration options of the Nuxt module
  defaults: {
    accessTokenCookie: "appAccessToken",
    refreshTokenCookie: "appRefreshToken",
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    // Add the module options to the runtime config
    nuxt.options.runtimeConfig.public.nuxt4Http = {
      accessTokenCookie: options.accessTokenCookie || "appAccessToken",
      refreshTokenCookie: options.refreshTokenCookie || "appRefreshToken",
    };

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve("./runtime/plugin.js"));
  },
});
