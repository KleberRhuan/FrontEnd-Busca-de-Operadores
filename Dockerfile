# Estágio de build - Usamos Node para construir o app
FROM node:20-alpine as build-stage

WORKDIR /app

# Copiar package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar o código fonte
COPY . .

# Definir variáveis de ambiente de build
ENV VITE_API_URL=http://api.example.com
ENV VITE_API_TIMEOUT=30000

# Construir aplicação
RUN npm run build

# Estágio de produção - Usamos Nginx para servir os arquivos estáticos
FROM nginx:stable-alpine as production-stage

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
LABEL description="Imagem Docker para o Sistema de Cadastro de Operadores" 