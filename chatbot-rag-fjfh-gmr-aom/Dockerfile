FROM node:18

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos package.json y package-lock.json primero
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos TODO el proyecto
COPY . .

# Exponemos el puerto de tu backend
EXPOSE 3000

# Arranque del servidor
CMD ["node", "backend/server.js"]
