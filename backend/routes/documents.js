"use strict";
const express = require('express');
const { body, param } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validateRequest');
const documentController = require('../controllers/documentController');

const router = express.Router();
router.use(authMiddleware);

router.post(
  '/',
  [
    body('title').isString().notEmpty(),
    body('documentType').isString().notEmpty(),
    body('content').custom(value => {
      const isObject = typeof value === 'object' && value !== null;
      const hasData = isObject && (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0);
      if (!hasData) {
        throw new Error('Content must be a non-empty JSON object or array');
      }
      return true;
    }),
  ],
  validate,
  documentController.createDocument
);

router.get('/', documentController.listDocuments);

router.get(
  '/:id',
  [param('id').isInt()],
  validate,
  documentController.getDocument
);

router.get(
  '/:id/preview',
  [param('id').isInt()],
  validate,
  documentController.previewDocument
);

router.get(
  '/:id/pdf',
  [param('id').isInt()],
  validate,
  documentController.downloadPdf
);

router.patch(
  '/:id',
  [
    param('id').isInt(),
    body('title').optional().isString().notEmpty(),
    body('documentType').optional().isString().notEmpty(),
    body('content').optional().custom(value => {
      const isObject = typeof value === 'object' && value !== null;
      const hasData = isObject && (Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0);
      if (!hasData) {
        throw new Error('Content must be a non-empty JSON object or array');
      }
      return true;
    }),
  ],
  validate,
  documentController.updateDocument
);

router.delete(
  '/:id',
  [param('id').isInt()],
  validate,
  documentController.deleteDocument
);

module.exports = router;
