FROM node:18-alpine AS build

WORKDIR /usr/src/gist_main_service

COPY package.json  ./

RUN npm install --legacy-peer-deps --omit=dev

RUN npm install -g @dolphjs/cli @swc/core @swc/cli && \
    npm cache clean --force && \
    rm -rf /tmp/*

COPY . .

RUN npm run build

# Stage 2

FROM node:18-alpine

WORKDIR /usr/src/gist_main_service

COPY --from=build /usr/src/gist_main_service .

COPY --from=build /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=build /usr/local/bin /usr/local/bin

ENV PATH /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

EXPOSE 4000

CMD [ "npm", "start" ]