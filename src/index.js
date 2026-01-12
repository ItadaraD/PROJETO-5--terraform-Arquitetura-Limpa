const healthHandler = require("./handlers/health.handler");

exports.handler = async (event) => {
  const path = event.resource || event.path;

  if (path === "/health") {
    return healthHandler.handle();
  }

  return {
    statusCode: 404,
    body: JSON.stringify({ message: "Route not found" }),
  };
};
