# Utilizando Docker com o Sistema de Cadastro de Operadores

Este guia rápido explica como utilizar Docker para construir e executar a aplicação.

## Pré-requisitos

- Docker instalado (versão 20.10.0 ou superior)

## Arquivos de configuração Docker

O projeto inclui os seguintes arquivos para configuração Docker:

- **Dockerfile**: Configuração principal com multi-stage build
- **nginx.conf**: Configuração do Nginx otimizada para SPA
- **.dockerignore**: Lista de arquivos que não serão incluídos na imagem
- **docker-build.sh**: Script para automatizar o build e execução

## Formas de executar a aplicação com Docker

### 1. Utilizando o script automatizado

O modo mais simples é executar o script `docker-build.sh`:

```bash
# Tornar o script executável
chmod +x docker-build.sh

# Executar o script
./docker-build.sh
```

O script irá guiá-lo no processo de build e execução.

### 2. Utilizando os comandos npm

Foram adicionados scripts no package.json para facilitar o uso do Docker:

```bash
# Construir a imagem
npm run docker:build

# Executar o container
npm run docker:run

# Ou fazer ambos com um único comando
npm run docker
```

### 3. Utilizando comandos Docker diretamente

```bash
# Construir a imagem
docker build -t intuitive-care:latest .

# Executar o container
docker run -d -p 8080:80 --name intuitive-care intuitive-care:latest
```

## Acessando a aplicação

Após iniciar o container, a aplicação estará disponível em:

http://localhost:8080

## Configurando variáveis de ambiente

As variáveis de ambiente são definidas no Dockerfile:

```dockerfile
# Definir variáveis de ambiente de build
ENV VITE_API_URL=http://api.example.com
ENV VITE_API_TIMEOUT=30000
```

Para modificar estas variáveis:

1. Edite o Dockerfile antes de construir a imagem
2. Reconstrua a imagem com `docker build` ou `npm run docker:build`

## Comandos úteis

### Verificar o status do container

```bash
docker ps -a | grep intuitive-care
```

### Ver os logs do container

```bash
docker logs intuitive-care
```

### Parar o container

```bash
docker stop intuitive-care
```

### Remover o container

```bash
docker rm intuitive-care
```

Para informações mais detalhadas sobre deploy em ambientes de produção, consulte o arquivo [DEPLOY.md](./DEPLOY.md).
