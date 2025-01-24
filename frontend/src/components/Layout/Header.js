import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          اقرأني
        </Typography>
        <Box>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Button color="inherit" component={RouterLink} to="/admin">
                  لوحة التحكم
                </Button>
              )}
              {user.role === 'author' && (
                <Button color="inherit" component={RouterLink} to="/author">
                  لوحة الكاتب
                </Button>
              )}
              <Button color="inherit" component={RouterLink} to="/profile">
                الملف الشخصي
              </Button>
              <Button color="inherit" onClick={logout}>
                تسجيل الخروج
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                تسجيل الدخول
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                إنشاء حساب
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 