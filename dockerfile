FROM node:latest AS build
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build

FROM nginx:stable
COPY --from=build /app/dist/leadweb/browser /usr/share/nginx/html
COPY nginx-angular.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
