import React, { useState } from 'react';
import { TextField, Button, Paper, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    role: 'reader',
    phoneNumber: '',
    phoneArea: '',
    bookTypes: []
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    try {
      await register(formData);
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'حدث خطأ في إنشاء الحساب');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <Paper sx={{ p: 4, maxWidth: 500, width: '100%' }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          إنشاء حساب جديد
        </Typography>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="البريد الإلكتروني"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="اسم المستخدم"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="كلمة المرور"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="تأكيد كلمة المرور"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>نوع الحساب</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <MenuItem value="reader">قارئ</MenuItem>
              <MenuItem value="author">كاتب</MenuItem>
            </Select>
          </FormControl>

          {formData.role === 'author' && (
            <>
              <TextField
                fullWidth
                label="رقم الهاتف"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="bookTypes-label">أنواع الكتب</InputLabel>
                <Select
                  labelId="bookTypes-label"
                  name="bookTypes"
                  multiple
                  value={formData.bookTypes}
                  onChange={handleChange}
                  label="أنواع الكتب"
                >
                  <MenuItem value="educational">تعليمية</MenuItem>
                  <MenuItem value="historical">تاريخية</MenuItem>
                  <MenuItem value="cultural">ثقافية</MenuItem>
                  <MenuItem value="novel">روائية</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 3 }}
          >
            إنشاء حساب
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Register; 