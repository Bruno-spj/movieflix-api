
# Define a imagem base
FROM node:20

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência (package.json, etc.)
COPY package.json .

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

# Gera o Prisma Client com binários corretos
RUN npx prisma generate

# Expõe a porta que o servidor usará
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]