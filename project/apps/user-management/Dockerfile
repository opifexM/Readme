FROM node:22.1-alpine3.19
WORKDIR /opt/readme/user-management

COPY ./dist/apps/user-management/package.json .
RUN npm install --omit=dev

COPY ./dist/apps/user-management .
CMD ["node", "./main.js"]
