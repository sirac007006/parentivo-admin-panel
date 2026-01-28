// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid, Chip } from '@mui/material';
import { Delete as DeleteIcon, Refresh as RefreshIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { ReportService, ReportedPost } from '../services/apiService';

const ReportedPosts: React.FC = () => {
  const [reports, setReports] = useState<ReportedPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [userIdFilter, setUserIdFilter] = useState('');
  const [postIdFilter, setPostIdFilter] = useState('');
  const [deleteReportDialogOpen, setDeleteReportDialogOpen] = useState(false);
  const [deletePostDialogOpen, setDeletePostDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportedPost | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (userIdFilter) params.userId = userIdFilter;
      if (postIdFilter) params.postId = postIdFilter;
      const data = await ReportService.getReportedPosts(params);
      setReports(data);
    } catch (error: any) {
      toast.error('Greška pri učitavanju prijavljenih postova: ' + error.message);
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
    setPostIdFilter('');
    fetchReports();
  };

  const handleDeleteReport = (report: ReportedPost) => {
    setSelectedReport(report);
    setDeleteReportDialogOpen(true);
  };

  const handleDeletePost = (report: ReportedPost) => {
    setSelectedReport(report);
    setDeletePostDialogOpen(true);
  };

  const handleViewPost = (report: ReportedPost) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  const handleConfirmDeleteReport = async () => {
    if (!selectedReport) return;
    try {
      await ReportService.deleteReportedPost(selectedReport.id);
      toast.success('Prijava uspješno obrisana');
      setDeleteReportDialogOpen(false);
      fetchReports();
    } catch (error: any) {
      toast.error('Greška pri brisanju prijave: ' + error.message);
    }
  };

  const handleConfirmDeletePost = async () => {
    if (!selectedReport) return;
    try {
      await ReportService.deleteForumPost(selectedReport.postId);
      toast.success('Post uspješno obrisan');
      setDeletePostDialogOpen(false);
      fetchReports();
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
      <Typography variant="h4" gutterBottom>Prijavljeni Postovi</Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5}>
            <TextField fullWidth label="User ID" value={userIdFilter} onChange={(e) => setUserIdFilter(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField fullWidth label="Post ID" value={postIdFilter} onChange={(e) => setPostIdFilter(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} />
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
              <TableCell>Post ID</TableCell>
              <TableCell>Autor Posta</TableCell>
              <TableCell>Naslov</TableCell>
              <TableCell>Sadržaj</TableCell>
              <TableCell>Razlog</TableCell>
              <TableCell>Datum prijave</TableCell>
              <TableCell align="right">Akcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8} align="center">Učitavanje...</TableCell></TableRow>
            ) : reports.length === 0 ? (
              <TableRow><TableCell colSpan={8} align="center">Nema prijavljenih postova</TableCell></TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.user?.fullName || report.userId}</TableCell>
                  <TableCell><Chip label={report.postId} size="small" /></TableCell>
                  <TableCell>{report.forumPost?.user?.fullName || '-'}</TableCell>
                  <TableCell>{truncateText(report.forumPost?.title)}</TableCell>
                  <TableCell>{truncateText(report.forumPost?.content)}</TableCell>
                  <TableCell>{report.reason || '-'}</TableCell>
                  <TableCell>{new Date(report.createdAt).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton color="info" onClick={() => handleViewPost(report)} title="Pogledaj detalje"><VisibilityIcon /></IconButton>
                    <IconButton color="primary" onClick={() => handleDeleteReport(report)} title="Obriši prijavu"><DeleteIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDeletePost(report)} title="Obriši post"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalji Prijavljenog Posta</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Prijavio:</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{selectedReport?.user?.fullName || '-'}</Typography>

            <Typography variant="subtitle2" gutterBottom>Autor Posta:</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{selectedReport?.forumPost?.user?.fullName || '-'}</Typography>

            <Typography variant="subtitle2" gutterBottom>Naslov:</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>{selectedReport?.forumPost?.title || '-'}</Typography>

            <Typography variant="subtitle2" gutterBottom>Sadržaj Posta:</Typography>
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body1">{selectedReport?.forumPost?.content || '-'}</Typography>
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

      <Dialog open={deletePostDialogOpen} onClose={() => setDeletePostDialogOpen(false)}>
        <DialogTitle>Potvrda Brisanja Posta</DialogTitle>
        <DialogContent><Typography>Da li ste sigurni da želite obrisati prijavljeni post? Ova akcija je nepovratna.</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletePostDialogOpen(false)}>Otkaži</Button>
          <Button onClick={handleConfirmDeletePost} variant="contained" color="error">Obriši Post</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportedPosts;