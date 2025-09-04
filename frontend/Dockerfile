# Use official Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install all dependencies (including vite)
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose Vite default dev server port
EXPOSE 5173

# Start Vite dev server automatically
CMD ["npm", "run", "dev"]
