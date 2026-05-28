"use strict";

const formatList = items => {
  if (!Array.isArray(items)) return items;
  return items.map((item, index) => ({
    position: index + 1,
    ...item,
  }));
};

const createHIRARCPreview = (title, content) => {
  return {
    previewType: 'HIRARC',
    title,
    summary: content.summary || '',
    hazards: formatList(content.hazards || []),
    risks: formatList(content.risks || []),
    controls: formatList(content.controls || []),
    notes: content.notes || '',
  };
};

const createPTWPreview = (title, content) => {
  return {
    previewType: 'PTW',
    title,
    permitNumber: content.permitNumber || content.permitNo || '',
    location: content.location || '',
    workDescription: content.workDescription || content.task || '',
    hazards: formatList(content.hazards || []),
    controls: formatList(content.controls || []),
    authorizedBy: content.authorizedBy || '',
  };
};

const createChecklistPreview = (title, content) => {
  return {
    previewType: 'CHECKLIST',
    title,
    items: formatList(content.items || content.checklist || []),
    completedCount: Array.isArray(content.items || content.checklist)
      ? (content.items || content.checklist).filter(item => item.completed).length
      : 0,
    totalCount: Array.isArray(content.items || content.checklist)
      ? (content.items || content.checklist).length
      : 0,
  };
};

exports.generatePreview = document => {
  const title = document.title || 'Document Preview';
  const type = (document.documentType || '').toUpperCase();
  const content = document.content || {};

  switch (type) {
    case 'HIRARC':
      return createHIRARCPreview(title, content);
    case 'PTW':
      return createPTWPreview(title, content);
    case 'CHECKLIST':
      return createChecklistPreview(title, content);
    default:
      return {
        previewType: 'UNKNOWN',
        title,
        content,
      };
  }
};
