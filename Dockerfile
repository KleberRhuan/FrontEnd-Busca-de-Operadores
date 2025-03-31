# Estágio de build - Usamos Node para construir o app
FROM node:20-alpine AS build-stage

WORKDIR /app

# Definir argumentos de build com valores padrão
ARG VITE_API_URL=http://localhost:8080
ARG VITE_API_TIMEOUT=10000

# Copiar package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar o código fonte
COPY . .

# Definir variáveis de ambiente de build a partir dos argumentos
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_API_TIMEOUT=${VITE_API_TIMEOUT}

# Construir aplicação
RUN npm run build

# Estágio de produção - Usamos Nginx para servir os arquivos estáticos
FROM nginx:stable-alpine AS production-stage

# Copiar a configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar os arquivos buildados
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expor porta 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]

# Metadados da imagem
LABEL maintainer="Kleber Rhuan"
LABEL version="1.0"
LABEL description="Imagem Docker FrontEnd para o Sistema de Cadastro de Operadores"