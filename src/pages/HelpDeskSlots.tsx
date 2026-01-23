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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Chip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { apiClient } from '../services/authService';

const HelpDeskSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form fields
  const [formMaxChildren, setFormMaxChildren] = useState(10);
  const [formStartAt, setFormStartAt] = useState('');
  const [formEndAt, setFormEndAt] = useState('');

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/help-desk-slots');
      setSlots(response.data);
    } catch (error: any) {
      toast.error('Greška pri učitavanju termina: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenCreateDialog = () => {
    setIsEditing(false);
    setSelectedSlot(null);
    setFormMaxChildren(10);
    setFormStartAt('');
    setFormEndAt('');
    setFormDialogOpen(true);
  };

  const handleOpenEditDialog = (slot) => {
    setIsEditing(true);
    setSelectedSlot(slot);
    setFormMaxChildren(slot.maxChildren || 10);
    setFormStartAt(slot.startAt ? slot.startAt.substring(0, 16) : '');
    setFormEndAt(slot.endAt ? slot.endAt.substring(0, 16) : '');
    setFormDialogOpen(true);
  };

  const handleSaveSlot = async () => {
    if (!formStartAt || !formEndAt) {
      toast.error('Početak i kraj termina su obavezni');
      return;
    }

    const startDate = new Date(formStartAt);
    const endDate = new Date(formEndAt);

    if (startDate >= endDate) {
      toast.error('Kraj termina mora biti poslije početka');
      return;
    }

    try {
      if (isEditing && selectedSlot) {
        // PATCH /help-desk-slots/{id}
        await apiClient.patch(`/help-desk-slots/${selectedSlot.id}`, {
          maxChildren: formMaxChildren,
          startAt: startDate.toISOString(),
          endAt: endDate.toISOString(),
        });
        toast.success('Termin uspješno ažuriran');
      } else {
        // POST /help-desk-slots
        await apiClient.post('/help-desk-slots', {
          maxChildren: formMaxChildren,
          startAt: startDate.toISOString(),
          endAt: endDate.toISOString(),
        });
        toast.success('Termin uspješno kreiran');
      }
      setFormDialogOpen(false);
      fetchSlots();
    } catch (error: any) {
      toast.error('Greška: ' + error.message);
    }
  };

  const handleDeleteSlot = (slot) => {
    setSelectedSlot(slot);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSlot) return;
    try {
      await apiClient.delete(`/help-desk-slots/${selectedSlot.id}`);
      toast.success('Termin uspješno obrisan');
      setDeleteDialogOpen(false);
      fetchSlots();
    } catch (error: any) {
      toast.error('Greška pri brisanju termina: ' + error.message);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">HelpDesk Termini</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          Novi Termin
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Max Djece</TableCell>
              <TableCell>Početak</TableCell>
              <TableCell>Kraj</TableCell>
              <TableCell>Kreiran</TableCell>
              <TableCell align="right">Akcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Učitavanje...</TableCell>
              </TableRow>
            ) : slots.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Nema termina</TableCell>
              </TableRow>
            ) : (
              slots.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell><Chip label={slot.maxChildren} color="primary" size="small" /></TableCell>
                  <TableCell>{slot.startAt ? new Date(slot.startAt).toLocaleString('sr-RS') : 'Invalid Date'}</TableCell>
                  <TableCell>{slot.endAt ? new Date(slot.endAt).toLocaleString('sr-RS') : 'Invalid Date'}</TableCell>
                  <TableCell>{slot.createdAt ? new Date(slot.createdAt).toLocaleDateString('sr-RS') : '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpenEditDialog(slot)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteSlot(slot)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Form Dialog */}
      <Dialog open={formDialogOpen} onClose={() => setFormDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Uredi Termin' : 'Novi Termin'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              type="number"
              label="Maksimalan broj djece"
              value={formMaxChildren}
              onChange={(e) => setFormMaxChildren(parseInt(e.target.value) || 10)}
              inputProps={{ min: 1 }}
            />
            <TextField
              fullWidth
              type="datetime-local"
              label="Početak termina"
              value={formStartAt}
              onChange={(e) => setFormStartAt(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              type="datetime-local"
              label="Kraj termina"
              value={formEndAt}
              onChange={(e) => setFormEndAt(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleSaveSlot} variant="contained">Sačuvaj</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Potvrda Brisanja</DialogTitle>
        <DialogContent>
          <Typography>Da li ste sigurni da želite obrisati ovaj termin?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">Obriši</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HelpDeskSlots;
