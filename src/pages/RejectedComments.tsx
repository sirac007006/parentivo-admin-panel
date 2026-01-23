// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip } from '@mui/material';
import { toast } from 'react-toastify';
import { ReportService } from '../services/apiService';

const RejectedComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

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
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} align="center">Učitavanje...</TableCell></TableRow>
            ) : comments.length === 0 ? (
              <TableRow><TableCell colSpan={6} align="center">Nema odbijenih komentara</TableCell></TableRow>
            ) : (
              comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell><Chip label={comment.id} size="small" /></TableCell>
                  <TableCell>{comment.content?.substring(0, 50) || '-'}...</TableCell>
                  <TableCell>{comment.user?.fullName || comment.userId}</TableCell>
                  <TableCell><Chip label={comment.postId} size="small" /></TableCell>
                  <TableCell><Chip label="REJECTED" size="small" color="error" /></TableCell>
                  <TableCell>{new Date(comment.updatedAt).toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RejectedComments;
