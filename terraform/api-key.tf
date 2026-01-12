resource "aws_api_gateway_api_key" "client_key" {
  name        = "${var.project_name}-client-key"
  description = "API Key para acesso ao endpoint /health"
  enabled     = true
}