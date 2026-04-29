FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app /app
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["npm", "run", "start"]