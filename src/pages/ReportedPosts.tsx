// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, IconButton, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid, Chip } from '@mui/material';
import { Delete as DeleteIcon, Warning as WarningIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { ReportService, ReportedPost } from '../services/apiService';

const ReportedPosts: React.FC = () => {
  const [reports, setReports] = useState<ReportedPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [userIdFilter, setUserIdFilter] = useState('');
  const [postIdFilter, setPostIdFilter] = useState('');
  const [deleteReportDialogOpen, setDeleteReportDialogOpen] = useState(false);
  const [deletePostDialogOpen, setDeletePostDialogOpen] = useState(false);
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
              <TableCell>Korisnik</TableCell>
              <TableCell>Post ID</TableCell>
              <TableCell>Razlog</TableCell>
              <TableCell>Datum prijave</TableCell>
              <TableCell align="right">Akcije</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} align="center">Učitavanje...</TableCell></TableRow>
            ) : reports.length === 0 ? (
              <TableRow><TableCell colSpan={5} align="center">Nema prijavljenih postova</TableCell></TableRow>
            ) : (
              reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.user?.fullName || report.userId}</TableCell>
                  <TableCell><Chip label={report.postId} size="small" /></TableCell>
                  <TableCell>{report.reason || '-'}</TableCell>
                  <TableCell>{new Date(report.createdAt).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleDeleteReport(report)} title="Obriši prijavu"><DeleteIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDeletePost(report)} title="Obriši post"><WarningIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

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
