import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Layout/Header';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import BookList from './components/Books/BookList';
import BookDetails from './components/Books/BookDetails';
import AuthorDashboard from './components/Author/AuthorDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import PrivateRoute from './components/Routes/PrivateRoute';
import Profile from './components/User/Profile';
import ReadBook from './components/Books/ReadBook';

const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        dir: 'rtl',
      },
    },
    MuiDialog: {
      defaultProps: {
        dir: 'rtl',
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Header />
          <Routes>
            {/* المسارات العامة */}
            <Route path="/" element={<BookList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/books/:id" element={<BookDetails />} />
            
            {/* مسارات القراءة المحمية */}
            <Route
              path="/read/:id"
              element={
                <PrivateRoute>
                  <ReadBook />
                </PrivateRoute>
              }
            />

            {/* مسارات الكاتب */}
            <Route
              path="/author/*"
              element={
                <PrivateRoute role="author">
                  <AuthorDashboard />
                </PrivateRoute>
              }
            />

            {/* مسارات الأدمن */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute role="admin">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            {/* الملف الشخصي */}
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 