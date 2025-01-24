import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Rating,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import api from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/reader/books/${id}`);
        setBook(response.data);
      } catch (error) {
        setError('حدث خطأ في جلب تفاصيل الكتاب');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const stripe = await stripePromise;
      const response = await api.post('/payments/create-payment-intent', {
        bookId: id
      });

      const result = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId
      });

      if (result.error) {
        setError(result.error.message);
      }
    } catch (error) {
      setError('حدث خطأ في عملية الشراء');
    }
  };

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>{error}</div>;
  if (!book) return <div>الكتاب غير موجود</div>;

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper>
            <img
              src={book.coverImage}
              alt={book.title}
              style={{ width: '100%', height: 'auto' }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" component="h1" gutterBottom>
            {book.title}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            الكاتب: {book.author.username}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={book.averageRating} readOnly precision={0.5} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({book.ratings.length} تقييم)
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            {book.description}
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            السعر: {book.price} $
          </Typography>
          {!book.hasPurchased ? (
            <Button
              variant="contained"
              size="large"
              onClick={() => setShowConfirmDialog(true)}
            >
              شراء الكتاب
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              component={Link}
              to={`/read/${book._id}`}
            >
              قراءة الكتاب
            </Button>
          )}
        </Grid>
      </Grid>

      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <DialogTitle>تأكيد الشراء</DialogTitle>
        <DialogContent>
          <Typography>
            لا يمكن تحميل الكتاب بصيغة PDF، فقط يمكنك قراءته عبر الموقع.
            هل تريد المتابعة؟
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>إلغاء</Button>
          <Button onClick={handlePurchase} variant="contained">
            متابعة الشراء
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BookDetails; 