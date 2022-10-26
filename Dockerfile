FROM node:16

#App dir
WORKDIR /usr/src/app

#Package install
COPY /src/package*.json ./
RUN npm install

#Copy all files to image
COPY . .

#TODO: Find way to take PORT enviroment variable instead of hard coding
EXPOSE 8080
CMD ["node", "/src/index.js"]

