"use strict";
const db = require('../models');
const documentTemplateService = require('../services/documentTemplateService');
const pdfService = require('../services/pdfService');
const Document = db.Document;

const canAccessDocument = (document, user) => {
  if (!document) return false;
  return document.userId === user.id || user.role === 'admin';
};

exports.createDocument = async (req, res, next) => {
  try {
    const { title, documentType, content } = req.body;
    await Document.create({
      title,
      documentType,
      content,
      userId: req.user.id,
    });

    res.status(201).json({ success: true, message: 'Document saved successfully' });
  } catch (err) {
    next(err);
  }
};

exports.listDocuments = async (req, res, next) => {
  try {
    const documents = await Document.findAll({
      where: { userId: req.user.id },
      attributes: ['id', 'title', 'documentType', 'status', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });
    res.json(documents);
  } catch (err) {
    next(err);
  }
};

exports.getDocument = async (req, res, next) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    if (!canAccessDocument(document, req.user)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(document);
  } catch (err) {
    next(err);
  }
};

exports.updateDocument = async (req, res, next) => {
  try {
    const { title, documentType, content } = req.body;
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    if (!canAccessDocument(document, req.user)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    document.title = title !== undefined ? title : document.title;
    document.documentType = documentType !== undefined ? documentType : document.documentType;
    document.content = content !== undefined ? content : document.content;

    await document.save();
    res.json(document);
  } catch (err) {
    next(err);
  }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    if (!canAccessDocument(document, req.user)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await document.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

exports.previewDocument = async (req, res, next) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    if (!canAccessDocument(document, req.user)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const preview = documentTemplateService.generatePreview(document);
    res.json({ preview });
  } catch (err) {
    next(err);
  }
};

exports.downloadPdf = async (req, res, next) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    if (!canAccessDocument(document, req.user)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { stream, filename } = pdfService.createDocumentPDFStream(document);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    stream.pipe(res);
  } catch (err) {
    next(err);
  }
};
