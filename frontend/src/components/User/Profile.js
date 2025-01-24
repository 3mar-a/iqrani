import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  TextField,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post(`/user/upload-${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (type === 'profile') {
        setProfileImage(response.data.imageUrl);
      } else {
        setCoverImage(response.data.imageUrl);
      }

      setSuccess('تم تحديث الصورة بنجاح');
    } catch (error) {
      setError('حدث خطأ في تحديث الصورة');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/user/update-profile', {
        username: formData.username,
        email: formData.email
      });

      setUser(response.data.user);
      setSuccess('تم تحديث الملف الشخصي بنجاح');
    } catch (error) {
      setError(error.response?.data?.message || 'حدث خطأ في تحديث الملف الشخصي');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    try {
      await api.put('/user/update-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setShowPasswordDialog(false);
      setSuccess('تم تحديث كلمة المرور بنجاح');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setError(error.response?.data?.message || 'حدث خطأ في تحديث كلمة المرور');
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar
                src={profileImage || user.profileImage}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              <input
                accept="image/*"
                type="file"
                onChange={(e) => handleImageChange(e, 'profile')}
                style={{ display: 'none' }}
                id="profile-image-input"
              />
              <label htmlFor="profile-image-input">
                <Button variant="outlined" component="span">
                  تغيير الصورة الشخصية
                </Button>
              </label>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            {error && (
              <Typography color="error" gutterBottom>
                {error}
              </Typography>
            )}
            {success && (
              <Typography color="success" gutterBottom>
                {success}
              </Typography>
            )}
            <form onSubmit={handleUpdateProfile}>
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
                label="البريد الإلكتروني"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
              />
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button type="submit" variant="contained">
                  حفظ التغييرات
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setShowPasswordDialog(true)}
                >
                  تغيير كلمة المرور
                </Button>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)}>
        <DialogTitle>تغيير كلمة المرور</DialogTitle>
        <form onSubmit={handleUpdatePassword}>
          <DialogContent>
            <TextField
              fullWidth
              label="كلمة المرور الحالية"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="كلمة المرور الجديدة"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="تأكيد كلمة المرور الجديدة"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPasswordDialog(false)}>إلغاء</Button>
            <Button type="submit" variant="contained">
              تحديث كلمة المرور
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Profile; 