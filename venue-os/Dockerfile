FROM nginx:alpine
# Copy the built assets from the local dist folder
COPY dist /usr/share/nginx/html
# Copy our custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Cloud Run expects the container to listen on 8080 by default
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
