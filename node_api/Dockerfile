# Use a base image with Node.js installed
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the Node.js application files to the container
COPY package*.json /.
# Add other necessary files if required

# Install dependencies
RUN npm install

# Expose the port on which the Node.js app runs

COPY . .

EXPOSE 3000

# Define the command to run your Node.js app
CMD ["npm", "start"]