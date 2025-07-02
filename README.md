<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
</p>

<h1 align="center">🌱 Brain Agriculture API</h1>

<p align="center">
  API RESTful desenvolvida em NestJS para gerenciamento de produtores rurais, fazendas, safras e culturas agrícolas.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-v10-red" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
  <img src="https://img.shields.io/badge/PostgreSQL-%23blue.svg?logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-%23339933.svg?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-✔️-blue" />
</p>

---

## Descrição

Este projeto foi desenvolvido como parte do desafio técnico da Serasa Experian, com o objetivo de demonstrar domínio em:

- Arquitetura em camadas e princípios SOLID
- Validações de regras de negócio complexas
- Integração com banco de dados PostgreSQL via TypeORM
- Criação de endpoints RESTful bem estruturados
- Testes unitários e de integração (e2e)
- Documentação com Swagger

---

## Funcionalidades

- Cadastro, edição, listagem e exclusão de produtores rurais
- Associação de fazendas aos produtores
- Registro de safras e culturas por propriedade
- Regras de validação:
  - CPF/CNPJ válido
  - Soma de áreas agricultável + vegetação não pode exceder área total
- Dashboard com:
  - Total de fazendas e hectares
  - Gráficos de uso do solo, por estado e por cultura

---

## Testes

```bash
# Testes unitários
npm run test

# Testes end-to-end
npm run test:e2e

# Cobertura
npm run test:cov


