# Specify a base image
FROM node:14

# Create an app directory in the Docker image
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source inside Docker image
COPY . .

# Expose the port that your app runs on
EXPOSE 3005

# Define the command to run your app
CMD [ "node", "server3.js" ]
