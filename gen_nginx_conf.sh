#!/bin/bash

# Generate the default.conf file with environment variables
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

# Execute the original command
exec "$@"
