import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImports,
  installModule,
  addRouteMiddleware,
} from "@nuxt/kit";

// Module options TypeScript interface definition
export interface ModuleOptions {
  // required
  apiUrl: string;

  // optional
  accessTokenCookie?: string;
  refreshTokenCookie?: string;
  loginPath?: string;
  middleware?: {
    global?: boolean;
  };
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
    middleware: {
      global: false,
    },
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    // Add the module options to the runtime config
    nuxt.options.runtimeConfig.public.nuxtHttp = {
      accessTokenCookie: options.accessTokenCookie || "appAccessToken",
      refreshTokenCookie: options.refreshTokenCookie || "appRefreshToken",
      apiUrl: options.apiUrl,
      loginPath: options.loginPath || "/login",
      middleware: {
        global: options.middleware?.global || false,
      },
    };

    // Install Pinia module
    installModule("@pinia/nuxt");

    // Add auto-imports for composables
    addImports([
      {
        name: "useAuth",
        from: resolver.resolve("./runtime/composables/useAuth"),
      },
      {
        name: "useAuthStore",
        from: resolver.resolve("./runtime/store/auth"),
      },
    ]);

    // Add middleware to Nuxt using the proper method
    addRouteMiddleware({
      name: "auth",
      path: resolver.resolve("./runtime/middleware/auth"),
      global: options.middleware?.global || false,
    });

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve("./runtime/plugins/http"));
  },
});
