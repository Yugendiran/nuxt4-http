import { defineNuxtPlugin } from "#app";
import { jwtDecode } from "jwt-decode";

const MAX_RETRIES = 3;
const NON_RETRYABLE_STATUSES = new Set([400, 404]);

async function fetchWithRetry(path, options, retries = MAX_RETRIES) {
  try {
    const res = await fetch(path, options);
    // Only retry if status code is not ok and not in non-retryable statuses
    if (!res.ok && !NON_RETRYABLE_STATUSES.has(res.status) && retries > 0) {
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
  const loginPath = nuxt4HttpConfig?.loginPath || "/login";

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

  // Helper function to normalize headers (case-insensitive)
  const normalizeHeaders = (headers = {}) => {
    const normalized = { ...headers };

    // Normalize Content-Type
    const contentType =
      headers.contentType || headers["Content-Type"] || headers["content-type"];
    if (contentType) {
      normalized["Content-Type"] = contentType;
      delete normalized.contentType;
      delete normalized["content-type"];
    } else {
      normalized["Content-Type"] = "application/json";
    }

    // Normalize Authorization
    const authorization =
      headers.authorization ||
      headers.Authorization ||
      headers["authorization"] ||
      headers["Authorization"];
    if (authorization) {
      normalized["Authorization"] = authorization;
      delete normalized.authorization;
      delete normalized["Authorization"];
    } else if (accessToken.value) {
      normalized["Authorization"] = `Bearer ${accessToken.value}`;
    }

    return normalized;
  };

  // Helper function to handle authentication redirects
  const handleAuthRedirect = (data) => {
    if (data.login === false) {
      if (refreshToken.value) {
        // If we have a refresh token, we might want to handle token refresh logic here
        // For now, just redirect to login if no refresh token is available

        console.warn("User is not authenticated, redirecting to login.");
      } else {
        useRouter().push(loginPath);
      }
    }
  };

  // Generic request handler
  const makeRequest = async (method, path, body = null, headers = {}) => {
    const options = {
      method: method.toUpperCase(),
      headers: normalizeHeaders(headers),
    };

    // Add body for methods that support it
    if (body && ["POST", "PUT", "PATCH", "DELETE"].includes(options.method)) {
      options.body = JSON.stringify(body);
    }

    const url = `${isUrl(path) ? "" : apiUrl}${path}`;
    const res = await fetchWithRetry(url, options);

    let data;
    try {
      data = await res.json();
    } catch {
      // Handle non-JSON responses
      data = await res.text();
    }

    handleAuthRedirect(data);
    return data;
  };

  const api = {
    get: (path, headers) => makeRequest("GET", path, null, headers),
    post: (path, body, headers) => makeRequest("POST", path, body, headers),
    put: (path, body, headers) => makeRequest("PUT", path, body, headers),
    delete: (path, body, headers) => makeRequest("DELETE", path, body, headers),
    patch: (path, body, headers) => makeRequest("PATCH", path, body, headers),
  };

  const http = {
    user: {
      data: async () => {
        const token = accessToken.value || refreshToken.value;

        if (!token) {
          useRouter().push(loginPath);
          return null;
        }

        try {
          return jwtDecode(token);
        } catch (error) {
          console.error("Failed to decode JWT token:", error);
          useRouter().push(loginPath);
          return null;
        }
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
