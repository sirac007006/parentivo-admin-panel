// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid, Chip } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon, PlayArrow as StartIcon, Stop as StopIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { MeetingService, Meeting } from '../services/apiService';

const Meetings: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [titleFilter, setTitleFilter] = useState('');
  const [speakerNameFilter, setSpeakerNameFilter] = useState('');
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSpeakerName, setFormSpeakerName] = useState('');
  const [formStartFrom, setFormStartFrom] = useState('');
  const [formStartTo, setFormStartTo] = useState('');

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (titleFilter) params.title = titleFilter;
      if (speakerNameFilter) params.speakerName = speakerNameFilter;
      const data = await MeetingService.getMeetingsAdmin(params);
      setMeetings(data);
    } catch (error: any) {
      toast.error('Greška pri učitavanju online radionica: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
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
    setFormStartFrom('');
    setFormStartTo('');
    setFormDialogOpen(true);
  };

  const handleOpenEditDialog = (meeting: Meeting) => {
    setIsEditing(true);
    setSelectedMeeting(meeting);
    setFormTitle(meeting.title);
    setFormDescription(meeting.description || '');
    setFormSpeakerName(meeting.speakerName);
    setFormStartFrom(meeting.startFrom.slice(0, 16));
    setFormStartTo(meeting.startTo.slice(0, 16));
    setFormDialogOpen(true);
  };

  const handleSaveMeeting = async () => {
    if (!formTitle.trim() || !formSpeakerName.trim() || !formStartFrom || !formStartTo) {
      toast.error('Sva obavezna polja moraju biti popunjena');
      return;
    }
    try {
      if (isEditing && selectedMeeting) {
        await MeetingService.updateMeeting(selectedMeeting.id, {
          title: formTitle,
          description: formDescription,
          speakerName: formSpeakerName,
          startFrom: formStartFrom,
          startTo: formStartTo,
        });
        toast.success('Online radionica uspješno ažurirana');
      } else {
        await MeetingService.createMeeting({
          title: formTitle,
          description: formDescription,
          speakerName: formSpeakerName,
          startFrom: formStartFrom,
          startTo: formStartTo,
        });
        toast.success('Online radionica uspješno kreirana');
      }
      setFormDialogOpen(false);
      fetchMeetings();
    } catch (error: any) {
      toast.error('Greška pri čuvanju online radionice: ' + error.message);
    }
  };

  const handleStartMeeting = async (meeting: Meeting) => {
    try {
      await MeetingService.startMeeting(meeting.id);
      toast.success('Online radionica pokrenuta');
      fetchMeetings();
    } catch (error: any) {
      toast.error('Greška pri pokretanju online radionice: ' + error.message);
    }
  };

  const handleEndMeeting = async (meeting: Meeting) => {
    try {
      await MeetingService.endMeeting(meeting.id);
      toast.success('Online radionica završena');
      fetchMeetings();
    } catch (error: any) {
      toast.error('Greška pri završavanju online radionice: ' + error.message);
    }
  };

  const handleDeleteMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMeeting) return;
    try {
      await MeetingService.deleteMeeting(selectedMeeting.id);
      toast.success('Online radionica uspješno obrisana');
      setDeleteDialogOpen(false);
      fetchMeetings();
    } catch (error: any) {
      toast.error('Greška pri brisanju online radionice: ' + error.message);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Online Radionice</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreateDialog}>
          Nova Radionica
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <TextField fullWidth label="Pretraži po naslovu" value={titleFilter} onChange={(e) => setTitleFilter(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField fullWidth label="Pretraži po predavaču" value={speakerNameFilter} onChange={(e) => setSpeakerNameFilter(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button fullWidth variant="contained" onClick={handleSearch} disabled={loading}>Pretraži</Button>
              <IconButton onClick={handleReset} color="default"><RefreshIcon /></IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Naslov</TableCell>
              <TableCell>Predavač</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Početak</TableCell>
              <TableCell>Kraj</TableCell>
              <TableCell align="right">Akcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} align="center">Učitavanje...</TableCell></TableRow>
            ) : meetings.length === 0 ? (
              <TableRow><TableCell colSpan={6} align="center">Nema online radionica</TableCell></TableRow>
            ) : (
              meetings.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell>{meeting.title}</TableCell>
                  <TableCell>{meeting.speakerName}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Chip label={meeting.isActive ? 'Aktivna' : 'Neaktivna'} color={meeting.isActive ? 'success' : 'default'} size="small" />
                      {meeting.isLive && <Chip label="LIVE" color="error" size="small" />}
                    </Box>
                  </TableCell>
                  <TableCell>{new Date(meeting.startFrom).toLocaleString()}</TableCell>
                  <TableCell>{new Date(meeting.startTo).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    {!meeting.isLive && meeting.isActive && (
                      <IconButton color="success" onClick={() => handleStartMeeting(meeting)} title="Pokreni"><StartIcon /></IconButton>
                    )}
                    {meeting.isLive && (
                      <IconButton color="warning" onClick={() => handleEndMeeting(meeting)} title="Završi"><StopIcon /></IconButton>
                    )}
                    <IconButton color="primary" onClick={() => handleOpenEditDialog(meeting)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDeleteMeeting(meeting)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={formDialogOpen} onClose={() => setFormDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Uredi Online Radionicu' : 'Nova Online Radionica'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField fullWidth label="Naslov *" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="Opis" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} multiline rows={3} sx={{ mb: 2 }} />
            <TextField fullWidth label="Predavač *" value={formSpeakerName} onChange={(e) => setFormSpeakerName(e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="Početak *" type="datetime-local" value={formStartFrom} onChange={(e) => setFormStartFrom(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
            <TextField fullWidth label="Kraj *" type="datetime-local" value={formStartTo} onChange={(e) => setFormStartTo(e.target.value)} InputLabelProps={{ shrink: true }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleSaveMeeting} variant="contained">Sačuvaj</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Potvrda Brisanja</DialogTitle>
        <DialogContent><Typography>Da li ste sigurni da želite obrisati online radionicu <strong>{selectedMeeting?.title}</strong>?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">Obriši</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Meetings;
