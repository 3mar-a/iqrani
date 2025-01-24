import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box
} from '@mui/material';
import api from '../../config/api';

const PendingBooks = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingBooks();
  }, []);

  const fetchPendingBooks = async () => {
    try {
      const response = await api.get('/admin/pending-books');
      setBooks(response.data);
    } catch (error) {
      setError('حدث خطأ في جلب الكتب المعلقة');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookId) => {
    try {
      await api.put(`/admin/approve-book/${bookId}`);
      setBooks(books.filter(book => book._id !== bookId));
    } catch (error) {
      setError('حدث خطأ في الموافقة على الكتاب');
    }
  };

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>عنوان الكتاب</TableCell>
              <TableCell>الكاتب</TableCell>
              <TableCell>السعر</TableCell>
              <TableCell>التصنيف</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book._id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author.username}</TableCell>
                <TableCell>${book.price}</TableCell>
                <TableCell>{book.category}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => setSelectedBook(book)}
                    sx={{ mr: 1 }}
                  >
                    معاينة
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="success"
                    onClick={() => handleApprove(book._id)}
                  >
                    موافقة
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedBook && (
          <>
            <DialogTitle>{selectedBook.title}</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <img
                  src={selectedBook.coverImage}
                  alt={selectedBook.title}
                  style={{ width: 200, height: 'auto' }}
                />
                <Box>
                  <Typography variant="body1" paragraph>
                    {selectedBook.description}
                  </Typography>
                  <Typography variant="subtitle1">
                    السعر: ${selectedBook.price}
                  </Typography>
                  <Typography variant="subtitle1">
                    التصنيف: {selectedBook.category}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedBook(null)}>إغلاق</Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  handleApprove(selectedBook._id);
                  setSelectedBook(null);
                }}
              >
                موافقة
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default PendingBooks; 