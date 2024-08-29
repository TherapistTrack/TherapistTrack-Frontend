# Base Image
FROM nginx:1.27.1-alpine

RUN apk add --update nodejs npm

WORKDIR /web

# Copy the application code
COPY package*.json ./
RUN npm install --omit=dev
COPY . .


# Copy Nginx configuration if needed
# RUN chmod ./conf_server.sh /web/conf_server.sh
RUN chmod +x /web/conf_server.sh

# Set the entrypoint to generate the env file and build the project
ENTRYPOINT ["/bin/sh", "-c", "ls -la /web && /web/conf_server.sh"]

# Expose port 80
EXPOSE 80