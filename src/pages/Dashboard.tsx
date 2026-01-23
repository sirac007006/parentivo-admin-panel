// @ts-nocheck
import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import AuthService from '../services/authService';

const Dashboard: React.FC = () => {
  const userData = AuthService.getUserData();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dobrodošli, {userData?.fullName}!
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Parentivo Admin Panel
            </Typography>
            <Typography variant="body1" paragraph>
              Dobrodošli u administratorski panel Parentivo aplikacije.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Vaša rola: <strong>{userData?.role}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: <strong>{userData?.email}</strong>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
