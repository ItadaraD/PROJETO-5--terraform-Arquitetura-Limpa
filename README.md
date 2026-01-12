# Projeto 04 – Cloud Security na Prática com Terraform

## Visão Geral
Este projeto demonstra a implementação **prática e realista de segurança em APIs na AWS**, com foco em **IAM Least Privilege**, **API Gateway protegido por API Keys e Usage Plans**, **controle de tráfego (throttling/quota)** e **WAF**.

Todo o ambiente é provisionado **100% via Terraform**, seguindo boas práticas de infraestrutura como código, organização de módulos e arquitetura limpa de aplicação.

O objetivo é servir como **projeto de portfólio**, demonstrando conhecimento aplicado — não apenas teórico — em segurança cloud.

---

## Arquitetura

**Fluxo principal:**

Client → API Gateway → Lambda → CloudWatch Logs

**Camadas de segurança:**
- IAM Least Privilege para Lambda
- API Key obrigatória
- Usage Plan com quota e throttling
- AWS WAF associado ao API Gateway

---

## Tecnologias Utilizadas

- **AWS**
  - API Gateway (REST API)
  - AWS Lambda
  - IAM
  - AWS WAF
  - CloudWatch Logs

- **Infraestrutura como Código**
  - Terraform

- **Outros**
  - Node.js (Lambda)
  - Curl (testes de carga e validação)

---

## Estrutura do Projeto

```text
.
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── iam.tf
│   ├── lambda.tf
│   ├── api-gateway.tf
│   ├── usage-plan.tf
│   ├── waf.tf
│   └── providers.tf
│
├── lambda/
│   ├── handler.js
│   ├── services/
│   │   └── health.service.js
│   └── utils/
│       └── response.js
│
└── README.md
```

---

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
curl https://<api-id>.execute-api.us-east-1.amazonaws.com/prod/health
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
  curl -s -o NUL -w "%{http_code} " `
    -H "x-api-key: <API_KEY>" `
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
Cloud / DevOps Enthusiast

---

## Observações Finais

Este projeto não utiliza soluções simplificadas ou simuladas. Todas as configurações refletem cenários reais encontrados em ambientes produtivos, com foco em segurança, controle de acesso e governança.

