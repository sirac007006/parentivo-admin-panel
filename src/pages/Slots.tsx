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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { apiClient } from '../services/authService';

const Slots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form fields prema API dokumentaciji
  const [formIsBooked, setFormIsBooked] = useState('false');
  const [formStartFrom, setFormStartFrom] = useState('');
  const [formStartTo, setFormStartTo] = useState('');

  const fetchSlots = async () => {
    setLoading(true);
    try {
      // GET /slots/my - Lista termina ulogovanog eksperta (bez filtera)
      const response = await apiClient.get('/slots/my');
      setSlots(response.data);
    } catch (error) {
      toast.error('Greška pri učitavanju termina: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleOpenCreateDialog = () => {
    setIsEditing(false);
    setSelectedSlot(null);
    setFormIsBooked('false');
    setFormStartFrom('');
    setFormStartTo('');
    setFormDialogOpen(true);
  };

  const handleOpenEditDialog = (slot) => {
    setIsEditing(true);
    setSelectedSlot(slot);
    setFormIsBooked(slot.isBooked ? 'true' : 'false');
    
    // Defensively handle dates
    if (slot.startAt && slot.startAt !== 'Invalid Date') {
      try {
        const date = new Date(slot.startAt);
        if (!isNaN(date.getTime())) {
          setFormStartFrom(date.toISOString().slice(0, 16));
        } else {
          setFormStartFrom('');
        }
      } catch (e) {
        setFormStartFrom('');
      }
    } else {
      setFormStartFrom('');
    }

    if (slot.endAt && slot.endAt !== 'Invalid Date') {
      try {
        const date = new Date(slot.endAt);
        if (!isNaN(date.getTime())) {
          setFormStartTo(date.toISOString().slice(0, 16));
        } else {
          setFormStartTo('');
        }
      } catch (e) {
        setFormStartTo('');
      }
    } else {
      setFormStartTo('');
    }
    
    setFormDialogOpen(true);
  };

  const handleSaveSlot = async () => {
    if (!formStartFrom || !formStartTo) {
      toast.error('Početak i kraj termina su obavezni');
      return;
    }

    const startDate = new Date(formStartFrom);
    const endDate = new Date(formStartTo);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      toast.error('Nevažeći datum');
      return;
    }

    if (startDate >= endDate) {
      toast.error('Kraj termina mora biti poslije početka');
      return;
    }

    const payload = {
      startAt: startDate.toISOString(),
      endAt: endDate.toISOString(),
    };

    try {
      if (isEditing && selectedSlot) {
        // PATCH /slots/{id}
        await apiClient.patch(`/slots/${selectedSlot.id}`, payload);
        toast.success('Termin uspješno ažuriran');
      } else {
        // POST /slots
        await apiClient.post('/slots', payload);
        toast.success('Termin uspješno kreiran');
      }
      setFormDialogOpen(false);
      fetchSlots();
    } catch (error) {
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
      // DELETE /slots/{id}
      await apiClient.delete(`/slots/${selectedSlot.id}`);
      toast.success('Termin uspješno obrisan');
      setDeleteDialogOpen(false);
      fetchSlots();
    } catch (error) {
      toast.error('Greška pri brisanju termina: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Invalid Date') return 'Invalid Date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleString('sr-RS');
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Moji Termini</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton onClick={fetchSlots} color="primary" title="Osveži">
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
          >
            Novi Termin
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Doktor ID</TableCell>
              <TableCell>Početak</TableCell>
              <TableCell>Kraj</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Kreiran</TableCell>
              <TableCell align="right">Akcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Učitavanje...</TableCell>
              </TableRow>
            ) : slots.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Nema termina</TableCell>
              </TableRow>
            ) : (
              slots.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell>{slot.id}</TableCell>
                  <TableCell>{slot.doctorId || '-'}</TableCell>
                  <TableCell>{formatDate(slot.startAt)}</TableCell>
                  <TableCell>{formatDate(slot.endAt)}</TableCell>
                  <TableCell>
                    <span className={`badge ${slot.isBooked ? 'badge-active' : 'badge-inactive'}`}>
                      {slot.isBooked ? 'Rezervisan' : 'Slobodan'}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(slot.createdAt)}</TableCell>
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
              type="datetime-local"
              label="Početak termina (startAt) *"
              value={formStartFrom}
              onChange={(e) => setFormStartFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
              helperText="Slot počinje od ovog datuma (ISO 8601 format)"
            />
            <TextField
              fullWidth
              type="datetime-local"
              label="Kraj termina (endAt) *"
              value={formStartTo}
              onChange={(e) => setFormStartTo(e.target.value)}
              InputLabelProps={{ shrink: true }}
              helperText="Slot završava do ovog datuma (ISO 8601 format)"
            />
            <Typography variant="caption" color="text.secondary">
              Napomena: Status rezervacije (isBooked) se automatski postavlja od strane sistema.
            </Typography>
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
          {selectedSlot && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Početak: {formatDate(selectedSlot.startAt)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Kraj: {formatDate(selectedSlot.endAt)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">Obriši</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Slots;
