FROM node:22.1-alpine3.19
WORKDIR /opt/readme/notification-management

COPY ./dist/apps/notification-management/package.json .
RUN npm install --omit=dev

COPY ./dist/apps/notification-management .
CMD ["node", "./main.js"]
