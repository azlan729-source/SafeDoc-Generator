exports.health = (req, res) => {
  res.json({
    status: 'ok',
    service: 'SafeDoc Generator Backend',
    timestamp: new Date().toISOString()
  });
};
