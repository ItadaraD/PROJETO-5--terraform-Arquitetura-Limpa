resource "aws_api_gateway_usage_plan" "basic" {
  name = "basic-plan"

  throttle_settings {
    rate_limit  = 5
    burst_limit = 10
  }

  quota_settings {
    limit  = 100
    period = "DAY"
  }

  api_stages {
    api_id = aws_api_gateway_rest_api.api.id
    stage  = aws_api_gateway_stage.prod.stage_name
  }
}

resource "aws_api_gateway_usage_plan_key" "key_attach" {
  key_id        = aws_api_gateway_api_key.client_key.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.basic.id
}
