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
  Collapse,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { apiClient } from '../services/authService';

const HelpDeskSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingsDialogOpen, setBookingsDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSlotBookings, setSelectedSlotBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

  // Form fields
  const [formMaxChildren, setFormMaxChildren] = useState(10);
  const [formStartAt, setFormStartAt] = useState('');
  const [formEndAt, setFormEndAt] = useState('');

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/help-desk-slots');
      console.log('📦 Fetched slots:', response.data);
      setSlots(response.data);
    } catch (error: any) {
      console.error('❌ Error fetching slots:', error);
      toast.error('Greška pri učitavanju termina: ' + (error.response?.data?.message || error.message));
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
    setFormMaxChildren(10);
    setFormStartAt('');
    setFormEndAt('');
    setFormDialogOpen(true);
  };

  const handleOpenEditDialog = (slot) => {
    // Provjeri da li termin ima rezervacija
    const bookingsCount = getBookingsCount(slot);
    if (bookingsCount > 0) {
      toast.warning('Ne možete urediti termin koji ima zauzeta mjesta');
      return;
    }

    setIsEditing(true);
    setSelectedSlot(slot);
    setFormMaxChildren(slot.maxChildren || 10);
    
    // Handle startAt
    if (slot.startAt) {
      try {
        const date = new Date(slot.startAt);
        if (!isNaN(date.getTime())) {
          setFormStartAt(date.toISOString().slice(0, 16));
        } else {
          setFormStartAt('');
        }
      } catch (e) {
        setFormStartAt('');
      }
    } else {
      setFormStartAt('');
    }

    // Handle endAt
    if (slot.endAt) {
      try {
        const date = new Date(slot.endAt);
        if (!isNaN(date.getTime())) {
          setFormEndAt(date.toISOString().slice(0, 16));
        } else {
          setFormEndAt('');
        }
      } catch (e) {
        setFormEndAt('');
      }
    } else {
      setFormEndAt('');
    }

    setFormDialogOpen(true);
  };

  const handleSaveSlot = async () => {
    if (!formStartAt || !formEndAt) {
      toast.error('Početak i kraj termina su obavezni');
      return;
    }

    const startDate = new Date(formStartAt);
    const endDate = new Date(formEndAt);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      toast.error('Nevažeći datum');
      return;
    }

    if (startDate >= endDate) {
      toast.error('Kraj termina mora biti poslije početka');
      return;
    }

    // Validate that dates are not in the past
    const now = new Date();
    if (startDate < now) {
      toast.error('Termin ne može biti u prošlosti');
      return;
    }

    const payload = {
      maxChildren: Number(formMaxChildren),
      startAt: startDate.toISOString(),
      endAt: endDate.toISOString(),
    };

    console.log('📤 Sending payload:', payload);

    try {
      if (isEditing && selectedSlot) {
        console.log('🔄 PATCH /help-desk-slots/' + selectedSlot.id);
        await apiClient.patch(`/help-desk-slots/${selectedSlot.id}`, payload);
        toast.success('Termin uspješno ažuriran');
      } else {
        console.log('➕ POST /help-desk-slots');
        await apiClient.post('/help-desk-slots', payload);
        toast.success('Termin uspješno kreiran');
      }
      setFormDialogOpen(false);
      fetchSlots();
    } catch (error: any) {
      console.error('❌ API Error:', error.response?.data || error);
      const errorMsg = error.response?.data?.message || error.message || 'Nepoznata greška';
      toast.error('Greška: ' + errorMsg);
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
      toast.error('Greška pri brisanju termina: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleViewBookings = async (slot) => {
    setSelectedSlot(slot);
    
    // Bookings are already in slot.helpDeskBookings
    if (slot.helpDeskBookings && slot.helpDeskBookings.length > 0) {
      setSelectedSlotBookings(slot.helpDeskBookings);
      setBookingsDialogOpen(true);
    } else {
      toast.info('Nema rezervacija za ovaj termin');
    }
  };

  const toggleRow = (slotId) => {
    setExpandedRows(prev => ({
      ...prev,
      [slotId]: !prev[slotId]
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleString('sr-RS', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // Get minimum datetime (current time)
  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getBookingsCount = (slot) => {
    return slot.helpDeskBookings?.length || 0;
  };

  const getAvailableSpots = (slot) => {
    const bookings = getBookingsCount(slot);
    return slot.maxChildren - bookings;
  };

  const canEditSlot = (slot) => {
    return getBookingsCount(slot) === 0;
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
              <TableCell width="50px"></TableCell>
              <TableCell>Max Djece</TableCell>
              <TableCell>Rezervacije</TableCell>
              <TableCell>Slobodno</TableCell>
              <TableCell>Početak</TableCell>
              <TableCell>Kraj</TableCell>
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
              slots.map((slot) => {
                const bookingsCount = getBookingsCount(slot);
                const availableSpots = getAvailableSpots(slot);
                const isFull = availableSpots === 0;
                const canEdit = canEditSlot(slot);
                const isExpanded = expandedRows[slot.id];

                return (
                  <React.Fragment key={slot.id}>
                    <TableRow>
                      <TableCell>
                        {bookingsCount > 0 && (
                          <IconButton
                            size="small"
                            onClick={() => toggleRow(slot.id)}
                          >
                            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip label={slot.maxChildren} color="primary" size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={bookingsCount} 
                          color={bookingsCount > 0 ? "success" : "default"} 
                          size="small"
                          icon={bookingsCount > 0 ? <PeopleIcon /> : undefined}
                          onClick={bookingsCount > 0 ? () => handleViewBookings(slot) : undefined}
                          style={{ cursor: bookingsCount > 0 ? 'pointer' : 'default' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={availableSpots} 
                          color={isFull ? "error" : "success"} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{formatDate(slot.startAt)}</TableCell>
                      <TableCell>{formatDate(slot.endAt)}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          color="primary" 
                          onClick={() => handleOpenEditDialog(slot)}
                          disabled={!canEdit}
                          title={canEdit ? "Uredi" : "Ne može se urediti termin sa rezervacijama"}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteSlot(slot)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded row showing bookings inline */}
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 2 }}>
                            <Typography variant="h6" gutterBottom component="div">
                              Prijavljeni roditelji ({bookingsCount})
                            </Typography>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Roditelj</TableCell>
                                  <TableCell>Email</TableCell>
                                  <TableCell>Dijete</TableCell>
                                  <TableCell>Datum prijave</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {slot.helpDeskBookings && slot.helpDeskBookings.map((booking) => (
                                  <TableRow key={booking.id}>
                                    <TableCell>{booking.user?.fullName || 'N/A'}</TableCell>
                                    <TableCell>{booking.user?.email || 'N/A'}</TableCell>
                                    <TableCell>{booking.child?.name || 'N/A'}</TableCell>
                                    <TableCell>{formatDate(booking.createdAt)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })
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
              inputProps={{ min: getMinDateTime() }}
            />
            <TextField
              fullWidth
              type="datetime-local"
              label="Kraj termina"
              value={formEndAt}
              onChange={(e) => setFormEndAt(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: getMinDateTime() }}
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
          {selectedSlot && getBookingsCount(selectedSlot) > 0 && (
            <Typography color="error" sx={{ mt: 1 }}>
              Upozorenje: Ovaj termin ima {getBookingsCount(selectedSlot)} aktivnih rezervacija!
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">Obriši</Button>
        </DialogActions>
      </Dialog>

      {/* Bookings Dialog */}
      <Dialog 
        open={bookingsDialogOpen} 
        onClose={() => setBookingsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Prijavljeni roditelji - {selectedSlot && formatDate(selectedSlot.startAt)}
        </DialogTitle>
        <DialogContent>
          {selectedSlotBookings.length === 0 ? (
            <Typography>Nema rezervacija</Typography>
          ) : (
            <List>
              {selectedSlotBookings.map((booking, index) => (
                <React.Fragment key={booking.id}>
                  {index > 0 && <Divider />}
                  <ListItem>
                    <ListItemText
                      primary={`${booking.user?.fullName || 'N/A'} - ${booking.user?.email || 'N/A'}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2">
                            Dijete: {booking.child?.name || 'N/A'}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2" color="text.secondary">
                            Prijavljeno: {formatDate(booking.createdAt)}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingsDialogOpen(false)}>Zatvori</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HelpDeskSlots;