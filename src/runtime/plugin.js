import { defineNuxtPlugin } from "#app";
import { jwtDecode } from "jwt-decode";

const MAX_RETRIES = 3;

async function fetchWithRetry(path, options, retries = MAX_RETRIES) {
  try {
    let res = await fetch(path, options);
    // Only retry if status code is not 200 and not 400 and not 404
    if (!res.ok && res.status !== 400 && res.status !== 404 && retries > 0) {
      return await fetchWithRetry(path, options, retries - 1);
    }
    return res;
  } catch (error) {
    if (retries > 0) {
      return await fetchWithRetry(path, options, retries - 1);
    }
    throw error;
  }
}

export default defineNuxtPlugin(async (_nuxtApp) => {
  const config = useRuntimeConfig();
  const nuxt4HttpConfig = config.public.nuxt4Http || {};

  const accessTokenName = nuxt4HttpConfig.accessTokenCookie || "appAccessToken";
  const refreshTokenName =
    nuxt4HttpConfig.refreshTokenCookie || "appRefreshToken";
  const apiUrl = nuxt4HttpConfig.apiUrl;

  const accessToken = useCookie(accessTokenName);
  const refreshToken = useCookie(refreshTokenName);

  const isUrl = (path) => {
    try {
      new URL(path);
      return true;
    } catch {
      return path.startsWith("http://") || path.startsWith("https://");
    }
  };

  const api = {
    get: async (path, headers) => {
      let options = {
        method: "get",
        headers: headers || {},
      };

      if (
        headers &&
        (headers.contentType ||
          headers["Content-Type"] ||
          headers["content-type"])
      ) {
        options.headers["Content-Type"] =
          headers.contentType ||
          headers["Content-Type"] ||
          headers["content-type"];
      } else {
        options.headers["Content-Type"] = "application/json";
      }

      if (accessToken.value) {
        options.headers["Authorization"] = `Bearer ${accessToken.value}`;
      }

      if (
        headers &&
        (headers.authorization ||
          headers.Authorization ||
          headers["authorization"] ||
          headers["Authorization"])
      ) {
        options.headers["Authorization"] =
          headers.Authorization ||
          headers.authorization ||
          headers["Authorization"] ||
          headers["authorization"];
      }

      let res = await fetchWithRetry(
        `${isUrl(path) ? "" : apiUrl}${path}`,
        options
      );

      let data = await res.json();

      if (data.login == false) {
        if (refreshToken.value) {
          // Redirect to sign-in when token refresh is needed but no auth store is available
          useRouter().push(nuxt4HttpConfig?.loginPath || "/login");
        } else {
          useRouter().push(nuxt4HttpConfig?.loginPath || "/login");
        }
      }

      return data;
    },
    post: async (path, body, headers, config) => {
      let options = {
        method: "post",
        headers: headers || {},
        body: JSON.stringify(body),
      };

      if (
        headers &&
        (headers.contentType ||
          headers["Content-Type"] ||
          headers["content-type"])
      ) {
        options.headers["Content-Type"] =
          headers.contentType ||
          headers["Content-Type"] ||
          headers["content-type"];
      } else {
        options.headers["Content-Type"] = "application/json";
      }

      if (accessToken.value) {
        options.headers["Authorization"] = `Bearer ${accessToken.value}`;
      }

      if (
        headers &&
        (headers.authorization ||
          headers.Authorization ||
          headers["authorization"] ||
          headers["Authorization"])
      ) {
        options.headers["Authorization"] =
          headers.Authorization ||
          headers.authorization ||
          headers["Authorization"] ||
          headers["authorization"];
      }

      let res = await fetchWithRetry(
        `${isUrl(path) ? "" : apiUrl}${path}`,
        options
      );

      let data = await res.json();

      if (data.login == false) {
        if (refreshToken.value) {
          // Redirect to sign-in when token refresh is needed but no auth store is available
          if (config && config.disableRedirect) {
          } else {
            useRouter().push(nuxt4HttpConfig?.loginPath || "/login");
          }
        } else {
          if (config && config.disableRedirect) {
          } else {
            useRouter().push(nuxt4HttpConfig?.loginPath || "/login");
          }
        }
      }

      return data;
    },
    put: async (path, body, headers) => {
      let options = {
        method: "put",
        headers: headers || {},
        body: JSON.stringify(body),
      };

      if (
        headers &&
        (headers.contentType ||
          headers["Content-Type"] ||
          headers["content-type"])
      ) {
        options.headers["Content-Type"] =
          headers.contentType ||
          headers["Content-Type"] ||
          headers["content-type"];
      } else {
        options.headers["Content-Type"] = "application/json";
      }

      if (accessToken.value) {
        options.headers["Authorization"] = `Bearer ${accessToken.value}`;
      }

      if (
        headers &&
        (headers.authorization ||
          headers.Authorization ||
          headers["authorization"] ||
          headers["Authorization"])
      ) {
        options.headers["Authorization"] =
          headers.Authorization ||
          headers.authorization ||
          headers["Authorization"] ||
          headers["authorization"];
      }

      let res = await fetchWithRetry(
        `${isUrl(path) ? "" : apiUrl}${path}`,
        options
      );

      let data = await res.json();

      if (data.login == false) {
        if (refreshToken.value) {
          // Redirect to sign-in when token refresh is needed but no auth store is available
          useRouter().push(nuxt4HttpConfig?.loginPath || "/login");
        } else {
          useRouter().push(nuxt4HttpConfig?.loginPath || "/login");
        }
      }

      return data;
    },
    delete: async (path, body, headers) => {
      let options = {
        method: "delete",
        headers: headers || {},
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      if (
        headers &&
        (headers.contentType ||
          headers["Content-Type"] ||
          headers["content-type"])
      ) {
        options.headers["Content-Type"] =
          headers.contentType ||
          headers["Content-Type"] ||
          headers["content-type"];
      } else {
        options.headers["Content-Type"] = "application/json";
      }

      if (accessToken.value) {
        options.headers["Authorization"] = `Bearer ${accessToken.value}`;
      }

      if (
        headers &&
        (headers.authorization ||
          headers.Authorization ||
          headers["authorization"] ||
          headers["Authorization"])
      ) {
        options.headers["Authorization"] =
          headers.Authorization ||
          headers.authorization ||
          headers["Authorization"] ||
          headers["authorization"];
      }

      let res = await fetchWithRetry(
        `${isUrl(path) ? "" : apiUrl}${path}`,
        options
      );

      let data = await res.json();

      if (data.login == false) {
        if (refreshToken.value) {
          // Redirect to sign-in when token refresh is needed but no auth store is available
          useRouter().push(nuxt4HttpConfig?.loginPath || "/login");
        } else {
          useRouter().push(nuxt4HttpConfig?.loginPath || "/login");
        }
      }

      return data;
    },
  };

  const http = {
    user: {
      data: async () => {
        let token;

        if (accessToken.value) {
          token = accessToken.value;
        } else if (refreshToken.value) {
          token = refreshToken.value;
        } else {
          useRouter().push(nuxt4HttpConfig?.loginPath || "/login");
        }

        let decoded = jwtDecode(token);

        return {
          ...decoded,
        };
      },
    },
    ...api,
  };

  return {
    provide: {
      http,
    },
  };
});
