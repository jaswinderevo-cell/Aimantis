# Step 1: Build the React app
FROM node:20 AS build

# Set working directory
WORKDIR /frontend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Step 2: Serve the build folder with Nginx
FROM nginx:stable-alpine

# Copy built app to Nginx's html folder
COPY --from=build /frontend/dist /usr/share/nginx/html

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
