# Etapa de build (para compilar a app)
FROM node:20-alpine AS builder

WORKDIR /employees

# Copia package.json e instala dependências
COPY package*.json ./
RUN npm install

# Copia o código fonte e constrói a app
COPY . .
RUN npm run build

# Etapa de produção (imagem leve)
FROM node:20-alpine

WORKDIR /employees

# Copia dependências de produção
COPY --from=builder /employees/node_modules ./node_modules
COPY --from=builder /employees/dist ./dist

# Expõe a porta (ajuste se sua app usa outra, ex: 3000)
EXPOSE 3000

# Comando para rodar a app
CMD ["npm", "run", "start:dev"]
# CMD ["node", "dist/main.js"]