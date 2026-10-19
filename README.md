***

# PETCARE
## Sistema de Gestão de Cuidados com Pets
---

### Sobre o Projeto:

O PetCare é uma aplicação mobile desenvolvida para auxiliar tutores de pets no gerenciamento da saúde e bem-estar de seus animais. O sistema permite o registro e acompanhamento de vacinas, consultas veterinárias, vermifugações e medicamentos, centralizando todas as informações em um único local.

---

### Funcionalidades:

| Funcionalidade | Descrição |
|----------------|-----------|
| Cadastrar Tutor | Registro de novos usuários com nome, e-mail e senha |
| Fazer Login | Autenticação segura do tutor utilizando Token JWT |
| Cadastrar Pet | Registro de animais com nome, espécie, raça e data de nascimento |
| Tirar Foto do Pet | Integração com a câmera do dispositivo para foto de perfil do pet |
| Adicionar Evento | Registro de vacinas, consultas, vermifugos, medicamentos e custos |
| Visualizar Histórico | Listagem completa de todos os eventos de um pet com filtros |
| Visualizar Dashboard | Painel inicial com resumo de pets, próximos eventos e gastos totais |
---

### Atores do Sistema:

**Tutor**
é o usuário principal do sistema, responsável por gerenciar seus pets e seus eventos de saúde.

**Veterinário**
é o ator secundário (externo) que pode receber o relatório em PDF com o histórico de saúde do pet gerado pelo tutor.

---

### Diagramas do Sistema:

**Diagrama de Casos de Uso:**

O diagrama abaixo ilustra as interações entre os atores e as funcionalidades do sistema:

![Diagrama de Casos de Uso](PetCare/docs/DIAGRAMA_DE_CASOS_DE_USO.png)

**Diagrama de Classes:**

Representação da modelagem de domínio do back-end, refletindo as entidades do banco de dados:

![Diagrama de Classes](PetCare/docs/DIAGRAMA_DE_CLASSES.png)

---

### Protótipo das Telas:

Protótipo disponível em: [Figma - Prototipagem Mobile](https://www.figma.com/design/WnLbF2TOJfiT3QsvgQcnac/Prototipagem---mobile?m=auto&t=uDgUl5BqzzCzMCwa-6)

---

### Tecnologias Utilizadas:

| Camada | Tecnologia |
|--------|------------|
| Front-end | React Native com Expo |
| Estilização | StyleSheet |
| Navegação | Expo Router |
| Câmera | Expo Image Picker |
| Back-end | Python com FastAPI |
| Autenticação | JWT e Bcrypt |
| Banco de Dados | PostgreSQL (hospedado na Neon) |
| Linguagens | TypeScript (Front) e Python (Back) |
| Versionamento | Git e GitHub |

---

### Como Executar o Projeto:

#### Pré-requisitos:

- Node.js instalado (versão 18 ou superior)
- Python instalado (versão 3.10 ou superior)
- Aplicativo Expo Go instalado no celular (Android ou iOS)
- Git instalado

#### 1. Executando o Back-end (API):

1. Acesse a pasta do back-end:
```bash
cd PETCARE/Back-end
```

2. Crie e ative o ambiente virtual:
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz da pasta `Back-end` com as seguintes chaves:
```env
DATABASE_URL=postgresql://neondb_owner:npg_iY0RHIoUhfv5@ep-summer-flower-b6a18ofm-pooler.c-2.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
SECRET_KEY=petcare_chave_super_secreta_2026
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

5. Inicie o servidor:
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0
```

#### 2. Executando o Front-end (App):

1. Acesse a pasta do front-end:
```bash
cd PETCARE/PetCare
```

2. Instale as dependências:
```bash
npm install
```

3. Verifique a URL da API:
No arquivo `src/services/api.ts`, certifique-se de que a `API_BASE_URL` aponta para o IP da sua máquina na rede local (ex: `http://192.168.x.x:8000`).

4. Inicie o projeto:
```bash
npm run start
```

5. Abra o aplicativo:
- **No celular:** escaneie o QR Code com o app Expo Go (necessário estar na mesma rede Wi-Fi do computador).
- **No navegador:** pressione `w` no terminal.
- **No emulador Android:** pressione `a` no terminal.

---

### Dupla:

| Nome | Responsabilidade |
|----------------|-----------|
| Ana Clara Siqueira Gouveia | Front-End, Design e Prototipação |
| Eduarda Cecília da Silva Melo | Back-End, Banco de Dados e Documentação |

---
