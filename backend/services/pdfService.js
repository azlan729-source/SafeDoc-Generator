"use strict";
const PDFDocument = require('pdfkit');

const safeText = value => {
  if (value === undefined || value === null) {
    return 'N/A';
  }
  return String(value || 'N/A').trim() || 'N/A';
};

const sanitizeFilename = filename => {
  return filename.replace(/[^a-zA-Z0-9-_\.\s]/g, '').replace(/\s+/g, '_') || 'safedoc';
};

exports.createDocumentPDFStream = document => {
  const pdf = new PDFDocument({ size: 'A4', margin: 48 });
  const title = safeText(document.title || 'Safety Document');
  const documentType = safeText(document.documentType);
  const projectName = safeText(document.content?.projectName);
  const activities = Array.isArray(document.content?.activities)
    ? document.content.activities
    : [];

  pdf.fontSize(22).fillColor('#111827').text(title, { underline: true });
  pdf.moveDown(0.5);

  pdf.fontSize(12).fillColor('#475569');
  pdf.text(`Document Type: ${documentType}`);
  pdf.text(`Project Name: ${projectName}`);
  pdf.moveDown(1.2);

  pdf.fontSize(16).fillColor('#111827').text('Activity Summary', { underline: true });
  pdf.moveDown(0.5);

  if (activities.length === 0) {
    pdf.fontSize(12).fillColor('#475569').text('No activity rows available.', { indent: 6 });
  } else {
    activities.forEach((activity, index) => {
      pdf.fontSize(13).fillColor('#1f2937').text(`Activity ${index + 1}`, { continued: false });
      pdf.moveDown(0.2);
      pdf.fontSize(11).fillColor('#475569');
      pdf.text(`Activity: ${safeText(activity.activity)}`);
      pdf.text(`Hazard: ${safeText(activity.hazard)}`);
      pdf.text(`Risk: ${safeText(activity.risk)}`);
      pdf.text(`Control Measure: ${safeText(activity.control)}`);
      pdf.moveDown(0.9);

      if (pdf.y > 720) {
        pdf.addPage();
      }
    });
  }

  pdf.end();
  return { stream: pdf, filename: `${sanitizeFilename(title)}.pdf` };
};
