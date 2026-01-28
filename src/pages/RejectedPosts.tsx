// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Visibility as VisibilityIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { ReportService } from '../services/apiService';

const RejectedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchRejectedPosts = async () => {
    setLoading(true);
    try {
      const data = await ReportService.getRejectedPosts();
      setPosts(data);
    } catch (error: any) {
      toast.error('Greška pri učitavanju odbijenih postova: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRejectedPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAcceptPost = (post) => {
    setSelectedPost(post);
    setAcceptDialogOpen(true);
  };

  const handleDeletePost = (post) => {
    setSelectedPost(post);
    setDeleteDialogOpen(true);
  };

  const handleViewPost = (post) => {
    setSelectedPost(post);
    setViewDialogOpen(true);
  };

  const handleConfirmAccept = async () => {
    if (!selectedPost) return;
    try {
      await ReportService.changePostStatus(selectedPost.id, 'ACCEPTED');
      toast.success('Post uspješno prihvaćen');
      setAcceptDialogOpen(false);
      fetchRejectedPosts();
    } catch (error: any) {
      toast.error('Greška pri prihvatanju posta: ' + error.message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedPost) return;
    try {
      await ReportService.deleteForumPost(selectedPost.id);
      toast.success('Post uspješno obrisan');
      setDeleteDialogOpen(false);
      fetchRejectedPosts();
    } catch (error: any) {
      toast.error('Greška pri brisanju posta: ' + error.message);
    }
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Odbijeni Postovi</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Lista svih postova koji su odbijeni od strane administratora
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Naslov</TableCell>
              <TableCell>Sadržaj</TableCell>
              <TableCell>Autor</TableCell>
              <TableCell>Kategorija</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Datum odbijanja</TableCell>
              <TableCell align="right">Akcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8} align="center">Učitavanje...</TableCell></TableRow>
            ) : posts.length === 0 ? (
              <TableRow><TableCell colSpan={8} align="center">Nema odbijenih postova</TableCell></TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell><Chip label={post.id} size="small" /></TableCell>
                  <TableCell>{truncateText(post.title)}</TableCell>
                  <TableCell>{truncateText(post.content)}</TableCell>
                  <TableCell>{post.user?.fullName || post.userId}</TableCell>
                  <TableCell>{post.category?.name || '-'}</TableCell>
                  <TableCell><Chip label="REJECTED" size="small" color="error" /></TableCell>
                  <TableCell>{new Date(post.updatedAt).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton color="info" onClick={() => handleViewPost(post)} title="Pogledaj detalje"><VisibilityIcon /></IconButton>
                    <IconButton color="success" onClick={() => handleAcceptPost(post)} title="Prihvati post"><CheckCircleIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDeletePost(post)} title="Obriši post"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalji Odbijenog Posta</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Autor:</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{selectedPost?.user?.fullName || selectedPost?.userId || '-'}</Typography>

            <Typography variant="subtitle2" gutterBottom>Kategorija:</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{selectedPost?.category?.name || '-'}</Typography>

            <Typography variant="subtitle2" gutterBottom>Naslov:</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{selectedPost?.title || '-'}</Typography>

            <Typography variant="subtitle2" gutterBottom>Sadržaj:</Typography>
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body1">{selectedPost?.content || '-'}</Typography>
            </Paper>

            <Typography variant="subtitle2" gutterBottom>Status:</Typography>
            <Box sx={{ mb: 2 }}>
              <Chip label="REJECTED" size="small" color="error" />
            </Box>

            <Typography variant="subtitle2" gutterBottom>Datum Odbijanja:</Typography>
            <Typography variant="body1">{selectedPost?.updatedAt ? new Date(selectedPost.updatedAt).toLocaleString() : '-'}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Zatvori</Button>
        </DialogActions>
      </Dialog>

      {/* Accept Confirmation Dialog */}
      <Dialog open={acceptDialogOpen} onClose={() => setAcceptDialogOpen(false)}>
        <DialogTitle>Potvrda Prihvatanja Posta</DialogTitle>
        <DialogContent>
          <Typography>
            Da li ste sigurni da želite prihvatiti post <strong>"{selectedPost?.title}"</strong>? 
            Post će biti prebačen u status "ACCEPTED" i biće vidljiv korisnicima.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAcceptDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleConfirmAccept} variant="contained" color="success">Prihvati Post</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Potvrda Brisanja Posta</DialogTitle>
        <DialogContent>
          <Typography>
            Da li ste sigurni da želite trajno obrisati post <strong>"{selectedPost?.title}"</strong>? 
            Ova akcija je nepovratna.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">Obriši Post</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RejectedPosts;