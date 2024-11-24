FROM node:16-alpine

WORKDIR users-management/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3001
CMD ["node", "app.js"]