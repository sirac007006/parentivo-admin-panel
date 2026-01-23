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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  School as SchoolIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import {
  UserService,
  SpecializationService,
  User,
  Specialization,
} from '../services/apiService';

const Experts: React.FC = () => {
  const [experts, setExperts] = useState<User[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [fullNameFilter, setFullNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('');

  // Dialog states
  const [specializationDialogOpen, setSpecializationDialogOpen] =
    useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<User | null>(null);
  const [selectedSpecializationId, setSelectedSpecializationId] = useState('');

  const fetchExperts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (fullNameFilter) params.fullName = fullNameFilter;
      if (emailFilter) params.email = emailFilter;
      if (specializationFilter) params.specializationId = specializationFilter;

      const data = await UserService.getExperts(params);
      setExperts(data);
    } catch (error: any) {
      toast.error('Greška pri učitavanju eksperata: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const data = await SpecializationService.getSpecializations();
      setSpecializations(data);
    } catch (error: any) {
      toast.error(
        'Greška pri učitavanju specijalizacija: ' + error.message
      );
    }
  };

  useEffect(() => {
    fetchExperts();
    fetchSpecializations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    fetchExperts();
  };

  const handleReset = () => {
    setFullNameFilter('');
    setEmailFilter('');
    setSpecializationFilter('');
    fetchExperts();
  };

  const handleSetSpecialization = (expert: User) => {
    setSelectedExpert(expert);
    setSelectedSpecializationId(expert.specializationId || '');
    setSpecializationDialogOpen(true);
  };

  const handleSaveSpecialization = async () => {
    if (!selectedExpert || !selectedSpecializationId) return;

    try {
      await SpecializationService.setUserSpecialization(
        selectedExpert.id,
        selectedSpecializationId
      );
      toast.success('Specijalizacija uspješno postavljena');
      setSpecializationDialogOpen(false);
      fetchExperts();
    } catch (error: any) {
      toast.error('Greška pri postavljanju specijalizacije: ' + error.message);
    }
  };

  const handleDeleteExpert = (expert: User) => {
    setSelectedExpert(expert);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedExpert) return;

    try {
      await UserService.deleteUser(selectedExpert.id);
      toast.success('Ekspert uspješno obrisan');
      setDeleteDialogOpen(false);
      fetchExperts();
    } catch (error: any) {
      toast.error('Greška pri brisanju eksperta: ' + error.message);
    }
  };

  const getSpecializationName = (specializationId: string | null | undefined) => {
    if (!specializationId) return 'Nije postavljeno';
    const spec = specializations.find((s) => s.id === specializationId);
    return spec?.name || 'Nepoznato';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Eksperti
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Ime i prezime"
              value={fullNameFilter}
              onChange={(e) => setFullNameFilter(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Email"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Specijalizacija</InputLabel>
              <Select
                value={specializationFilter}
                label="Specijalizacija"
                onChange={(e) => setSpecializationFilter(e.target.value)}
              >
                <MenuItem value="">Sve</MenuItem>
                {specializations.map((spec) => (
                  <MenuItem key={spec.id} value={spec.id}>
                    {spec.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
              >
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
              <TableCell>Ime i prezime</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Specijalizacija</TableCell>
              <TableCell>Verifikovan</TableCell>
              <TableCell>Kreiran</TableCell>
              <TableCell align="right">Akcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Učitavanje...
                </TableCell>
              </TableRow>
            ) : experts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nema eksperata
                </TableCell>
              </TableRow>
            ) : (
              experts.map((expert) => (
                <TableRow key={expert.id}>
                  <TableCell>{expert.fullName}</TableCell>
                  <TableCell>{expert.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={getSpecializationName(expert.specializationId)}
                      color={expert.specializationId ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={expert.verified ? 'Da' : 'Ne'}
                      color={expert.verified ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(expert.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleSetSpecialization(expert)}
                      title="Postavi specijalizaciju"
                    >
                      <SchoolIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteExpert(expert)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Specialization Dialog */}
      <Dialog
        open={specializationDialogOpen}
        onClose={() => setSpecializationDialogOpen(false)}
      >
        <DialogTitle>Postavi Specijalizaciju</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, minWidth: 300 }}>
            <Typography variant="body2" gutterBottom>
              Ekspert: {selectedExpert?.fullName}
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Specijalizacija</InputLabel>
              <Select
                value={selectedSpecializationId}
                label="Specijalizacija"
                onChange={(e) => setSelectedSpecializationId(e.target.value)}
              >
                <MenuItem value="">Nije postavljeno</MenuItem>
                {specializations.map((spec) => (
                  <MenuItem key={spec.id} value={spec.id}>
                    {spec.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSpecializationDialogOpen(false)}>
            Otkaži
          </Button>
          <Button onClick={handleSaveSpecialization} variant="contained">
            Sačuvaj
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Potvrda Brisanja</DialogTitle>
        <DialogContent>
          <Typography>
            Da li ste sigurni da želite obrisati eksperta{' '}
            <strong>{selectedExpert?.fullName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Otkaži</Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Obriši
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Experts;
