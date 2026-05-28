module.exports = function (err, req, res, next) {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }
  res.status(err.status || 500).json({ error: err.message || 'Server Error' });
};
