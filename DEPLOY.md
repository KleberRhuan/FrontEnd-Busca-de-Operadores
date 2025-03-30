# Instruções de Deploy - Sistema de Cadastro de Operadores

Este documento fornece instruções para o deploy da aplicação utilizando Docker.

## Pré-requisitos

- Docker instalado (versão 20.10.0 ou superior)
- Docker Compose (opcional, para ambientes de desenvolvimento)
- Acesso a um registro Docker (opcional, para ambientes de produção)

## Configuração Docker

O projeto inclui uma configuração Docker completa:

- **Dockerfile**: Build multi-estágio que utiliza Node.js para compilar a aplicação e Nginx para servir os arquivos estáticos
- **nginx.conf**: Configuração otimizada do Nginx para Single Page Applications (SPA)
- **.dockerignore**: Exclusão de arquivos desnecessários na imagem
- **docker-build.sh**: Script para automatizar o processo de build e execução

## Construindo a Imagem Docker

### Método 1: Usando o Script Automatizado

```bash
chmod +x docker-build.sh
./docker-build.sh
```

O script irá:

1. Construir a imagem com o nome `intuitive-care:latest`
2. Perguntar se deseja executar o container
3. Se sim, removerá qualquer container existente com o mesmo nome
4. Iniciará o container mapeando a porta 8080 para a porta 80 do container

### Método 2: Build Manual

```bash
# Na raiz do projeto
docker build -t intuitive-care:latest .

# Executar o container
docker run -d -p 8080:80 --name intuitive-care intuitive-care:latest
```

### Método 3: Utilizando um Registro Docker

```bash
# Build com tag do registro
docker build -t seu-registro.com/intuitive-care:latest .

# Push para o registro
docker push seu-registro.com/intuitive-care:latest
```

## Configuração de Variáveis de Ambiente

As variáveis de ambiente podem ser configuradas diretamente no Dockerfile:

```dockerfile
# Definir variáveis de ambiente de build
ENV VITE_API_URL=http://api.example.com
ENV VITE_API_TIMEOUT=30000
```

Modifique estes valores de acordo com suas necessidades antes de construir a imagem.

## Deploy em Ambiente de Produção

### Deploy com Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    image: intuitive-care:latest
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - VITE_API_URL=https://api.seudominio.com
        - VITE_API_TIMEOUT=30000
    ports:
      - '80:80'
    restart: always
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

Execute com:

```bash
docker-compose up -d
```

### Deploy em Kubernetes

```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: intuitive-care
spec:
  replicas: 3
  selector:
    matchLabels:
      app: intuitive-care
  template:
    metadata:
      labels:
        app: intuitive-care
    spec:
      containers:
        - name: intuitive-care
          image: seu-registro.com/intuitive-care:latest
          ports:
            - containerPort: 80
          resources:
            limits:
              cpu: '0.5'
              memory: '512Mi'
            requests:
              cpu: '0.2'
              memory: '256Mi'
---
apiVersion: v1
kind: Service
metadata:
  name: intuitive-care-service
spec:
  selector:
    app: intuitive-care
  ports:
    - port: 80
      targetPort: 80
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: intuitive-care-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: cadastro.seudominio.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: intuitive-care-service
                port:
                  number: 80
```

Deploy no Kubernetes:

```bash
kubectl apply -f k8s-deployment.yaml
```

## Configuração do Nginx

O arquivo `nginx.conf` incluído no projeto está otimizado para aplicações SPA com:

- Redirecionamento correto para index.html (necessário para rotas de SPA)
- Cache eficiente para recursos estáticos (JS, CSS, imagens)
- Configuração opcional para proxy reverso da API (comentada por padrão)

Caso necessite personalizar essa configuração:

1. Edite o arquivo `nginx.conf`
2. Reconstrua a imagem Docker

## Monitoramento

Para monitorar o container:

```bash
# Verificar status do container
docker ps -a | grep intuitive-care

# Verificar logs
docker logs intuitive-care

# Acessar o container
docker exec -it intuitive-care sh
```

## Troubleshooting

### Problemas Comuns

1. **Container não inicia**:

   ```bash
   docker logs intuitive-care
   ```

2. **Problemas de conexão com o backend**:

   - Verifique se a URL da API está correta nas variáveis de ambiente
   - Verifique se a API está acessível do container
   - Teste a conectividade:

     ```bash
     docker exec intuitive-care wget -O- http://api.example.com
     ```

3. **Problemas de CORS**:

   - Certifique-se que o backend está configurado para aceitar requisições do frontend

4. **Problemas com rotas do SPA**:
   - Confirme que a configuração do Nginx está corretamente redirecionando as rotas para index.html

## Backup e Restauração

Como este é um frontend estático, o backup consiste em salvar a imagem Docker:

```bash
# Salvar imagem
docker save -o intuitive-care-backup.tar intuitive-care:latest

# Restaurar imagem
docker load -i intuitive-care-backup.tar
```
