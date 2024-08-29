# Stage 1: Build Image
FROM node:22.3.0 as build

# Define build arguments
ARG VITE_BACKEND_URI
ARG VITE_BASE
ARG VITE_TEST_PORT
ARG VITE_OAUTH_DOMAIN
ARG VITE_OAUTH_CLIENT_ID
ARG VITE_OAUTH_REDIRECT_URI
ARG VITE_OAUTH_LOGOUT_URI
ARG VITE_FREE_NAVIGATION

WORKDIR /web
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

# Make the script executable
RUN chmod +x /web/gen_env.sh

# Execute the script to generate the .env file
RUN /web/gen_env.sh

RUN npm run build

# For testing purposes
# CMD ["tail", "-F", "anything"]

# Use the official Nginx image from the Docker Hub
FROM nginx:latest

WORKDIR /

COPY gen_nginx_conf.sh /gen_nginx_conf.sh

# Copy your static website files
COPY --from=build /web/dist/ /usr/share/nginx/html
#RUN ls -la /user/share/nginx/html

# Make the script executable
RUN chmod +x /gen_nginx_conf.sh

# Set the entrypoint to the script, which will then run Nginx
ENTRYPOINT ["/gen_nginx_conf.sh"]

CMD ["nginx", "-g", "daemon off;"]

# Expose port 80
EXPOSE 80
