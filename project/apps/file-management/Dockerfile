FROM node:22.1-alpine3.19
WORKDIR /opt/readme/file-management

COPY ./dist/apps/file-management/package.json .
RUN npm install --omit=dev

COPY ./dist/apps/file-management .
CMD ["node", "./main.js"]
