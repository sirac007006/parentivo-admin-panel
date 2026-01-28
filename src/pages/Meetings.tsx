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
  Avatar,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  CloudUpload as UploadIcon,
  Visibility as VisibilityIcon,
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
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSpeakerName, setFormSpeakerName] = useState('');
  const [formSpeakerBio, setFormSpeakerBio] = useState('');
  const [formScheduledAt, setFormScheduledAt] = useState('');
  const [formImage, setFormImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Molimo odaberite sliku (jpg, png, gif, webp)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Slika ne smije biti veća od 5MB');
        return;
      }

      setFormImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormImage(null);
    setImagePreview(null);
  };

  const handleOpenCreateDialog = () => {
    setIsEditing(false);
    setSelectedMeeting(null);
    setFormTitle('');
    setFormDescription('');
    setFormSpeakerName('');
    setFormSpeakerBio('');
    setFormScheduledAt('');
    setFormImage(null);
    setImagePreview(null);
    setExistingImage(null);
    setFormDialogOpen(true);
  };

  const handleOpenEditDialog = (meeting) => {
    // Provjeri da li je sastanak završen, neaktivan ili uživo
    if (!meeting.isActive || meeting.isLive) {
      toast.warning('Ne možete urediti završenu, neaktivnu ili uživo radionicu');
      return;
    }

    setIsEditing(true);
    setSelectedMeeting(meeting);
    setFormTitle(meeting.title || '');
    setFormDescription(meeting.description || '');
    setFormSpeakerName(meeting.speakerName || '');
    setFormSpeakerBio(meeting.speakerBio || '');
    setFormImage(null);
    setImagePreview(null);
    setExistingImage(meeting.thumbnailUrl || null);

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

  const handleViewMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setViewDialogOpen(true);
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

    // Validate that scheduled date is not in the past
    const now = new Date();
    if (scheduledDate < now) {
      toast.error('Radionica ne može biti zakazana u prošlosti');
      return;
    }

    // Create FormData for multipart/form-data
    const formData = new FormData();
    formData.append('title', formTitle);
    formData.append('description', formDescription || '');
    formData.append('speakerName', formSpeakerName);
    formData.append('speakerBio', formSpeakerBio || '');
    formData.append('scheduledAt', scheduledDate.toISOString());
    
    if (formImage) {
      formData.append('image', formImage);
    }

    try {
      if (isEditing && selectedMeeting) {
        // PATCH /meetings/{id}
        await apiClient.patch(`/meetings/${selectedMeeting.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Radionica uspješno ažurirana');
      } else {
        // POST /meetings
        await apiClient.post('/meetings', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
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

  // Helper function to check if meeting can be edited
  const canEditMeeting = (meeting) => {
    return meeting.isActive && !meeting.isLive;
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
              <TableCell>Slika</TableCell>
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
                <TableCell colSpan={6} align="center">Učitavanje...</TableCell>
              </TableRow>
            ) : meetings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Nema radionica</TableCell>
              </TableRow>
            ) : (
              meetings.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell>
                    <Avatar 
                      src={meeting.thumbnailUrl} 
                      alt={meeting.title}
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    />
                  </TableCell>
                  <TableCell>{meeting.title}</TableCell>
                  <TableCell>{meeting.speakerName}</TableCell>
                  <TableCell>{formatDate(meeting.scheduledAt)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {meeting.isLive && <Chip label="UŽIVO" color="success" size="small" />}
                      {meeting.isActive && !meeting.isLive && <Chip label="Aktivna" color="primary" size="small" />}
                      {!meeting.isLive && !meeting.isActive && <Chip label="Završena" color="default" size="small" />}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="info" onClick={() => handleViewMeeting(meeting)} title="Pogledaj detalje">
                      <VisibilityIcon />
                    </IconButton>
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
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpenEditDialog(meeting)}
                      disabled={!canEditMeeting(meeting)}
                      title={canEditMeeting(meeting) ? "Uredi" : "Ne može se urediti uživo ili završena radionica"}
                    >
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

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalji Radionice</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {selectedMeeting?.thumbnailUrl && (
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <Avatar 
                  src={selectedMeeting.thumbnailUrl} 
                  alt={selectedMeeting.title}
                  variant="rounded"
                  sx={{ width: '100%', maxWidth: 500, height: 300 }}
                />
              </Box>
            )}

            <Typography variant="subtitle2" gutterBottom>Naslov:</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{selectedMeeting?.title || '-'}</Typography>

            <Typography variant="subtitle2" gutterBottom>Opis:</Typography>
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body1">{selectedMeeting?.description || '-'}</Typography>
            </Paper>

            <Typography variant="subtitle2" gutterBottom>Predavač:</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{selectedMeeting?.speakerName || '-'}</Typography>

            <Typography variant="subtitle2" gutterBottom>Biografija Predavača:</Typography>
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body1">{selectedMeeting?.speakerBio || '-'}</Typography>
            </Paper>

            <Typography variant="subtitle2" gutterBottom>Planirano vrijeme:</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{selectedMeeting?.scheduledAt ? formatDate(selectedMeeting.scheduledAt) : '-'}</Typography>

            <Typography variant="subtitle2" gutterBottom>Status:</Typography>
            <Box sx={{ mb: 2 }}>
              {selectedMeeting?.isLive && <Chip label="UŽIVO" color="success" size="small" />}
              {selectedMeeting?.isActive && !selectedMeeting?.isLive && <Chip label="Aktivna" color="primary" size="small" />}
              {!selectedMeeting?.isLive && !selectedMeeting?.isActive && <Chip label="Završena" color="default" size="small" />}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Zatvori</Button>
        </DialogActions>
      </Dialog>

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
              inputProps={{ min: getMinDateTime() }}
            />

            {/* Image Upload */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Slika radionice (opciono)
              </Typography>
              
              {/* Show existing image when editing */}
              {isEditing && existingImage && !imagePreview && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Trenutna slika:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                    <Avatar 
                      src={existingImage} 
                      alt="Current"
                      variant="rounded"
                      sx={{ width: 120, height: 120 }}
                    />
                  </Box>
                </Box>
              )}

              {/* Show new image preview */}
              {imagePreview && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Nova slika:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                    <Avatar 
                      src={imagePreview} 
                      alt="Preview"
                      variant="rounded"
                      sx={{ width: 120, height: 120 }}
                    />
                    <Button 
                      variant="outlined" 
                      color="error" 
                      size="small"
                      onClick={handleRemoveImage}
                    >
                      Ukloni novu sliku
                    </Button>
                  </Box>
                </Box>
              )}

              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
              >
                {imagePreview ? 'Promijeni sliku' : (isEditing && existingImage ? 'Zamijeni sliku' : 'Dodaj sliku')}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                Podržani formati: JPG, PNG, GIF, WebP (max 5MB). Ako ne odaberete sliku, koristiće se {isEditing && existingImage ? 'trenutna' : 'default'} slika.
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary">
              * Status radionice (uživo/aktivna) se automatski postavlja od strane sistema. 
              Koristite dugmad "Pokreni" i "Završi" za upravljanje statusom radionice.
            </Typography>
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