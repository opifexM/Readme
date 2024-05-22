FROM node:22.1-slim
RUN apt-get update && apt-get install -y openssl libssl-dev

WORKDIR /opt/readme/content-management

COPY ./dist/apps/content-management/package.json .
RUN npm install --omit=dev

COPY ./dist/apps/content-management/assets/prisma/schema.prisma ./schema.prisma
RUN npx prisma generate --schema schema.prisma
RUN cp -R ../../../../../node_modules/.prisma ./node_modules && rm -rf ../../../../node_modules

COPY ./dist/apps/content-management .
CMD ["node", "./main.js"]
