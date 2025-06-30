FROM node:14.16.0

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

RUN npm run-script build

CMD ["npm", "start"]
