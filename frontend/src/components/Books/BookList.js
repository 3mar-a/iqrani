import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../../config/api';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/reader/books');
        setBooks(response.data);
      } catch (error) {
        setError('حدث خطأ في جلب الكتب');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        الكتب المتاحة
      </Typography>
      <Grid container spacing={4}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book._id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={book.coverImage}
                alt={book.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {book.description.substring(0, 100)}...
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  {book.price} $
                </Typography>
                <Button
                  component={Link}
                  to={`/books/${book._id}`}
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  عرض التفاصيل
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BookList; 