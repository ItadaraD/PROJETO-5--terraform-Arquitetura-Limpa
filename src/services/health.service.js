const getHealth = () => {
  return {
    status: "ok",
    service: "cloud-security-terraform",
    timestamp: new Date().toISOString(),
  };
};

module.exports = { getHealth };
