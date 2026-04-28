FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# ✅ Fixed: React CRA uses "start", not "dev"
ENV HOST=0.0.0.0
ENV CHOKIDAR_USEPOLLING=true

CMD ["npm", "start"]
