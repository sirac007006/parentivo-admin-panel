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
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import {
  ForumCategoryService,
  ForumCategory,
} from '../services/apiService';

const ForumCategories: React.FC = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters
  const [nameFilter, setNameFilter] = useState('');

  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ForumCategory | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (nameFilter) params.name = nameFilter;

      const data = await ForumCategoryService.getForumCategories(params);
      setCategories(data);
    } catch (error: any) {
      toast.error('Greška pri učitavanju kategorija: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    fetchCategories();
  };

  const handleReset = () => {
    setNameFilter('');
    fetchCategories();
  };

  const handleOpenCreateDialog = () => {
    setIsEditing(false);
    setSelectedCategory(null);
    setFormName('');
    setFormDescription('');
    setFormDialogOpen(true);
  };

  const handleOpenEditDialog = (category: ForumCategory) => {
    setIsEditing(true);
    setSelectedCategory(category);
    setFormName(category.name);
    setFormDescription(category.description || '');
    setFormDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!formName.trim()) {
      toast.error('Naziv je obavezan');
      return;
    }

    try {
      if (isEditing && selectedCategory) {
        await ForumCategoryService.updateForumCategory(selectedCategory.id, {
          name: formName,
          description: formDescription,
        });
        toast.success('Kategorija uspješno ažurirana');
      } else {
        await ForumCategoryService.createForumCategory({
          name: formName,
          description: formDescription,
        });
        toast.success('Kategorija uspješno kreirana');
      }
      setFormDialogOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error('Greška pri čuvanju kategorije: ' + error.message);
    }
  };

  const handleDeleteCategory = (category: ForumCategory) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;

    try {
      await ForumCategoryService.deleteForumCategory(selectedCategory.id);
      toast.success('Kategorija uspješno obrisana');
      setDeleteDialogOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error('Greška pri brisanju kategorije: ' + error.message);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h4">Forum Kategorije</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          Nova Kategorija
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={10}>
            <TextField
              fullWidth
              label="Pretraži po nazivu"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
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
              <TableCell>ID</TableCell>
              <TableCell>Naziv</TableCell>
              <TableCell align="right">Akcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Učitavanje...
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Nema kategorija
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenEditDialog(category)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteCategory(category)}
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

      {/* Form Dialog */}
      <Dialog
        open={formDialogOpen}
        onClose={() => setFormDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? 'Uredi Kategoriju' : 'Nova Kategorija'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Naziv *"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Opis"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleSaveCategory} variant="contained">
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
            Da li ste sigurni da želite obrisati kategoriju{' '}
            <strong>{selectedCategory?.name}</strong>?
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

export default ForumCategories;
