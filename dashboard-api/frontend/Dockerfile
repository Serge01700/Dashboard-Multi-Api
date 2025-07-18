FROM node:20-alpine AS build-stage

# Fix the WORKDIR path (remove space)
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install
RUN npm install vuedraggable@next --save

# Build the app
COPY . .
RUN npm run build

# Production stage
FROM nginx:stable-alpine AS production

# Copy built assets to nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

