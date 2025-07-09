FROM node:22 AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:22
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

COPY --from=frontend /app/frontend/dist ./public
EXPOSE 3000
CMD ["node", "index.js"]