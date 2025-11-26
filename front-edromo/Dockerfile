FROM node:22.4.1 AS base
#USER app
WORKDIR /app
EXPOSE 3000
EXPOSE 8000
ENV API_BASE_URL "http://127.0.0.1:8080/api"
#ENV NEXT_PUBLIC_API_BASE_URL "http://34.238.85.28:8080/api"
ENV NEXT_PUBLIC_API_BASE_URL "http://127.0.0.1:8080/api"
ADD . .
RUN npm install
RUN node node_modules/puppeteer/install.mjs
RUN npm run build
ENTRYPOINT ["npm","run","dev"]
#RUN cd /app
