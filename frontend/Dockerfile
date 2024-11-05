FROM node:20-slim

WORKDIR /app

# Install necessary tools for development
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 3099

# Start the application
CMD ["npm", "run", "dev"]
