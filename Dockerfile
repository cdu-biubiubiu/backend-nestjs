
FROM node:alpine as build
WORKDIR /build
COPY package.json .
RUN yarn config set registry https://registry.npm.taobao.org/
RUN yarn
COPY . .
RUN yarn build

FROM node:alpine as pord
WORKDIR /prod
COPY --from=0 /build/package.json .
RUN yarn config set registry https://registry.npm.taobao.org/
RUN yarn --prod
COPY --from=0 /build/dist ./dist
EXPOSE 3000
CMD MONGO_HOST=mongodb yarn start:prod
