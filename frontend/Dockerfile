# Use Node.js runtime as parent image
FROM node:22 AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json
COPY package*.json ./

# Install dependencies
RUN npm ci 

# Copy local files to app directory
COPY . .


# Build production build
RUN npm run build

# Build the reverse proxy for the frontend
FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d

# Copy the build output to the nginx html directory
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose port 80 and 443
EXPOSE 80
EXPOSE 443

CMD ["npm", "start", "--host"]