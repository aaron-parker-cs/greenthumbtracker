# Use Node.js runtime as parent image
FROM node:22

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

# For dedicated production server:
# 1) FROM nginx:stable-alpine
# 2) Copy the build output to /usr/share/nginx/html

EXPOSE 5173
CMD ["npm", "start", "--host"]