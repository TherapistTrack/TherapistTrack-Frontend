# Stage 1: Build Image
FROM node:22.3.0 as build

WORKDIR /web
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN npm run build

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
