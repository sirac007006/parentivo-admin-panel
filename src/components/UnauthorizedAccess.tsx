// @ts-nocheck
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Lock as LockIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';

const UnauthorizedAccess = () => {
  const navigate = useNavigate();
  const userData = AuthService.getUserData();

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '60vh' 
    }}>
      <Paper sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
        <LockIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Nemate Pristup
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Vaša rola ({userData?.role || 'NEPOZNATO'}) nema pristup ovoj stranici.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Molimo vas kontaktirajte administratora ako mislite da je ovo greška.
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Nazad na Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default UnauthorizedAccess;
