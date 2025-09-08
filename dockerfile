FROM node:20 AS build
ARG BUILD_ENV=production
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN if [ "$BUILD_ENV" = "development" ]; then npm run build:dev; else npm run build; fi

FROM nginx:stable
COPY --from=build /app/dist/leadweb/browser /usr/share/nginx/html
COPY nginx-angular.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
