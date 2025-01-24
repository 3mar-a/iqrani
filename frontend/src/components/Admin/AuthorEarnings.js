import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import api from '../../config/api';

const AuthorEarnings = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAuthorEarnings = async () => {
      try {
        const response = await api.get('/admin/author-earnings');
        setAuthors(response.data);
      } catch (error) {
        setError('حدث خطأ في جلب أرباح الكتاب');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorEarnings();
  }, []);

  if (loading) return <div>جاري التحميل...</div>;
  if (error) return <div>{error}</div>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>اسم الكاتب</TableCell>
            <TableCell>البريد الإلكتروني</TableCell>
            <TableCell>إجمالي الأرباح</TableCell>
            <TableCell>الرصيد الحالي</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {authors.map((author) => (
            <TableRow key={author.authorId}>
              <TableCell>{author.username}</TableCell>
              <TableCell>{author.email}</TableCell>
              <TableCell>${author.totalEarnings}</TableCell>
              <TableCell>${author.balance}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AuthorEarnings; 