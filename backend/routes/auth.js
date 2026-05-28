"use strict";
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validateRequest');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post(
  '/register',
  [
    body('name').isString().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    body('role').optional().isIn(['user', 'admin'])
  ],
  validate,
  authController.register
);

router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').isString().notEmpty()
  ],
  validate,
  authController.login
);

router.get('/profile', authMiddleware, authController.profile);

module.exports = router;
