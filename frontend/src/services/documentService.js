import api from './api';

export const fetchDocuments = async () => {
  const response = await api.get('/documents');
  return response.data;
};

export const createDocument = async payload => {
  const response = await api.post('/documents', payload);
  return response.data;
};

export const deleteDocument = async id => {
  const response = await api.delete(`/documents/${id}`);
  return response.data;
};

export const previewDocument = async id => {
  const response = await api.get(`/documents/${id}/preview`);
  return response.data;
};

export const downloadDocumentPDF = async id => {
  const response = await api.get(`/documents/${id}/pdf`, {
    responseType: 'blob',
  });
  return response.data;
};
