# BanKKK

## Visão Geral

Este projeto visa implementar um sistema básico de transferências entre usuários.

## Começando

### Tecnologias Utilizadas

- Node
- Typescript
- MySql
- RabbitMQ

### Introdução

Este projeto é uma API Restful criada com Node e Typescript utilizando Fastify. Para persistência de dados foi escolhido
MySql e para gerenciamento de filas o RabbitMQ. O sistema foi projetado com foco na manutenabilidade, escalabilidade e testabilidade, 
seguindo os princípios de Clean Architecture, N-Layer e Domain-Driven Design. Sua arquitetura flexível permite fácil 
adaptação a novos requisitos e tecnologias, garantindo um desenvolvimento contínuo e eficaz.

### Arquitetura

#### Clean Architecture

A arquitetura do sistema segue os princípios da Clean Architecture de Robert C. Martin (Uncle Bob), onde as preocupações são separadas em camadas distintas, com dependências direcionadas dos níveis mais internos para os mais externos. As camadas principais incluem:
- **Domain Layer**: Contém as regras de negócio do sistema, incluindo entidades, value objects, agregados e serviços de domínio. Essa camada é independente de qualquer detalhe de implementação ou framework externo.
- **Application Layer**: Responsável por coordenar a execução das operações de alto nível do sistema. Aqui, os casos de uso são implementados, fazendo uso dos serviços de domínio e traduzindo as operações em termos compreensíveis para o domínio.
- **Infrastructure Layer**: Abstrai os detalhes de infraestrutura e tecnologia, fornecendo implementações concretas para interfaces definidas nas camadas superiores. Isso inclui acesso a banco de dados, serviços externos, infraestrutura de comunicação, etc.

#### N-Layer

Além da separação em camadas proposta pela Clean Architecture, o sistema também adota o conceito de N-Layer, onde cada camada é subdividida em subcamadas para uma maior organização e separação de responsabilidades.
No caso desta aplicação foi criada uma camada de provider que encapsula a camada de domínio. Sua responsabilidade é a de inicializar e configurar serviços ou ferramentas externas que seram utilizadas pelo domínio.
Um exemplo prático: O Provider de Transações seria quem inicializaria os consumers para as filas de processamento de transação.

#### Domain-Driven Design (DDD)
O sistema utiliza os princípios e padrões do Domain-Driven Design para modelar e 
implementar a lógica de negócio de forma coesa e semântica. 
Isso inclui a definição de agregados, a identificação de contextos delimitados e a 
aplicação de padrões como Value Objects, Entities e Domain Services.

![imagem](https://cdn.hibit.dev/images/posts/2021/ddd_layers.png)

#### Entendendo as regras de negôcio e aplicando ao DDD

Dado as regras de negôcio, essencialmente pensei em dois domínios: accounts e transactions.
Assim como em uma empresa bem estruturada com setores, esses dois domínios seriam responsáveis por toda validação e regra de negôcio
necessárias no processo de transação. Em resumo o processo seria:

- A requisição chega até o domínio de contas que faz validações simples como tipo da conta e se tem recursos disponíveis.
- Após passar por essa validação é gerado um requerimento que será repassado para o domínio de transações.
- Ja no domínio de transações, ali seria processado fatores externos como validação em serviços externos ou burocracias internas.
- Caso as validações sucedam, a transação é finalizada, e o montante é creditado na conta do destinatário.
- Caso falhe, o valor é retornado a conta do remetente.

Essencialmente, num sistema completo deveríamos ter outros domínios como usuário ou autenticação, e cada um teria suas proprias responsabilidades no processo de transação.
Eis abaixo um diagrama do funcionamento do sistema. Pode se notar que nenhum dos domínios tem interação direta entre si.

![image](https://i.ibb.co/t8ZrjRy/Diagrama-em-branco.png)


## Instalação

Pra rodar esse projeto você precisa:

- Node ( versão mais recente )
- Git
- Docker
- docker-compose

Inicie clonando o repositório:

```bash
git clone https://github.com/juunr95/bankkk.git
```

Instale as dependências:

```bash
npm install
```

Crie os containers:

```bash
docker-compose up -d
```

Assim sua aplicação ja estará pronta pra rodar com o comando:

```bash
npm run start
```

## Endpoints

```http request
POST /account
{
  fullname: "foo bar",
  type: "common",
  email: "foo@bar.com",
  "cpf": "123.456.789-00",
  "cnpj": "12.345.678/0001-90"
}
```
Cria uma conta nova. O campo tipo suporta os tipos: `common` e `shopkeeper`. Todos os campos são obrigátorios com a excessão do campo
CPF e CNPJ que são obrigatórios baseado no tipo. Caso `common` o CPF é obrigatório, caso `shopkeeper`, o CNPJ.

```http request
POST /account/send
{
  sender_id: "de7b92f8-e8c6-4f4f-93c2-df13182ad280",
  receiver_id: "de7b92f8-e8c6-4f4f-93c2-df13182ad280",
  amount: "100",
}
```
Registra uma transação.

```http request
GET /account/transactions/:id
```
Retorna a lista de transações de uma determinada conta.

```http request
GET /account/:id
```
Retorna informações sobre uma conta.

## Notas Finais

Essa era a idéia toda do projeto. Infelizmente tive intercorrencias durante a semana do teste e não pude focar 100% nele.
Até tinha iniciado um projeto que estava próximo disso ( mas ainda distante de finalizado ) que foi perdido.
No demais agradeço a oportunidade e o tempo prestado e espero que tenha outra oportunidade no futuro e seu Deus quiser conseguirei dar o meu melhor no teste.


