const { validate } = require("../validators/health.validator");
const { getHealth } = require("../services/health.service");
const response = require("../utils/response");
const { ValidationError } = require("../utils/errors");

module.exports.handle = async () => {
  try {
    validate();
    const result = getHealth();
    return response.success(result);
  } catch (err) {
    if (err instanceof ValidationError) {
      return response.error(err.message, err.statusCode);
    }
    return response.error("Internal server error", 500);
  }
};
