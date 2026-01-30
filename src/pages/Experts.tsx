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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  People as PeopleIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { UserService, User, SlotService } from '../services/apiService';

const ExpertSlots = () => {
  const [slots, setSlots] = useState([]);
  const [experts, setExperts] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appointmentsDialogOpen, setAppointmentsDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSlotAppointments, setSelectedSlotAppointments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

  // Filters
  const [selectedExpertFilter, setSelectedExpertFilter] = useState('');

  // Form fields
  const [formStartAt, setFormStartAt] = useState('');
  const [formEndAt, setFormEndAt] = useState('');

  const fetchExperts = async () => {
    try {
      const data = await UserService.getExperts();
      console.log('📋 Experts loaded:', data);
      setExperts(data);
    } catch (error: any) {
      console.error('❌ Error loading experts:', error);
      toast.error('Greška pri učitavanju eksperata');
    }
  };

  const fetchSlots = async (doctorId?: string) => {
    setLoading(true);
    try {
      let data;
      if (doctorId) {
        // GET /slots/doctor/{id} - za specifičnog doktora
        console.log('📥 Fetching slots for doctor:', doctorId);
        data = await SlotService.getSlotsByDoctor(doctorId);
        console.log('✅ Slots for doctor loaded:', data);
      } else {
        // GET /slots/my - vraća termine trenutno ulogovanog eksperta SA appointment objektom
        console.log('📥 Fetching all my slots with appointments...');
        data = await SlotService.getMySlots();
        console.log('✅ My slots loaded:', data);
        
        // Log appointment data for debugging
        if (data && data.length > 0) {
          console.log(`📊 Total slots: ${data.length}`);
          data.forEach((slot, index) => {
            if (slot.appointment) {
              console.log(`Slot #${index + 1} (${slot.id}):`, {
                isBooked: slot.isBooked,
                appointmentId: slot.appointment.id,
                userName: slot.appointment.user?.fullName || 'N/A',
                userEmail: slot.appointment.user?.email || 'N/A',
              });
            } else if (slot.isBooked) {
              console.warn(`⚠️ Slot #${index + 1} (${slot.id}) is marked as booked but has NO appointment object!`);
            }
          });
        } else {
          console.log('📭 No slots found');
        }
      }
      
      setSlots(data || []);
    } catch (error: any) {
      console.error('❌ Error fetching slots:', error);
      const errorMsg = error.response?.data?.message || error.message;
      toast.error('Greška pri učitavanju termina: ' + errorMsg);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
    fetchSlots();
  }, []);

  const handleExpertFilterChange = (expertId: string) => {
    setSelectedExpertFilter(expertId);
    if (expertId) {
      fetchSlots(expertId);
    } else {
      fetchSlots();
    }
  };

  const handleOpenCreateDialog = () => {
    setIsEditing(false);
    setSelectedSlot(null);
    setFormStartAt('');
    setFormEndAt('');
    setFormDialogOpen(true);
  };

  const handleOpenEditDialog = (slot) => {
    // Check if slot is booked - bolji error handling
    if (slot.isBooked) {
      const userName = slot.appointment?.user?.fullName || 'korisnik';
      toast.error(
        `Ne možete urediti ovaj termin jer ga je već rezervisao ${userName}. ` +
        `Prvo morate otkazati rezervaciju.`,
        { autoClose: 5000 }
      );
      return;
    }

    setIsEditing(true);
    setSelectedSlot(slot);
    
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

    // NOVA VALIDACIJA: Proveri da li je termin u prošlosti
    const now = new Date();
    if (startDate < now) {
      const diffMinutes = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      let timeAgo = '';
      if (diffDays > 0) {
        timeAgo = `${diffDays} ${diffDays === 1 ? 'dan' : 'dana'}`;
      } else if (diffHours > 0) {
        timeAgo = `${diffHours} ${diffHours === 1 ? 'sat' : 'sati'}`;
      } else {
        timeAgo = `${diffMinutes} ${diffMinutes === 1 ? 'minut' : 'minuta'}`;
      }
      
      toast.error(
        `Termin ne može biti u prošlosti! Odabrani datum je bio pre ${timeAgo}.`,
        { autoClose: 5000 }
      );
      return;
    }

    // Dodatna validacija: Upozorenje ako je termin vrlo blizu (manje od 30 minuta)
    const diffMinutes = Math.floor((startDate.getTime() - now.getTime()) / (1000 * 60));
    if (diffMinutes < 30 && diffMinutes > 0) {
      const confirmCreate = window.confirm(
        `Termin počinje za samo ${diffMinutes} minuta. Da li ste sigurni da želite da ga kreirate?`
      );
      if (!confirmCreate) {
        return;
      }
    }

    const payload = {
      startAt: startDate.toISOString(),
      endAt: endDate.toISOString(),
    };

    console.log('📤 Sending payload:', payload);

    try {
      if (isEditing && selectedSlot) {
        // PATCH /slots/{id}
        console.log('🔄 Updating slot:', selectedSlot.id);
        await SlotService.updateSlot(selectedSlot.id, payload);
        toast.success('Termin uspješno ažuriran');
      } else {
        // POST /slots
        console.log('➕ Creating slot');
        await SlotService.createSlot(payload);
        toast.success('Termin uspješno kreiran');
      }
      setFormDialogOpen(false);
      
      // Refresh based on current filter
      if (selectedExpertFilter) {
        fetchSlots(selectedExpertFilter);
      } else {
        fetchSlots();
      }
    } catch (error: any) {
      console.error('❌ API Error:', error.response?.data || error);
      
      // Bolji error handling
      const errorMessage = error.response?.data?.message || error.message;
      if (errorMessage.toLowerCase().includes('past')) {
        toast.error('Greška: Termin ne može biti u prošlosti!');
      } else if (errorMessage.toLowerCase().includes('overlap')) {
        toast.error('Greška: Termin se preklapa sa postojećim terminom!');
      } else {
        toast.error(`Greška pri čuvanju termina: ${errorMessage}`);
      }
    }
  };

  const handleDeleteSlot = (slot) => {
    // Ako je termin rezervisan, prikaži DETALJNO upozorenje
    if (slot.isBooked && slot.appointment?.user) {
      const userName = slot.appointment.user.fullName || 'korisnik';
      const userEmail = slot.appointment.user.email || '';
      
      // Prikaži Snackbar sa detaljima
      toast.error(
        <Box>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            ⚠️ UPOZORENJE: Rezervisan termin!
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2">
            <strong>Korisnik:</strong> {userName}
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {userEmail}
          </Typography>
          <Typography variant="caption" display="block" sx={{ mt: 1, color: 'warning.dark' }}>
            Da li ste sigurni da želite obrisati ovaj termin?
          </Typography>
        </Box>,
        { 
          autoClose: 8000,
          position: 'top-center',
          style: {
            minWidth: '400px',
            backgroundColor: '#fff3e0',
            color: '#e65100',
            border: '2px solid #ff9800',
          }
        }
      );
    }
    
    setSelectedSlot(slot);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSlot) return;

    try {
      // DELETE /slots/{id}
      console.log('🗑️ Deleting slot:', selectedSlot.id);
      await SlotService.deleteSlot(selectedSlot.id);
      
      // Detaljnija success poruka
      if (selectedSlot.isBooked) {
        const userName = selectedSlot.appointment?.user?.fullName || 'korisnik';
        toast.success(
          `Termin je uspješno obrisan. Rezervacija korisnika ${userName} je otkazana.`,
          { autoClose: 5000 }
        );
      } else {
        toast.success('Termin uspješno obrisan');
      }
      
      setDeleteDialogOpen(false);
      
      // Refresh based on current filter
      if (selectedExpertFilter) {
        fetchSlots(selectedExpertFilter);
      } else {
        fetchSlots();
      }
    } catch (error: any) {
      console.error('❌ Delete Error:', error.response?.data || error);
      
      // Bolji error handling
      const errorMessage = error.response?.data?.message || error.message;
      
      if (error.response?.status === 403) {
        toast.error('Nemate dozvolu da obrišete ovaj termin!');
      } else if (errorMessage.toLowerCase().includes('not found')) {
        toast.error('Termin nije pronađen ili je već obrisan.');
      } else if (selectedSlot.isBooked) {
        toast.error(
          `Greška pri brisanju rezervisanog termina: ${errorMessage}. ` +
          `Molimo kontaktirajte korisnika pre brisanja.`,
          { autoClose: 6000 }
        );
      } else {
        toast.error(`Greška pri brisanju termina: ${errorMessage}`);
      }
    }
  };

  const handleViewAppointments = async (slot) => {
    setSelectedSlot(slot);
    setAppointmentsDialogOpen(true);
    
    // Fetch appointment details if slot has appointment
    if (slot.appointment) {
      setSelectedSlotAppointments([slot.appointment]);
    } else if (slot.isBooked) {
      // If slot is booked but no appointment data, show message
      setSelectedSlotAppointments([]);
      toast.info('Detalji termina nisu dostupni');
    } else {
      setSelectedSlotAppointments([]);
    }
  };

  const toggleRow = (slotId: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [slotId]: !prev[slotId]
    }));
  };

  const canEditSlot = (slot) => {
    // Can edit only if not booked
    return !slot.isBooked;
  };

  const getExpertName = (doctorId: string) => {
    const expert = experts.find(e => e.id === doctorId);
    return expert ? expert.fullName : doctorId;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      
      return new Intl.DateTimeFormat('sr-Latn-ME', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      return 'N/A';
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header sa upozorenjem */}
      {slots.some(s => s.isBooked) && (
        <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 2 }}>
          <AlertTitle>Pažnja: Rezervisani termini</AlertTitle>
          Imate <strong>{slots.filter(s => s.isBooked).length}</strong> rezervisan{slots.filter(s => s.isBooked).length === 1 ? '' : 'ih'} termin{slots.filter(s => s.isBooked).length === 1 ? '' : 'a'}. 
          Izmena ili brisanje ovih termina će otkazati rezervacije korisnika.
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter po ekspertu</InputLabel>
              <Select
                value={selectedExpertFilter}
                label="Filter po ekspertu"
                onChange={(e) => handleExpertFilterChange(e.target.value)}
              >
                <MenuItem value="">Svi eksperti</MenuItem>
                {experts.map((expert) => (
                  <MenuItem key={expert.id} value={expert.id}>
                    {expert.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={9} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                if (selectedExpertFilter) {
                  fetchSlots(selectedExpertFilter);
                } else {
                  fetchSlots();
                }
              }}
            >
              Osveži
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreateDialog}
            >
              Novi Termin
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width="50px"></TableCell>
              <TableCell>Ekspert</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Početak</TableCell>
              <TableCell>Kraj</TableCell>
              <TableCell align="right">Akcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Učitavanje...</TableCell>
              </TableRow>
            ) : slots.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Nema termina</TableCell>
              </TableRow>
            ) : (
              slots.map((slot) => {
                const canEdit = canEditSlot(slot);
                const isExpanded = expandedRows[slot.id];

                return (
                  <React.Fragment key={slot.id}>
                    <TableRow 
                      sx={{ 
                        bgcolor: slot.isBooked ? 'error.light' : 'inherit',
                        '&:hover': {
                          bgcolor: slot.isBooked ? 'error.light' : 'action.hover',
                        }
                      }}
                    >
                      <TableCell>
                        {slot.isBooked ? (
                          <IconButton
                            size="small"
                            onClick={() => toggleRow(slot.id)}
                            color="error"
                          >
                            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        ) : (
                          <Box sx={{ width: 40, height: 40 }} />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={slot.isBooked ? 'bold' : 'normal'}>
                          {getExpertName(slot.doctorId)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                          <Chip 
                            label={slot.isBooked ? 'REZERVISAN' : 'Slobodan'} 
                            color={slot.isBooked ? "error" : "success"} 
                            size="small"
                            icon={slot.isBooked ? <PeopleIcon /> : undefined}
                          />
                          {slot.isBooked && slot.appointment?.user && (
                            <Chip 
                              label={slot.appointment.user.fullName}
                              variant="outlined"
                              color="error"
                              size="small"
                            />
                          )}
                          {slot.isBooked && (
                            <Button 
                              size="small" 
                              variant="outlined"
                              color="error"
                              onClick={() => handleViewAppointments(slot)}
                              startIcon={<PeopleIcon />}
                            >
                              Detalji
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{formatDate(slot.startAt)}</TableCell>
                      <TableCell>{formatDate(slot.endAt)}</TableCell>
                      <TableCell align="right">
                        <IconButton 
                          color="primary" 
                          onClick={() => handleOpenEditDialog(slot)}
                          disabled={!canEdit}
                          title={canEdit ? "Uredi" : "Ne može se urediti rezervisan termin"}
                          sx={{
                            opacity: canEdit ? 1 : 0.3,
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDeleteSlot(slot)}
                          sx={{
                            animation: slot.isBooked ? 'pulse 2s infinite' : 'none',
                            '@keyframes pulse': {
                              '0%, 100%': { opacity: 1 },
                              '50%': { opacity: 0.5 },
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded row showing appointment inline */}
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '2px solid', borderColor: 'error.main' }}>
                            <Typography variant="h6" gutterBottom component="div" color="error.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PeopleIcon /> Informacije o rezervaciji
                            </Typography>
                            {slot.appointment?.user ? (
                              <Box sx={{ mt: 2 }}>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 2, bgcolor: 'white' }}>
                                      <Typography variant="caption" color="text.secondary">
                                        👤 IME I PREZIME
                                      </Typography>
                                      <Typography variant="h6" fontWeight="bold">
                                        {slot.appointment.user.fullName}
                                      </Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 2, bgcolor: 'white' }}>
                                      <Typography variant="caption" color="text.secondary">
                                        📧 EMAIL ADRESA
                                      </Typography>
                                      <Typography variant="h6" fontWeight="bold">
                                        {slot.appointment.user.email}
                                      </Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 2, bgcolor: 'white' }}>
                                      <Typography variant="caption" color="text.secondary">
                                        📅 DATUM REZERVACIJE
                                      </Typography>
                                      <Typography variant="body1" fontWeight="bold">
                                        {formatDate(slot.appointment.createdAt)}
                                      </Typography>
                                    </Paper>
                                  </Grid>
                                  <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 2, bgcolor: 'white' }}>
                                      <Typography variant="caption" color="text.secondary">
                                        🆔 APPOINTMENT ID
                                      </Typography>
                                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                        {slot.appointment.id}
                                      </Typography>
                                    </Paper>
                                  </Grid>
                                </Grid>
                                
                                <Box sx={{ mt: 2, p: 1.5, bgcolor: 'warning.light', borderRadius: 1, border: '1px solid', borderColor: 'warning.main' }}>
                                  <Typography variant="body2" color="warning.dark">
                                    ⚠️ <strong>Napomena:</strong> Brisanjem ili izmenom ovog termina ćete otkazati rezervaciju korisnika!
                                  </Typography>
                                </Box>
                              </Box>
                            ) : (
                              <Typography color="text.secondary">
                                Detalji rezervacije nisu dostupni. Molimo kontaktirajte korisnika direktno.
                              </Typography>
                            )}
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
          
          {selectedSlot && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Termin:</strong> {formatDate(selectedSlot.startAt)} - {formatDate(selectedSlot.endAt)}
              </Typography>
            </Box>
          )}
          
          {selectedSlot && selectedSlot.isBooked && selectedSlot.appointment?.user && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', color: 'error.dark', borderRadius: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                ⚠️ UPOZORENJE: Ovaj termin je rezervisan!
              </Typography>
              <Divider sx={{ my: 1, bgcolor: 'error.main' }} />
              <Typography variant="body2">
                <strong>Korisnik:</strong> {selectedSlot.appointment.user.fullName}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {selectedSlot.appointment.user.email}
              </Typography>
              <Typography variant="body2">
                <strong>Rezervisano:</strong> {formatDate(selectedSlot.appointment.createdAt)}
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Brisanjem ovog termina ćete otkazati rezervaciju ovog korisnika!
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Otkaži</Button>
          <Button 
            onClick={handleConfirmDelete} 
            variant="contained" 
            color="error"
          >
            {selectedSlot?.isBooked ? 'Obriši i Otkaži Rezervaciju' : 'Obriši'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Appointments Dialog */}
      <Dialog 
        open={appointmentsDialogOpen} 
        onClose={() => setAppointmentsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PeopleIcon />
            Detalji rezervacije - {selectedSlot && formatDate(selectedSlot.startAt)}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedSlotAppointments.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <WarningIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Detalji rezervacije nisu dostupni
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Molimo kontaktirajte korisnika direktno ili proverite bazu podataka.
              </Typography>
            </Box>
          ) : (
            <Box>
              {selectedSlotAppointments.map((appointment, index) => (
                <Paper key={appointment.id} elevation={3} sx={{ p: 3, mb: 2 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="overline" color="text.secondary">
                        Informacije o korisniku
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          👤 IME I PREZIME
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight="bold">
                        {appointment.user?.fullName || 'N/A'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          📧 EMAIL ADRESA
                        </Typography>
                      </Box>
                      <Typography variant="h6" fontWeight="bold">
                        {appointment.user?.email || 'N/A'}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          📅 DATUM REZERVACIJE
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="bold">
                        {formatDate(appointment.createdAt)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          🆔 APPOINTMENT ID
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                        {appointment.id}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Korisnik {appointment.user?.fullName} je rezervisao termin kod eksperta {getExpertName(selectedSlot?.doctorId || '')}.
                  </Alert>
                </Paper>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAppointmentsDialogOpen(false)} variant="contained">
            Zatvori
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpertSlots;