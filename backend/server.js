"use strict";
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const security = require('./middleware/security');
const testRoutes = require('./routes/test');
const authRoutes = require('./routes/auth');
const sequelize = require('./config/database');
const db = require('./models');

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(security.rateLimiter);

app.use('/api', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/documents', require('./routes/documents'));

app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 3000;

(async function start() {
  try {
    await sequelize.authenticate();
    await db.sequelize.sync({ alter: true });
    const server = app.listen(PORT, () => {
      console.log(`SafeDoc Generator backend listening on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Set a different PORT or stop the process using that port.`);
      } else {
        console.error('Server error:', err && err.message ? err.message : err);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error('Unable to start backend:', err.message || err);
    process.exit(1);
  }
})();
