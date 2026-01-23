import React, { useState, useEffect } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { HelpDeskSlotService, HelpDeskSlot } from '../services/apiService';

const HelpDeskSlots: React.FC = () => {
  const [slots, setSlots] = useState<HelpDeskSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<HelpDeskSlot | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formMaxChildren, setFormMaxChildren] = useState('');
  const [formStartFrom, setFormStartFrom] = useState('');
  const [formStartTo, setFormStartTo] = useState('');

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const data = await HelpDeskSlotService.getHelpDeskSlots();
      setSlots(data);
    } catch (error: any) {
      toast.error('Greška pri učitavanju HelpDesk termina: ' + error.message);
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
    setFormMaxChildren('');
    setFormStartFrom('');
    setFormStartTo('');
    setFormDialogOpen(true);
  };

  const handleOpenEditDialog = (slot: HelpDeskSlot) => {
    setIsEditing(true);
    setSelectedSlot(slot);
    setFormMaxChildren(slot.maxChildren.toString());
    setFormStartFrom(slot.startFrom.slice(0, 16));
    setFormStartTo(slot.startTo.slice(0, 16));
    setFormDialogOpen(true);
  };

  const handleSaveSlot = async () => {
    if (!formMaxChildren || !formStartFrom || !formStartTo) {
      toast.error('Sva polja moraju biti popunjena');
      return;
    }
    try {
      if (isEditing && selectedSlot) {
        await HelpDeskSlotService.updateHelpDeskSlot(selectedSlot.id, {
          maxChildren: parseInt(formMaxChildren),
          startFrom: formStartFrom,
          startTo: formStartTo,
        });
        toast.success('HelpDesk termin uspješno ažuriran');
      } else {
        await HelpDeskSlotService.createHelpDeskSlot({
          maxChildren: parseInt(formMaxChildren),
          startFrom: formStartFrom,
          startTo: formStartTo,
        });
        toast.success('HelpDesk termin uspješno kreiran');
      }
      setFormDialogOpen(false);
      fetchSlots();
    } catch (error: any) {
      toast.error('Greška pri čuvanju termina: ' + error.message);
    }
  };

  const handleDeleteSlot = (slot: HelpDeskSlot) => {
    setSelectedSlot(slot);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSlot) return;
    try {
      await HelpDeskSlotService.deleteHelpDeskSlot(selectedSlot.id);
      toast.success('HelpDesk termin uspješno obrisan');
      setDeleteDialogOpen(false);
      fetchSlots();
    } catch (error: any) {
      toast.error('Greška pri brisanju termina: ' + error.message);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">HelpDesk Termini</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateDialog}>
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
              <TableRow><TableCell colSpan={5} align="center">Učitavanje...</TableCell></TableRow>
            ) : slots.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center">Nema termina</TableCell></TableRow>
            ) : (
              slots.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell>{slot.maxChildren}</TableCell>
                  <TableCell>{new Date(slot.startFrom).toLocaleString()}</TableCell>
                  <TableCell>{new Date(slot.startTo).toLocaleString()}</TableCell>
                  <TableCell>{new Date(slot.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleOpenEditDialog(slot)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDeleteSlot(slot)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={formDialogOpen} onClose={() => setFormDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Uredi Termin' : 'Novi Termin'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField fullWidth label="Maksimalan broj djece *" type="number" value={formMaxChildren} onChange={(e) => setFormMaxChildren(e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="Početak *" type="datetime-local" value={formStartFrom} onChange={(e) => setFormStartFrom(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
            <TextField fullWidth label="Kraj *" type="datetime-local" value={formStartTo} onChange={(e) => setFormStartTo(e.target.value)} InputLabelProps={{ shrink: true }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleSaveSlot} variant="contained">Sačuvaj</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Potvrda Brisanja</DialogTitle>
        <DialogContent><Typography>Da li ste sigurni da želite obrisati ovaj termin?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">Obriši</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HelpDeskSlots;
