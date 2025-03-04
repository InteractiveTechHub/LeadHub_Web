FROM node:latest AS build
WORKDIR /app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm run build --configuration=production

FROM nginx:alpine
RUN chown -R nginx:nginx /usr/share/nginx/html
COPY --from=build /app/dist/leadweb/browser /usr/share/nginx/html
COPY nginx-angular.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
