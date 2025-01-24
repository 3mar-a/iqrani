import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../../config/api';
import AddBookForm from './AddBookForm';

const AuthorDashboard = () => {
  const [books, setBooks] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchAuthorData();
  }, []);

  const fetchAuthorData = async () => {
    try {
      const [booksResponse, earningsResponse] = await Promise.all([
        api.get('/books/my-books'),
        api.get('/author/earnings')
      ]);
      setBooks(booksResponse.data);
      setEarnings(earningsResponse.data.totalEarnings);
    } catch (error) {
      setError('حدث خطأ في جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await api.delete(`/books/${bookId}`);
      setBooks(books.filter(book => book._id !== bookId));
    } catch (error) {
      setError('حدث خطأ في حذف الكتاب');
    }
  };

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              لوحة تحكم الكاتب
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">
                الأرباح الإجمالية: ${earnings}
              </Typography>
              <Button
                variant="contained"
                onClick={() => setShowAddForm(true)}
              >
                إضافة كتاب جديد
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>عنوان الكتاب</TableCell>
                    <TableCell>السعر</TableCell>
                    <TableCell>الحالة</TableCell>
                    <TableCell>المبيعات</TableCell>
                    <TableCell>الإجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {books.map((book) => (
                    <TableRow key={book._id}>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>${book.price}</TableCell>
                      <TableCell>
                        {book.isApproved ? 'تمت الموافقة' : 'قيد المراجعة'}
                      </TableCell>
                      <TableCell>{book.purchases.length}</TableCell>
                      <TableCell>
                        {!book.isApproved && (
                          <>
                            <Button
                              component={Link}
                              to={`/author/books/edit/${book._id}`}
                              size="small"
                              sx={{ mr: 1 }}
                            >
                              تعديل
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleDeleteBook(book._id)}
                            >
                              حذف
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {showAddForm && (
        <AddBookForm
          open={showAddForm}
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchAuthorData();
          }}
        />
      )}
    </Container>
  );
};

export default AuthorDashboard; 