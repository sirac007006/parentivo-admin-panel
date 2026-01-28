// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { SpecializationService, Specialization } from '../services/apiService';

const Specializations: React.FC = () => {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState<Specialization | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formName, setFormName] = useState('');

  const fetchSpecializations = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (nameFilter) params.name = nameFilter;
      const data = await SpecializationService.getSpecializations(params);
      setSpecializations(data);
    } catch (error: any) {
      toast.error('Greška pri učitavanju specijalizacija: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecializations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => fetchSpecializations();
  const handleReset = () => {
    setNameFilter('');
    fetchSpecializations();
  };

  const handleOpenCreateDialog = () => {
    setIsEditing(false);
    setSelectedSpecialization(null);
    setFormName('');
    setFormDialogOpen(true);
  };

  const handleOpenEditDialog = (specialization: Specialization) => {
    setIsEditing(true);
    setSelectedSpecialization(specialization);
    setFormName(specialization.name);
    setFormDialogOpen(true);
  };

  const handleSaveSpecialization = async () => {
    if (!formName.trim()) {
      toast.error('Naziv je obavezan');
      return;
    }
    try {
      if (isEditing && selectedSpecialization) {
        await SpecializationService.updateSpecialization(selectedSpecialization.id, {
          name: formName,
        });
        toast.success('Specijalizacija uspješno ažurirana');
      } else {
        await SpecializationService.createSpecialization({
          name: formName,
        });
        toast.success('Specijalizacija uspješno kreirana');
      }
      setFormDialogOpen(false);
      fetchSpecializations();
    } catch (error: any) {
      toast.error('Greška pri čuvanju specijalizacije: ' + error.message);
    }
  };

  const handleDeleteSpecialization = (specialization: Specialization) => {
    setSelectedSpecialization(specialization);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSpecialization) return;
    try {
      await SpecializationService.deleteSpecialization(selectedSpecialization.id);
      toast.success('Specijalizacija uspješno obrisana');
      setDeleteDialogOpen(false);
      fetchSpecializations();
    } catch (error: any) {
      toast.error('Greška pri brisanju specijalizacije: ' + error.message);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Specijalizacije</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateDialog}>
          Nova Specijalizacija
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={10}>
            <TextField
              fullWidth
              label="Pretraži po nazivu"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button fullWidth variant="contained" onClick={handleSearch} disabled={loading}>
                Pretraži
              </Button>
              <IconButton onClick={handleReset} color="default">
                <RefreshIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Naziv</TableCell>
              <TableCell align="right">Akcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={3} align="center">Učitavanje...</TableCell></TableRow>
            ) : specializations.length === 0 ? (
              <TableRow><TableCell colSpan={3} align="center">Nema specijalizacija</TableCell></TableRow>
            ) : (
              specializations.map((spec) => (
                <TableRow key={spec.id}>
                  <TableCell>{spec.id}</TableCell>
                  <TableCell>{spec.name}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpenEditDialog(spec)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteSpecialization(spec)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={formDialogOpen} onClose={() => setFormDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Uredi Specijalizaciju' : 'Nova Specijalizacija'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField fullWidth label="Naziv *" value={formName} onChange={(e) => setFormName(e.target.value)} sx={{ mb: 2 }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleSaveSpecialization} variant="contained">Sačuvaj</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Potvrda Brisanja</DialogTitle>
        <DialogContent>
          <Typography>Da li ste sigurni da želite obrisati specijalizaciju <strong>{selectedSpecialization?.name}</strong>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">Obriši</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Specializations;
