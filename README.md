# Cadastro de Operadores

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Sistema de visualização e pesquisa de operadores com interface moderna e responsiva.

## Funcionalidades

- **Visualização de operadores**: Interface tabulada com dados organizados
- **Paginação avançada**: Navegação intuitiva entre registros
- **Ordenação flexível**: Organização dos dados por qualquer coluna
- **Pesquisa eficiente**: Filtragem rápida por termos de busca
- **Design responsivo**: Adaptação automática a qualquer dispositivo
- **Tratamento de erros**: Mensagens amigáveis em português para erros de rede e API

## Tecnologias

- **Vue 3**: Framework progressivo para construção de interfaces
- **TypeScript**: Tipagem estática para maior confiabilidade
- **Tailwind CSS**: Framework CSS utilitário para estilização eficiente
- **Vite**: Build tool rápida para desenvolvimento moderno
- **Headless UI**: Componentes acessíveis sem estilos predefinidos
- **TanStack Table**: Biblioteca poderosa para controle de tabelas
- **Docker**: Containerização para implantação consistente

## Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn
- Docker (opcional, para execução em container)

## Instalação

```bash
# Clone o repositório
git clone [url-do-repositorio]
cd intuitive-care

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

## Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev
```

## Build para produção

```bash
# Compile e minifique para produção
npm run build

# Visualize a build
npm run preview
```

## Execução com Docker

Para instruções detalhadas sobre a execução com Docker, consulte o arquivo [DOCKER.md](./DOCKER.md).

Resumidamente:

```bash
# Método 1: Usando o script de automatização
chmod +x docker-build.sh
./docker-build.sh

# Método 2: Usando npm scripts
npm run docker:build  # Para construir a imagem
npm run docker:run    # Para executar o container
npm run docker        # Para fazer ambos
```

## Estrutura do Projeto

```
intuitive-care/
├── src/
│   ├── app/               # Lógica da aplicação
│   │   ├── composables/   # Composables Vue reutilizáveis
│   │   ├── config/        # Configurações
│   │   ├── types/         # Tipos e interfaces TypeScript
│   │   └── utils/         # Utilitários
│   ├── components/        # Componentes Vue
│   │   ├── data-table/    # Componentes da tabela de dados
│   │   └── ui/            # Componentes de UI reutilizáveis
│   └── lib/               # Bibliotecas e integrações
├── public/                # Arquivos públicos
├── dist/                  # Build de produção gerada pelo Vite
├── Dockerfile             # Configuração para build do container
├── nginx.conf             # Configuração do Nginx para servir a aplicação
├── docker-build.sh        # Script para automatizar build do container
└── ...
```

## Documentação

- [DEPLOY.md](./DEPLOY.md) - Instruções detalhadas para deploy em produção
- [DOCKER.md](./DOCKER.md) - Guia para utilização com Docker

## Contribuição

1. Faça um fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add some amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## Contato

Kleber Rhuan - [GitHub](https://github.com/seuusuario)
