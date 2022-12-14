FROM --platform=linux/amd64 node:16

#App dir
WORKDIR /usr/src/app

#Package install
COPY /src/package*.json ./
RUN npm install

#Copy all files to image
COPY ./src .

#TODO: Find way to take PORT enviroment variable instead of hard coding
EXPOSE 8080
CMD ["node", "index.js"]

