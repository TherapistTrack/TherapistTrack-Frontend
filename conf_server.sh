#!/bin/sh

# Generate the environment variables file
cat <<EOF > ./.env
FRONTEND_PORT=${FRONTEND_PORT}
VITE_BACKEND_URI=${VITE_BACKEND_URI}
VITE_BASE=${VITE_BASE}
VITE_TEST_PORT=${VITE_TEST_PORT}

# OAUTH

VITE_OAUTH_DOMAIN=${VITE_OAUTH_DOMAIN}
VITE_OAUTH_CLIENT_ID=${VITE_OAUTH_CLIENT_ID}
VITE_OAUTH_REDIRECT_URI=${VITE_OAUTH_REDIRECT_URI}
VITE_OAUTH_LOGOUT_URI=${VITE_OAUTH_LOGOUT_URI}
VITE_FREE_NAVIGATION=${VITE_FREE_NAVIGATION}
EOF

# Build the project
npm run build

# Copy built files to the Nginx directory
cp -r /web/dist/* /usr/share/nginx/html

# Generate the default.conf NGINX file with environment variables
cat <<EOF > /etc/nginx/conf.d/default.conf
server {
  listen ${FRONTEND_PORT};
  listen [::]:${FRONTEND_PORT};

  root /usr/share/nginx/html;
  index index.html index.htm;

  location / {
    try_files \$uri \$uri/ \$uri.html /index.html =404;
  }

  # Optional: Add logging for easier debugging.
  access_log /var/log/nginx/access.log;
  error_log /var/log/nginx/error.log;
}
EOF

# Start Nginx in the foreground
nginx -g 'daemon off;'