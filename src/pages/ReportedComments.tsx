// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid, Chip } from '@mui/material';
import { Delete as DeleteIcon, Refresh as RefreshIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { ReportService, ReportedComment } from '../services/apiService';

const ReportedComments: React.FC = () => {
  const [reports, setReports] = useState<ReportedComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [userIdFilter, setUserIdFilter] = useState('');
  const [commentIdFilter, setCommentIdFilter] = useState('');
  const [deleteReportDialogOpen, setDeleteReportDialogOpen] = useState(false);
  const [deleteCommentDialogOpen, setDeleteCommentDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportedComment | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (userIdFilter) params.userId = userIdFilter;
      if (commentIdFilter) params.commentId = commentIdFilter;
      const data = await ReportService.getReportedComments(params);
      setReports(data);
    } catch (error: any) {
      toast.error('Greška pri učitavanju prijavljenih komentara: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => fetchReports();
  const handleReset = () => {
    setUserIdFilter('');
    setCommentIdFilter('');
    fetchReports();
  };

  const handleDeleteReport = (report: ReportedComment) => {
    setSelectedReport(report);
    setDeleteReportDialogOpen(true);
  };

  const handleDeleteComment = (report: ReportedComment) => {
    setSelectedReport(report);
    setDeleteCommentDialogOpen(true);
  };

  const handleViewComment = (report: ReportedComment) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  const handleConfirmDeleteReport = async () => {
    if (!selectedReport) return;
    try {
      await ReportService.deleteReportedComment(selectedReport.id);
      toast.success('Prijava uspješno obrisana');
      setDeleteReportDialogOpen(false);
      fetchReports();
    } catch (error: any) {
      toast.error('Greška pri brisanju prijave: ' + error.message);
    }
  };

  const handleConfirmDeleteComment = async () => {
    if (!selectedReport) return;
    try {
      await ReportService.deleteForumComment(selectedReport.commentId);
      toast.success('Komentar uspješno obrisan');
      setDeleteCommentDialogOpen(false);
      fetchReports();
    } catch (error: any) {
      toast.error('Greška pri brisanju komentara: ' + error.message);
    }
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return '-';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Prijavljeni Komentari</Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <TextField fullWidth label="User ID" value={userIdFilter} onChange={(e) => setUserIdFilter(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField fullWidth label="Comment ID" value={commentIdFilter} onChange={(e) => setCommentIdFilter(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} />
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
              <TableCell>Prijavio</TableCell>
              <TableCell>Comment ID</TableCell>
              <TableCell>Autor Komentara</TableCell>
              <TableCell>Sadržaj</TableCell>
              <TableCell>Razlog</TableCell>
              <TableCell>Datum prijave</TableCell>
              <TableCell align="right">Akcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} align="center">Učitavanje...</TableCell></TableRow>
            ) : reports.length === 0 ? (
              <TableRow><TableCell colSpan={7} align="center">Nema prijavljenih komentara</TableCell></TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.user?.fullName || report.userId}</TableCell>
                  <TableCell><Chip label={report.commentId} size="small" /></TableCell>
                  <TableCell>{report.forumComment?.user?.fullName || '-'}</TableCell>
                  <TableCell>{truncateText(report.forumComment?.content)}</TableCell>
                  <TableCell>{report.reason || '-'}</TableCell>
                  <TableCell>{new Date(report.createdAt).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton color="info" onClick={() => handleViewComment(report)} title="Pogledaj detalje"><VisibilityIcon /></IconButton>
                    <IconButton color="primary" onClick={() => handleDeleteReport(report)} title="Obriši prijavu"><DeleteIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDeleteComment(report)} title="Obriši komentar"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalji Prijavljenog Komentara</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Prijavio:</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{selectedReport?.user?.fullName || '-'}</Typography>

            <Typography variant="subtitle2" gutterBottom>Autor Komentara:</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{selectedReport?.forumComment?.user?.fullName || '-'}</Typography>

            <Typography variant="subtitle2" gutterBottom>Sadržaj Komentara:</Typography>
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body1">{selectedReport?.forumComment?.content || '-'}</Typography>
            </Paper>

            <Typography variant="subtitle2" gutterBottom>Razlog Prijave:</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{selectedReport?.reason || '-'}</Typography>

            <Typography variant="subtitle2" gutterBottom>Datum Prijave:</Typography>
            <Typography variant="body1">{selectedReport?.createdAt ? new Date(selectedReport.createdAt).toLocaleString() : '-'}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Zatvori</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteReportDialogOpen} onClose={() => setDeleteReportDialogOpen(false)}>
        <DialogTitle>Potvrda Brisanja Prijave</DialogTitle>
        <DialogContent><Typography>Da li ste sigurni da želite obrisati ovu prijavu?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteReportDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleConfirmDeleteReport} variant="contained" color="error">Obriši Prijavu</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteCommentDialogOpen} onClose={() => setDeleteCommentDialogOpen(false)}>
        <DialogTitle>Potvrda Brisanja Komentara</DialogTitle>
        <DialogContent><Typography>Da li ste sigurni da želite obrisati prijavljeni komentar? Ova akcija je nepovratna.</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteCommentDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleConfirmDeleteComment} variant="contained" color="error">Obriši Komentar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportedComments;