FROM node:22.4.1 AS base
#USER app
WORKDIR /app
EXPOSE 3000
EXPOSE 8000
COPY . .
RUN npm install
RUN npm run build
ENTRYPOINT ["npm","start"]
#RUN cd /app
