# Stage 1: Build the TypeScript code
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Stage 2: Run the compiled JavaScript code
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expose the port that the app runs on
EXPOSE 4000

# Command to run the application
CMD ["node", "dist/server.js"]
