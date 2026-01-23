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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { apiClient } from '../services/authService';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [titleFilter, setTitleFilter] = useState('');
  const [speakerNameFilter, setSpeakerNameFilter] = useState('');
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [startDialogOpen, setStartDialogOpen] = useState(false);
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSpeakerName, setFormSpeakerName] = useState('');
  const [formSpeakerBio, setFormSpeakerBio] = useState('');
  const [formScheduledAt, setFormScheduledAt] = useState('');
  const [formIsLive, setFormIsLive] = useState('false');
  const [formIsActive, setFormIsActive] = useState('false');

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (titleFilter) params.title = titleFilter;
      if (speakerNameFilter) params.speakerName = speakerNameFilter;

      const response = await apiClient.get('/meetings/admin', { params });
      setMeetings(response.data);
    } catch (error) {
      toast.error('Greška pri učitavanju radionica: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => fetchMeetings();
  const handleReset = () => {
    setTitleFilter('');
    setSpeakerNameFilter('');
    fetchMeetings();
  };

  const handleOpenCreateDialog = () => {
    setIsEditing(false);
    setSelectedMeeting(null);
    setFormTitle('');
    setFormDescription('');
    setFormSpeakerName('');
    setFormSpeakerBio('');
    setFormScheduledAt('');
    setFormIsLive('false');
    setFormIsActive('false');
    setFormDialogOpen(true);
  };

  const handleOpenEditDialog = (meeting) => {
    setIsEditing(true);
    setSelectedMeeting(meeting);
    setFormTitle(meeting.title || '');
    setFormDescription(meeting.description || '');
    setFormSpeakerName(meeting.speakerName || '');
    setFormSpeakerBio(meeting.speakerBio || '');
    setFormIsLive(meeting.isLive ? 'true' : 'false');
    setFormIsActive(meeting.isActive ? 'true' : 'false');

    // Defensively handle scheduledAt date
    if (meeting.scheduledAt && meeting.scheduledAt !== 'Invalid Date') {
      try {
        const date = new Date(meeting.scheduledAt);
        if (!isNaN(date.getTime())) {
          setFormScheduledAt(date.toISOString().slice(0, 16));
        } else {
          setFormScheduledAt('');
        }
      } catch (e) {
        setFormScheduledAt('');
      }
    } else {
      setFormScheduledAt('');
    }

    setFormDialogOpen(true);
  };

  const handleSaveMeeting = async () => {
    if (!formTitle.trim() || !formSpeakerName.trim() || !formScheduledAt) {
      toast.error('Naslov, ime predavača i planirano vrijeme su obavezni');
      return;
    }

    const scheduledDate = new Date(formScheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      toast.error('Nevažeći datum');
      return;
    }

    const payload = {
      title: formTitle,
      description: formDescription || '',
      speakerName: formSpeakerName,
      speakerBio: formSpeakerBio || '',
      scheduledAt: scheduledDate.toISOString(),
      isLive: formIsLive === 'true',
      isActive: formIsActive === 'true',
    };

    try {
      if (isEditing && selectedMeeting) {
        // PATCH /meetings/{id}
        await apiClient.patch(`/meetings/${selectedMeeting.id}`, payload);
        toast.success('Radionica uspješno ažurirana');
      } else {
        // POST /meetings
        await apiClient.post('/meetings', payload);
        toast.success('Radionica uspješno kreirana');
      }
      setFormDialogOpen(false);
      fetchMeetings();
    } catch (error) {
      toast.error('Greška: ' + error.message);
    }
  };

  const handleDeleteMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMeeting) return;
    try {
      await apiClient.delete(`/meetings/${selectedMeeting.id}`);
      toast.success('Radionica uspješno obrisana');
      setDeleteDialogOpen(false);
      fetchMeetings();
    } catch (error) {
      toast.error('Greška pri brisanju: ' + error.message);
    }
  };

  const handleStartMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setStartDialogOpen(true);
  };

  const handleConfirmStart = async () => {
    if (!selectedMeeting) return;
    try {
      await apiClient.post(`/meetings/${selectedMeeting.id}/start`);
      toast.success('Radionica pokrenuta');
      setStartDialogOpen(false);
      fetchMeetings();
    } catch (error) {
      toast.error('Greška: ' + error.message);
    }
  };

  const handleEndMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setEndDialogOpen(true);
  };

  const handleConfirmEnd = async () => {
    if (!selectedMeeting) return;
    try {
      await apiClient.post(`/meetings/${selectedMeeting.id}/end`);
      toast.success('Radionica završena');
      setEndDialogOpen(false);
      fetchMeetings();
    } catch (error) {
      toast.error('Greška: ' + error.message);
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
        <Typography variant="h4">Online Radionice</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateDialog}>
          Nova Radionica
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Pretraži po naslovu"
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              label="Pretraži po predavaču"
              value={speakerNameFilter}
              onChange={(e) => setSpeakerNameFilter(e.target.value)}
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

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Naslov</TableCell>
              <TableCell>Predavač</TableCell>
              <TableCell>Planirano</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Akcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Učitavanje...</TableCell>
              </TableRow>
            ) : meetings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Nema radionica</TableCell>
              </TableRow>
            ) : (
              meetings.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell>{meeting.title}</TableCell>
                  <TableCell>{meeting.speakerName}</TableCell>
                  <TableCell>{formatDate(meeting.scheduledAt)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {meeting.isLive && <Chip label="LIVE" color="success" size="small" />}
                      {meeting.isActive && <Chip label="Active" color="primary" size="small" />}
                      {!meeting.isLive && !meeting.isActive && <Chip label="Inactive" size="small" />}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    {!meeting.isLive && meeting.isActive && (
                      <IconButton color="success" onClick={() => handleStartMeeting(meeting)} title="Pokreni">
                        <StartIcon />
                      </IconButton>
                    )}
                    {meeting.isLive && (
                      <IconButton color="warning" onClick={() => handleEndMeeting(meeting)} title="Završi">
                        <StopIcon />
                      </IconButton>
                    )}
                    <IconButton color="primary" onClick={() => handleOpenEditDialog(meeting)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteMeeting(meeting)}>
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
      <Dialog open={formDialogOpen} onClose={() => setFormDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{isEditing ? 'Uredi Radionicu' : 'Nova Radionica'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Naslov *"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
            />
            <TextField
              fullWidth
              label="Opis"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Ime predavača *"
              value={formSpeakerName}
              onChange={(e) => setFormSpeakerName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Biografija predavača"
              value={formSpeakerBio}
              onChange={(e) => setFormSpeakerBio(e.target.value)}
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              type="datetime-local"
              label="Planirano vrijeme *"
              value={formScheduledAt}
              onChange={(e) => setFormScheduledAt(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Stanje radionice</InputLabel>
              <Select value={formIsLive} onChange={(e) => setFormIsLive(e.target.value)} label="Stanje radionice">
                <MenuItem value="false">Nije uživo</MenuItem>
                <MenuItem value="true">Uživo</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Vidljivost radionice</InputLabel>
              <Select value={formIsActive} onChange={(e) => setFormIsActive(e.target.value)} label="Vidljivost radionice">
                <MenuItem value="false">Neaktivna</MenuItem>
                <MenuItem value="true">Aktivna</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleSaveMeeting} variant="contained">Sačuvaj</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Potvrda Brisanja</DialogTitle>
        <DialogContent>
          <Typography>Da li ste sigurni da želite obrisati radionicu <strong>{selectedMeeting?.title}</strong>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">Obriši</Button>
        </DialogActions>
      </Dialog>

      {/* Start Dialog */}
      <Dialog open={startDialogOpen} onClose={() => setStartDialogOpen(false)}>
        <DialogTitle>Pokreni Radionicu</DialogTitle>
        <DialogContent>
          <Typography>Da li želite pokrenuti radionicu <strong>{selectedMeeting?.title}</strong>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStartDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleConfirmStart} variant="contained" color="success">Pokreni</Button>
        </DialogActions>
      </Dialog>

      {/* End Dialog */}
      <Dialog open={endDialogOpen} onClose={() => setEndDialogOpen(false)}>
        <DialogTitle>Završi Radionicu</DialogTitle>
        <DialogContent>
          <Typography>Da li želite završiti radionicu <strong>{selectedMeeting?.title}</strong>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEndDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleConfirmEnd} variant="contained" color="warning">Završi</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Meetings;
