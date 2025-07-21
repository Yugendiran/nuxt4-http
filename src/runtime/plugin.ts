import {
  defineNuxtPlugin,
  useCookie,
  useRuntimeConfig,
  useRouter,
  navigateTo,
} from "#app";

// Types
interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: any;
}

interface HttpHeaders {
  [key: string]: any;
}

interface RequestOptions extends RequestInit {
  method: string;
  headers: Record<string, any>;
}

interface AuthResponse {
  login?: boolean;
  [key: string]: any;
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export default defineNuxtPlugin(async (_nuxtApp) => {
  const config = useRuntimeConfig();
  const nuxtHttpConfig = config.public.nuxtHttp || {};

  const accessTokenName = nuxtHttpConfig.accessTokenCookie || "appAccessToken";
  const refreshTokenName =
    nuxtHttpConfig.refreshTokenCookie || "appRefreshToken";
  const apiUrl = nuxtHttpConfig.apiUrl;
  const loginPath = nuxtHttpConfig?.loginPath || "/login";

  const accessToken = useCookie(accessTokenName);
  const refreshToken = useCookie(refreshTokenName);

  const isUrl = (path: string): boolean => {
    return path.startsWith("http://") || path.startsWith("https://");
  };

  const MAX_RETRIES = 3;
  const NON_RETRYABLE_STATUSES = new Set([400, 404]);

  const fetchWithRetry = async (
    path: string,
    options: RequestInit,
    retries: number = MAX_RETRIES
  ): Promise<Response> => {
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
  };

  // Helper function to normalize headers (case-insensitive)
  const normalizeHeaders = (
    headers: HttpHeaders = {}
  ): Record<string, string> => {
    const normalized: Record<string, string> = {};

    // Copy all existing headers
    Object.entries(headers).forEach(([key, value]) => {
      if (value !== undefined) {
        normalized[key] = value;
      }
    });

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
    } else if (accessToken.value) {
      normalized["Authorization"] = `Bearer ${accessToken.value}`;
    }

    return normalized;
  };

  // Helper function to handle authentication redirects
  const handleAuthRedirect = (data: AuthResponse): void => {
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
  const makeRequest = async (
    method: HttpMethod,
    path: string,
    body: any = null,
    headers: HttpHeaders = {}
  ): Promise<any> => {
    const options: RequestInit = {
      method: method.toUpperCase(),
      headers: normalizeHeaders(headers),
    };

    // Add body for methods that support it
    if (body && ["POST", "PUT", "PATCH", "DELETE"].includes(options.method!)) {
      options.body = JSON.stringify(body);
    }

    const url = `${isUrl(path) ? "" : apiUrl}${path}`;
    const res = await fetchWithRetry(url, options);

    let data: any;
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
    get: (path: string, headers?: HttpHeaders) =>
      makeRequest("GET", path, null, headers),
    post: (path: string, body?: any, headers?: HttpHeaders) =>
      makeRequest("POST", path, body, headers),
    put: (path: string, body?: any, headers?: HttpHeaders) =>
      makeRequest("PUT", path, body, headers),
    delete: (path: string, body?: any, headers?: HttpHeaders) =>
      makeRequest("DELETE", path, body, headers),
    patch: (path: string, body?: any, headers?: HttpHeaders) =>
      makeRequest("PATCH", path, body, headers),
  };

  const http = {
    ...api,
  };

  return {
    provide: {
      http,
    },
  };
});
