import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import api from '../../config/api';

const AddBookForm = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    pdf: null,
    cover: null
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      await api.post('/books/upload', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onSuccess();
    } catch (error) {
      setError(error.response?.data?.message || 'حدث خطأ في رفع الكتاب');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>إضافة كتاب جديد</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label="عنوان الكتاب"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="وصف الكتاب"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            required
          />
          <TextField
            fullWidth
            label="السعر"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>التصنيف</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <MenuItem value="educational">تعليمي</MenuItem>
              <MenuItem value="historical">تاريخي</MenuItem>
              <MenuItem value="cultural">ثقافي</MenuItem>
              <MenuItem value="novel">رواية</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ mt: 2 }}>
            <input
              accept="application/pdf"
              type="file"
              name="pdf"
              onChange={handleFileChange}
              required
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <input
              accept="image/*"
              type="file"
              name="cover"
              onChange={handleFileChange}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>إلغاء</Button>
          <Button type="submit" variant="contained">
            رفع الكتاب
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddBookForm; 