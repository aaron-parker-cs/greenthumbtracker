# -----------------------
# 1) Build Stage
# -----------------------
    FROM node:22 AS build

    WORKDIR /usr/src/app
    
    # Copy package.json and package-lock.json (or yarn.lock)
    COPY package*.json ./
    
    RUN npm ci
    
    # Copy the rest of your source code
    COPY . .
    
    # Run your build (output goes to /usr/src/app/build or /usr/src/app/dist)
    RUN npm run build
    
    # -----------------------
    # 2) Production Stage
    # -----------------------
    FROM nginx:alpine
    
    # Remove default config 
    RUN rm /etc/nginx/conf.d/default.conf
    
    # Copy custom Nginx config
    COPY nginx.conf /etc/nginx/conf.d
    
    # Copy the build output from the build stage to the Nginx html directory
    COPY --from=build /usr/src/app/build /usr/share/nginx/html
    
    EXPOSE 80
    EXPOSE 443
    
    # Run nginx in the foreground
    CMD ["nginx", "-g", "daemon off;"]
    