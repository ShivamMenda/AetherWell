# Use an official Node.js runtime as the base image
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . ./

# Expose a port (if your application listens on a specific port)
EXPOSE 8080

# Define the command to run your application
CMD [ "npm", "run", "dev" ]