FROM node:22.1-alpine3.19
WORKDIR /opt/readme/api

COPY ./dist/apps/api/package.json .
RUN npm install --omit=dev

COPY ./dist/apps/api .
CMD ["node", "./main.js"]
