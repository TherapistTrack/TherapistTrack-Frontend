import { createAuth0 } from '@auth0/auth0-vue'

console.log('OAUTH_DOMAIN:' + import.meta.env.VITE_OAUTH_DOMAIN)
console.log('CLIENT ID:' + import.meta.env.VITE_OAUTH_CLIENT_ID)
console.log('REDIRECT URI:' + import.meta.env.VITE_OAUTH_REDIRECT_URI)
console.log('AUDIENCE:' + import.meta.env.VITE_OAUTH_AUDIENCE)

export const authClient = createAuth0({
  domain: import.meta.env.VITE_OAUTH_DOMAIN,
  clientId: import.meta.env.VITE_OAUTH_CLIENT_ID,
  authorizationParams: {
    redirect_uri: import.meta.env.VITE_OAUTH_REDIRECT_URI,
    audience: import.meta.env.VITE_OAUTH_AUDIENCE
    // scope: "openid profile email offline_access",
  },
  cacheLocation: 'localstorage',
  useRefreshTokens: true
})

// eslint-disable-next-line no-unused-vars
export async function routeGuard(to, from) {
  // If the user is authenticated, continue with the route

  const { isAuthenticated, isLoading } = authClient

  while (isLoading.value) {
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  // console.log("is Authenticated:", isAuthenticated.value)

  if (!isAuthenticated.value && to.path !== '/') {
    return { path: '/' }
  }
}
