exports.health = (req, res) => {
  res.json({
    status: 'ok',
    service: 'SafeDoc Generator Backend',
    timestamp: new Date().toISOString()
  });
};

exports.adminTest = (req, res) => {
  res.json({
    message: 'Admin access granted',
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    }
  });
};
