# Nuxt 4 HTTP

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

> A powerful HTTP client module for Nuxt 4 with built-in authentication, retry logic, and JWT token management.

## Features

- 🚀 **Built for Nuxt 4** - Optimized for the latest Nuxt framework
- 🔐 **JWT Authentication** - Automatic token handling with access and refresh tokens
- 🔄 **Retry Logic** - Intelligent retry mechanism for failed requests
- 🍪 **Cookie Management** - Seamless token storage in cookies
- 🛡️ **Auto Redirect** - Automatic redirection to login on authentication failure
- 📦 **TypeScript Support** - Full type safety out of the box
- 🎯 **Simple API** - Easy-to-use HTTP methods (GET, POST, PUT, DELETE, PATCH)
- ⚡ **Performance Optimized** - Built with modern JavaScript and efficient error handling

## Quick Setup

1. Add `nuxt-http` dependency to your project

```bash
# Using npm
npm install nuxt-http

# Using yarn
yarn add nuxt-http

# Using pnpm
pnpm add nuxt-http
```

2. Add `nuxt-http` to the `modules` section of `nuxt.config.ts`

```ts
export default defineNuxtConfig({
  modules: ["nuxt-http"],
  http: {
    apiUrl: "https://api.example.com", // Required: Your API base URL
    accessTokenCookie: "accessToken", // Optional: Access token cookie name
    refreshTokenCookie: "refreshToken", // Optional: Refresh token cookie name
    loginPath: "/login", // Optional: Login redirect path
  },
});
```

That's it! You can now use `$http` in your Nuxt app ✨

## Configuration

### Module Options

| Option               | Type     | Default             | Description                                      |
| -------------------- | -------- | ------------------- | ------------------------------------------------ |
| `apiUrl`             | `string` | **Required**        | Base URL for your API endpoints                  |
| `accessTokenCookie`  | `string` | `'appAccessToken'`  | Name of the cookie storing the access token      |
| `refreshTokenCookie` | `string` | `'appRefreshToken'` | Name of the cookie storing the refresh token     |
| `loginPath`          | `string` | `'/login'`          | Path to redirect users when authentication fails |

### Example Configuration

```ts
export default defineNuxtConfig({
  modules: ["nuxt-http"],
  http: {
    apiUrl: "https://api.myapp.com",
    accessTokenCookie: "myapp_access_token",
    refreshTokenCookie: "myapp_refresh_token",
    loginPath: "/auth/login",
  },
});
```

## Usage

### Basic HTTP Methods

The module provides a simple and intuitive API for making HTTP requests:

```vue
<template>
  <div>
    <h1>{{ user.name }}</h1>
    <button @click="updateProfile">Update Profile</button>
  </div>
</template>

<script setup>
// GET request
const { data: user } = await $http.get("/user/profile");

// POST request
const createUser = async () => {
  const newUser = await $http.post("/users", {
    name: "John Doe",
    email: "john@example.com",
  });
};

// PUT request
const updateProfile = async () => {
  await $http.put("/user/profile", {
    name: "Jane Doe",
  });
};

// DELETE request
const deleteUser = async (id) => {
  await $http.delete(`/users/${id}`);
};

// PATCH request
const partialUpdate = async () => {
  await $http.patch("/user/profile", {
    email: "newemail@example.com",
  });
};
</script>
```

### Custom Headers

You can pass custom headers with any request:

```js
// With custom headers
const data = await $http.get("/protected-route", {
  "X-Custom-Header": "value",
  "Content-Type": "application/json",
});

// POST with custom headers
const result = await $http.post("/api/data", payload, {
  "X-API-Key": "your-api-key",
});
```

### User Data from JWT

Access decoded JWT token data easily:

```vue
<script setup>
const userData = await $http.user.data();

if (userData) {
  console.log("User ID:", userData.sub);
  console.log("User Email:", userData.email);
  console.log("Token Expiry:", userData.exp);
}
</script>
```

### Authentication Flow

The module automatically handles authentication:

1. **Token Inclusion**: Access tokens are automatically included in request headers
2. **Auto Redirect**: Users are redirected to login when authentication fails
3. **JWT Decoding**: User data is extracted from JWT tokens
4. **Cookie Management**: Tokens are stored and retrieved from cookies

```vue
<script setup>
// Check if user is authenticated
const userData = await $http.user.data();

if (!userData) {
  // User will be automatically redirected to login
  console.log("User not authenticated");
} else {
  // User is authenticated, proceed with app logic
  console.log("Welcome,", userData.name);
}
</script>
```

## Advanced Features

### Retry Logic

The module includes intelligent retry logic:

- **Maximum Retries**: 3 attempts by default
- **Smart Retrying**: Only retries on network errors and server errors (5xx)
- **Non-Retryable**: Skips retry for client errors (400, 404)

### URL Handling

- **Absolute URLs**: Full URLs are used as-is
- **Relative URLs**: Automatically prefixed with the configured `apiUrl`
- **Flexible**: Supports both internal API calls and external service requests

```js
// Relative URL (uses configured apiUrl)
await $http.get("/users");
// Results in: https://api.example.com/users

// Absolute URL (used as-is)
await $http.get("https://external-api.com/data");
// Results in: https://external-api.com/data
```

## TypeScript Support

The module is fully typed with TypeScript:

```ts
interface ModuleOptions {
  apiUrl: string;
  accessTokenCookie?: string;
  refreshTokenCookie?: string;
  loginPath?: string;
}

// Usage in nuxt.config.ts
export default defineNuxtConfig({
  modules: ["nuxt-http"],
  http: {
    apiUrl: "https://api.example.com", // Type-safe configuration
    accessTokenCookie: "myAccessToken",
    refreshTokenCookie: "myRefreshToken",
    loginPath: "/login",
  } satisfies ModuleOptions,
});
```

## Error Handling

The module provides robust error handling:

```vue
<script setup>
try {
  const data = await $http.get("/api/data");
  // Handle successful response
} catch (error) {
  // Handle network errors, server errors, etc.
  console.error("Request failed:", error);
}

// The module also handles authentication errors automatically
// by redirecting to the login page when needed
</script>
```

## Development

### Setup Development Environment

```bash
# Install dependencies
pnpm install

# Generate type stubs
pnpm run dev:prepare

# Develop with the playground
pnpm run dev

# Build the module
pnpm run prepack

# Run tests
pnpm run test

# Run linting
pnpm run lint
```

### Testing

```bash
# Run tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run type checking
pnpm run test:types
```

## Contributing

1. Clone this repository
2. Install dependencies using `pnpm install`
3. Run `pnpm run dev:prepare` to generate type stubs
4. Use `pnpm run dev` to start the development server
5. Make your changes
6. Run `pnpm run test` to ensure tests pass
7. Submit a pull request

## License

[MIT License](./LICENSE)

## Credits

- Built with [Nuxt Module Builder](https://github.com/nuxt/module-builder)
- Powered by [Nuxt 4](https://nuxt.com)
- JWT decoding by [jwt-decode](https://github.com/auth0/jwt-decode)

---

Made with ❤️ for the Nuxt community

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/nuxt-http/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/nuxt-http
[npm-downloads-src]: https://img.shields.io/npm/dm/nuxt-http.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/nuxt-http
[license-src]: https://img.shields.io/npm/l/nuxt-http.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/nuxt-http
[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
