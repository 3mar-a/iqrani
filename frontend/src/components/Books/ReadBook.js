import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Container, Paper, Typography, Box } from '@mui/material';
import { Document, Page, pdfjs } from 'react-pdf';
import api from '../../config/api';
import { useAuth } from '../../context/AuthContext';

// تعيين worker لمكتبة PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ReadBook = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/reader/read/${id}`);
        setPdfUrl(response.data.readUrl);
      } catch (error) {
        setError(error.response?.data?.message || 'حدث خطأ في تحميل الكتاب');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Typography>
            صفحة {pageNumber} من {numPages}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div>جاري تحميل الكتاب...</div>}
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, gap: 2 }}>
          <button
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            السابق
          </button>
          <button
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            التالي
          </button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ReadBook; 