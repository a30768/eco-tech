FROM node:16

# Define o diretório de trabalho no container
WORKDIR /app

# Copia os arquivos necessários para o container
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Expõe a porta onde o serviço será executado
EXPOSE 3000

# Comando para iniciar o serviço
CMD ["npm", "start"]
