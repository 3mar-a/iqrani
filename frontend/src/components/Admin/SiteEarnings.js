import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import api from '../../config/api';

const SiteEarnings = () => {
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await api.get('/admin/site-earnings');
        setEarnings(response.data.totalEarnings);
      } catch (error) {
        setError('حدث خطأ في جلب الأرباح');
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              إجمالي أرباح الموقع
            </Typography>
            <Typography variant="h3" color="primary">
              ${earnings}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              (15% من إجمالي المبيعات)
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SiteEarnings; 