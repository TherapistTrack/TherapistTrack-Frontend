<h1 align="center">📦 Therapist Track</h1>
<h3 align="center"> Frontend </h3>

The frontend client for Therapist Track App.

## Environment variables
This are the environment variables required for building the project

```sh
FRONTEND_PORT=3000
VITE_BACKEND_URI=http://localhost:3001
VITE_BASE=/
VITE_TEST_PORT=3000

# OAUTH

VITE_OAUTH_DOMAIN=<secret>
VITE_OAUTH_CLIENT_ID=<secret>
VITE_OAUTH_REDIRECT_URI=http://localhost:3000/callback
VITE_OAUTH_LOGOUT_URI=http://localhost:3000

# Allow free navigation withouth token authentication
VITE_FREE_NAVIGATION=TRUE # (TRUE, FALSE)
```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```