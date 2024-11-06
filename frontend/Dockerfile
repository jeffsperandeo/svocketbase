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

# Expose the port and set host
ENV HOST=0.0.0.0
EXPOSE 3099

# Start the application with host binding
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]