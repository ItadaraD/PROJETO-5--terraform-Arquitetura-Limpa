# Projeto 05 – Arquitetura Limpa com Terraform e AWS

## 📌 Visão Geral

Este projeto demonstra a aplicação de **Arquitetura Limpa (Clean Architecture)** em um contexto de **Infraestrutura como Código (IaC)** utilizando **Terraform** e **AWS**.

O foco principal **não é a complexidade da API**, mas sim a **organização do código**, a **separação clara de responsabilidades** e a criação de uma base **escalável, manutenível e profissional** para projetos cloud.

Uma API simples (`/health`) foi utilizada apenas como **exemplo prático** para demonstrar a arquitetura.

---

## 🎯 Objetivo do Projeto

- Aplicar **Arquitetura Limpa** em projetos cloud
- Separar completamente:
  - Código da aplicação
  - Infraestrutura
- Demonstrar boas práticas de:
  - Organização
  - Baixo acoplamento
  - Escalabilidade
- Criar um projeto adequado para **portfólio profissional**

---

## 🧱 Arquitetura do Projeto

A arquitetura foi dividida em **camadas bem definidas**, cada uma com sua responsabilidade.

```text
PROJETO-5-terraform-Arquitetura-Limpa/
│
├── src/                # Camada de aplicação (domínio)
│   ├── handlers/       # Handlers da Lambda
│   ├── services/       # Regras de negócio
│   ├── errors/         # Erros padronizados
│   └── index.js
│
└── terraform/          # Camada de infraestrutura (IaC)
    ├── providers.tf
    ├── variables.tf
    ├── lambda.tf
    ├── api-gateway.tf
    ├── iam.tf
    ├── outputs.tf
    └── usage-plan.tf
## Segurança Implementada

### 1️⃣ IAM Least Privilege
A função Lambda utiliza uma **IAM Role dedicada**, contendo apenas as permissões mínimas necessárias:

- logs:CreateLogGroup
- logs:CreateLogStream
- logs:PutLogEvents

Nenhuma permissão excessiva foi concedida.

---

### 2️⃣ API Gateway com API Key obrigatória

- Endpoint `/health`
- Método `GET`
- `api_key_required = true`

Chamadas sem API Key retornam:

```http
HTTP 403 Forbidden
```

---

### 3️⃣ Usage Plan (Quota + Throttling)

Configuração aplicada:

- **Rate limit:** 5 req/s
- **Burst limit:** 10 req
- **Quota diária:** 100 requisições

Durante testes de carga, requisições acima do limite foram automaticamente bloqueadas pelo API Gateway.

Respostas observadas:
- `200 OK` dentro do limite
- `403 Forbidden` / `429 Too Many Requests` ao exceder

Isso comprova a **aplicação efetiva de controle de tráfego**.

---

### 4️⃣ AWS WAF

O API Gateway foi associado a um **Web ACL** contendo regras gerenciadas da AWS, incluindo:

- Amazon IP Reputation List
- Anonymous IP List
- Core Rule Set (proteção contra inputs maliciosos)

Essas regras adicionam uma camada extra de proteção contra ataques comuns.

---

## Testes Realizados

### Teste sem API Key

```bash
curl https://jtej0ozi4k.execute-api.us-east-1.amazonaws.com/prod/health
```

Resultado:
```json
{
  "message": "Forbidden"
}
```

---

### Teste com API Key válida

```bash
curl -H "x-api-key: <API_KEY>" https://<api-id>.execute-api.us-east-1.amazonaws.com/prod/health
```

Resultado:
```json
{
  "status": "ok",
  "service": "cloud-security-terraform",
  "timestamp": "2026-01-11T23:34:23Z"
}
```

---

### Teste de Throttling

Execução de múltiplas requisições em loop via PowerShell:

```powershell
for ($i = 1; $i -le 100; $i++) {
  curl -s -o NUL -w "%{http_code} " 
    -H "x-api-key: <API_KEY>" 
    https://<api-id>.execute-api.us-east-1.amazonaws.com/prod/health
}
```

Resultado observado:
- Respostas `200` dentro do limite
- Bloqueios automáticos (`403` / `429`) ao exceder

---

## Como Executar o Projeto

### Pré-requisitos
- AWS CLI configurado
- Terraform >= 1.x

### Passos

```bash
terraform init
terraform plan
terraform apply
```

---

## Objetivo do Projeto

Este projeto foi criado com foco em:

- Demonstrar **segurança cloud na prática**
- Aplicar **boas práticas reais de mercado**
- Servir como **projeto de portfólio profissional**

---

## Autor

**Samuel Wilson**  
Cloud / DevOps Professional

---

## Observações Finais

Este projeto não utiliza soluções simplificadas ou simuladas. Todas as configurações refletem cenários reais encontrados em ambientes produtivos, com foco em segurança, controle de acesso e governança.


