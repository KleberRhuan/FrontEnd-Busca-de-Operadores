#!/bin/bash

# Nome da aplicação/imagem
APP_NAME="intuitive-care"

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Construindo imagem Docker para $APP_NAME...${NC}"
docker build -t $APP_NAME:latest .

echo -e "${GREEN}Build concluído!${NC}"
echo -e "${BLUE}Para executar o container:${NC}"
echo -e "${GREEN}docker run -d -p 8080:80 --name $APP_NAME $APP_NAME:latest${NC}"
echo -e "${BLUE}Aplicação estará disponível em:${NC} http://localhost:8080"

# Perguntar se deseja iniciar o container
read -p "Deseja iniciar o container agora? (s/n): " START_CONTAINER

if [[ $START_CONTAINER == "s" || $START_CONTAINER == "S" ]]; then
  echo -e "${BLUE}Iniciando container...${NC}"
  
  # Verificar se já existe um container com este nome
  if [ "$(docker ps -aq -f name=$APP_NAME)" ]; then
    echo -e "${BLUE}Removendo container existente...${NC}"
    docker rm -f $APP_NAME
  fi
  
  # Iniciar novo container
  docker run -d -p 8080:80 --name $APP_NAME $APP_NAME:latest
  
  echo -e "${GREEN}Container iniciado!${NC}"
  echo -e "${BLUE}Acesse a aplicação em:${NC} http://localhost:8080"
fi 