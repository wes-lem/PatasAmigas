# 🐾 Patas Amigas - Sistema de Adoção e Apadrinhamento de Animais

:::info
teste
:::

Sistema completo para conectar abrigos e protetores de animais com pessoas interessadas em adotar ou apadrinhar animais.

## 🚀 Tecnologias Utilizadas

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

## 📸 Screenshots

### Página Inicial
![Página Inicial](home.png)

### Página de Animais
![Página de Animais](animais.png)

### Dashboard do Protetor
![Dashboard do Protetor](protetor.png)

### Backend
- **Node.js** com **NestJS** (TypeScript)
- **Prisma** como ORM
- **MySQL** como banco de dados
- **JWT** para autenticação
- **Multer** para upload de arquivos
- **bcryptjs** para hash de senhas

### Frontend
- **Next.js 14** com **TypeScript**
- **Tailwind CSS** para estilização
- **Axios** para comunicação com API
- **Lucide React** para ícones

## 📁 Estrutura do Projeto

```
PatasAmigasWeb/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── auth/           # Módulo de autenticação
│   │   ├── users/          # Módulo de usuários
│   │   ├── animals/        # Módulo de animais
│   │   ├── solicitacoes/   # Módulo de solicitações
│   │   ├── admin/          # Módulo administrativo
│   │   ├── prisma/         # Configuração do Prisma
│   │   └── upload/         # Serviço de upload
│   ├── prisma/
│   │   └── schema.prisma   # Schema do banco de dados
│   ├── uploads/            # Pasta para imagens
│   └── package.json
├── frontend/               # Aplicação Next.js
│   ├── src/
│   │   ├── app/           # Páginas da aplicação
│   │   ├── components/    # Componentes React
│   │   ├── services/      # Serviços de API
│   │   ├── types/         # Tipos TypeScript
│   │   └── lib/           # Configurações
│   └── package.json
└── README.md
```

## 🛠️ Configuração e Instalação

### Pré-requisitos
- Node.js (versão 18 ou superior)
- MySQL (versão 8.0 ou superior)
- npm ou yarn

### 1. Configuração do Banco de Dados

1. Instale e configure o MySQL
2. Crie um banco de dados chamado `patas_amigas`
3. Configure as credenciais no arquivo `backend/env.example` e renomeie para `.env`:

```env
DATABASE_URL="mysql://root:password@localhost:3306/patas_amigas"
JWT_SECRET="sua-chave-secreta-jwt-aqui"
JWT_EXPIRES_IN="7d"
PORT=3001
```

### 2. Configuração do Backend

```bash
# Navegue para a pasta do backend
cd backend

# Instale as dependências
npm install

# Execute as migrações do Prisma
npx prisma migrate dev --name init

# Gere o cliente Prisma
npx prisma generate

# Inicie o servidor de desenvolvimento
npm run start:dev
```

O backend estará rodando em `http://localhost:3001`

### 3. Configuração do Frontend

```bash
# Navegue para a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Configure a variável de ambiente
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em `http://localhost:3000`

## 📋 Funcionalidades Implementadas

### 🔐 Autenticação e Usuários
- ✅ Cadastro de usuários (Interessado, Protetor, Admin)
- ✅ Login com JWT
- ✅ Proteção de rotas por role
- ✅ Perfil do usuário

### 🐾 Gestão de Animais
- ✅ Cadastro de animais (apenas protetores)
- ✅ Upload de múltiplas fotos
- ✅ Listagem pública de animais disponíveis
- ✅ Detalhes do animal
- ✅ Edição e exclusão (proprietário/admin)

### 📝 Sistema de Solicitações
- ✅ Solicitação de adoção/apadrinhamento
- ✅ Listagem de solicitações por usuário
- ✅ Aprovação/rejeição de solicitações
- ✅ Notificações simuladas (console.log)

### 👨‍💼 Painel Administrativo
- ✅ Dashboard com estatísticas
- ✅ Gestão de usuários
- ✅ Gestão de animais
- ✅ Controle de solicitações

### 🎨 Interface do Usuário
- ✅ Design responsivo com Tailwind CSS
- ✅ Página inicial atrativa
- ✅ Navegação intuitiva
- ✅ Componentes reutilizáveis
- ✅ Cards de animais com fotos
- ✅ Dashboard para protetores
- ✅ Formulário de cadastro de animais
- ✅ Upload de múltiplas fotos
- ✅ Edição de animais existentes

## 🔗 Endpoints da API

### Autenticação
- `POST /auth/register` - Cadastro de usuário
- `POST /auth/login` - Login
- `GET /auth/me` - Perfil do usuário logado

### Animais
- `GET /animals` - Listar animais disponíveis
- `GET /animals/:id` - Detalhes do animal
- `POST /animals` - Cadastrar animal (Protetor/Admin)
- `PATCH /animals/:id` - Editar animal (Proprietário/Admin)
- `DELETE /animals/:id` - Excluir animal (Proprietário/Admin)
- `POST /animals/:id/photos` - Adicionar fotos

### Solicitações
- `POST /solicitacoes` - Criar solicitação (Interessado)
- `GET /solicitacoes/minhas` - Minhas solicitações (Interessado)
- `GET /solicitacoes/recebidas` - Solicitações recebidas (Protetor)
- `GET /admin/solicitacoes` - Todas as solicitações (Admin)
- `PATCH /admin/solicitacoes/:id/status` - Alterar status (Admin)

### Administração
- `GET /admin/dashboard` - Estatísticas do sistema
- `GET /admin/users` - Listar usuários
- `GET /admin/animals` - Listar todos os animais

## 🎯 Roles e Permissões

### INTERESSADO
- Visualizar animais disponíveis
- Criar solicitações de adoção/apadrinhamento
- Visualizar suas próprias solicitações

### PROTETOR
- Todas as permissões do INTERESSADO
- Cadastrar, editar e excluir seus animais
- Visualizar solicitações recebidas para seus animais
- Upload de fotos dos animais

### ADMIN
- Todas as permissões anteriores
- Acesso ao painel administrativo
- Gerenciar todas as solicitações
- Visualizar estatísticas do sistema

## 🗄️ Modelo de Dados

### User
- id, email, name, password, role, createdAt, updatedAt

### Animal
- id, nome, especie, raca, idade, porte, descricao, status, protetorId, createdAt, updatedAt

### Foto
- id, url, legenda, animalId

### Solicitacao
- id, tipo, status, mensagem, animalId, interessadoId, createdAt, updatedAt

### Pagamento
- id, valor, statusPagamento, gatewayPagamentoId, solicitacaoId, createdAt

## 🚀 Como Executar

### Desenvolvimento
```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Produção
```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm run start
```

## 📝 Próximos Passos

Para expandir o sistema, considere implementar:

1. **Sistema de Notificações Reais**
   - Integração com email (SendGrid, Nodemailer)
   - Notificações push
   - SMS para urgências

2. **Sistema de Pagamentos**
   - Integração com gateway de pagamento
   - Processamento de apadrinhamentos
   - Relatórios financeiros

3. **Funcionalidades Avançadas**
   - Chat entre usuários
   - Sistema de avaliações
   - Geolocalização para busca por proximidade
   - Filtros avançados de busca

4. **Melhorias de UX/UI**
   - PWA (Progressive Web App)
   - Modo escuro
   - Internacionalização
   - Testes automatizados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, entre em contato:
- Email: contato@patasamigas.com
- Telefone: (11) 99999-9999

---

**Patas Amigas** - Conectando corações e transformando vidas! 🐾❤️
