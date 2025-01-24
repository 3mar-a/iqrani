import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab
} from '@mui/material';
import PendingBooks from './PendingBooks';
import SiteEarnings from './SiteEarnings';
import AuthorEarnings from './AuthorEarnings';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        لوحة تحكم المدير
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="الكتب المعلقة" />
          <Tab label="أرباح الموقع" />
          <Tab label="أرباح الكتاب" />
        </Tabs>
      </Box>
      {activeTab === 0 && <PendingBooks />}
      {activeTab === 1 && <SiteEarnings />}
      {activeTab === 2 && <AuthorEarnings />}
    </Container>
  );
};

export default AdminDashboard; 