# Use Node.js image
FROM node:20

# Set work directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy project files
COPY . .

# Expose port
EXPOSE 3000

# Start React dev server
CMD ["npm", "start"]
