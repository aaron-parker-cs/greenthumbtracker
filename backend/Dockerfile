# Use official Node.js runtime as the base image
FROM node:22

# Create app directory inside container
WORKDIR /usr/src/app

# Copy package.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy local files to app directory
COPY . .

# Build production build
RUN npm run build

# Expose port 8800
EXPOSE 8800

# Start the app
CMD ["npm", "run", "start:prod"]