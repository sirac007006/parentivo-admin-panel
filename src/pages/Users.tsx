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
  Edit as EditIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { UserService, User } from '../services/apiService';
import { USER_ROLES } from '../config';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [fullNameFilter, setFullNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (fullNameFilter) params.fullName = fullNameFilter;
      if (emailFilter) params.email = emailFilter;
      if (roleFilter) params.role = roleFilter;
      if (verifiedFilter) params.verified = verifiedFilter === 'true';

      const data = await UserService.getUsers(params);
      setUsers(data);
    } catch (error: any) {
      toast.error('Greška pri učitavanju korisnika: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    fetchUsers();
  };

  const handleReset = () => {
    setFullNameFilter('');
    setEmailFilter('');
    setRoleFilter('');
    setVerifiedFilter('');
    fetchUsers();
  };

  const handleEditRole = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setEditDialogOpen(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;

    try {
      await UserService.changeUserRole(selectedUser.id, newRole);
      toast.success('Rola uspješno promijenjena');
      setEditDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error('Greška pri promjeni role: ' + error.message);
    }
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      await UserService.deleteUser(selectedUser.id);
      toast.success('Korisnik uspješno obrisan');
      setDeleteDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast.error('Greška pri brisanju korisnika: ' + error.message);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case USER_ROLES.SUPERADMIN:
        return 'error';
      case USER_ROLES.ADMIN:
        return 'warning';
      case USER_ROLES.EXPERT:
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Korisnici
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
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Rola</InputLabel>
              <Select
                value={roleFilter}
                label="Rola"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="">Sve</MenuItem>
                <MenuItem value={USER_ROLES.SUPERADMIN}>SUPERADMIN</MenuItem>
                <MenuItem value={USER_ROLES.ADMIN}>ADMIN</MenuItem>
                <MenuItem value={USER_ROLES.EXPERT}>EXPERT</MenuItem>
                <MenuItem value={USER_ROLES.USER}>USER</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Verifikovan</InputLabel>
              <Select
                value={verifiedFilter}
                label="Verifikovan"
                onChange={(e) => setVerifiedFilter(e.target.value)}
              >
                <MenuItem value="">Svi</MenuItem>
                <MenuItem value="true">Da</MenuItem>
                <MenuItem value="false">Ne</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={2}>
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
              <TableCell>Rola</TableCell>
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
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nema korisnika
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.verified ? 'Da' : 'Ne'}
                      color={user.verified ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditRole(user)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteUser(user)}
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

      {/* Edit Role Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Promijeni Rolu</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, minWidth: 300 }}>
            <Typography variant="body2" gutterBottom>
              Korisnik: {selectedUser?.fullName}
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Nova Rola</InputLabel>
              <Select
                value={newRole}
                label="Nova Rola"
                onChange={(e) => setNewRole(e.target.value)}
              >
                <MenuItem value={USER_ROLES.SUPERADMIN}>SUPERADMIN</MenuItem>
                <MenuItem value={USER_ROLES.ADMIN}>ADMIN</MenuItem>
                <MenuItem value={USER_ROLES.EXPERT}>EXPERT</MenuItem>
                <MenuItem value={USER_ROLES.USER}>USER</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleSaveRole} variant="contained">
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
            Da li ste sigurni da želite obrisati korisnika{' '}
            <strong>{selectedUser?.fullName}</strong>?
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

export default Users;
