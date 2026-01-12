module.exports.success = (data, statusCode = 200) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

module.exports.error = (message, statusCode = 400) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message }),
});
