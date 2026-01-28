// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { CheckCircle as CheckCircleIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { ReportService } from '../services/apiService';

const RejectedComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);

  const fetchRejectedComments = async () => {
    setLoading(true);
    try {
      const data = await ReportService.getRejectedComments();
      setComments(data);
    } catch (error: any) {
      toast.error('Greška pri učitavanju odbijenih komentara: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRejectedComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAcceptComment = (comment) => {
    setSelectedComment(comment);
    setAcceptDialogOpen(true);
  };

  const handleViewComment = (comment) => {
    setSelectedComment(comment);
    setViewDialogOpen(true);
  };

  const handleConfirmAccept = async () => {
    if (!selectedComment) return;
    try {
      await ReportService.changeCommentStatus(selectedComment.id, 'ACCEPTED');
      toast.success('Komentar uspješno prihvaćen');
      setAcceptDialogOpen(false);
      fetchRejectedComments();
    } catch (error: any) {
      toast.error('Greška pri prihvatanju komentara: ' + error.message);
    }
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Odbijeni Komentari</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Lista svih komentara koji su odbijeni od strane administratora
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Sadržaj</TableCell>
              <TableCell>Autor</TableCell>
              <TableCell>Post ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Datum odbijanja</TableCell>
              <TableCell align="right">Akcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} align="center">Učitavanje...</TableCell></TableRow>
            ) : comments.length === 0 ? (
              <TableRow><TableCell colSpan={7} align="center">Nema odbijenih komentara</TableCell></TableRow>
            ) : (
              comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell><Chip label={comment.id} size="small" /></TableCell>
                  <TableCell>{truncateText(comment.content)}</TableCell>
                  <TableCell>{comment.user?.fullName || comment.userId}</TableCell>
                  <TableCell><Chip label={comment.postId} size="small" /></TableCell>
                  <TableCell><Chip label="REJECTED" size="small" color="error" /></TableCell>
                  <TableCell>{new Date(comment.updatedAt).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton color="info" onClick={() => handleViewComment(comment)} title="Pogledaj detalje"><VisibilityIcon /></IconButton>
                    <IconButton color="success" onClick={() => handleAcceptComment(comment)} title="Prihvati komentar"><CheckCircleIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalji Odbijenog Komentara</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Autor:</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{selectedComment?.user?.fullName || selectedComment?.userId || '-'}</Typography>

            <Typography variant="subtitle2" gutterBottom>Post ID:</Typography>
            <Box sx={{ mb: 2 }}>
              <Chip label={selectedComment?.postId} size="small" />
            </Box>

            <Typography variant="subtitle2" gutterBottom>Sadržaj:</Typography>
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body1">{selectedComment?.content || '-'}</Typography>
            </Paper>

            <Typography variant="subtitle2" gutterBottom>Status:</Typography>
            <Box sx={{ mb: 2 }}>
              <Chip label="REJECTED" size="small" color="error" />
            </Box>

            <Typography variant="subtitle2" gutterBottom>Datum Odbijanja:</Typography>
            <Typography variant="body1">{selectedComment?.updatedAt ? new Date(selectedComment.updatedAt).toLocaleString() : '-'}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Zatvori</Button>
        </DialogActions>
      </Dialog>

      {/* Accept Confirmation Dialog */}
      <Dialog open={acceptDialogOpen} onClose={() => setAcceptDialogOpen(false)}>
        <DialogTitle>Potvrda Prihvatanja Komentara</DialogTitle>
        <DialogContent>
          <Typography>
            Da li ste sigurni da želite prihvatiti ovaj komentar? 
            Komentar će biti prebačen u status "ACCEPTED" i biće vidljiv korisnicima.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAcceptDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleConfirmAccept} variant="contained" color="success">Prihvati Komentar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RejectedComments;