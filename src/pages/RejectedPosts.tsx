// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Chip } from '@mui/material';
import { toast } from 'react-toastify';
import { ReportService } from '../services/apiService';

const RejectedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

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
              <TableCell>Autor</TableCell>
              <TableCell>Kategorija</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Datum odbijanja</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} align="center">Učitavanje...</TableCell></TableRow>
            ) : posts.length === 0 ? (
              <TableRow><TableCell colSpan={6} align="center">Nema odbijenih postova</TableCell></TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell><Chip label={post.id} size="small" /></TableCell>
                  <TableCell>{post.title || '-'}</TableCell>
                  <TableCell>{post.user?.fullName || post.userId}</TableCell>
                  <TableCell>{post.category?.name || '-'}</TableCell>
                  <TableCell><Chip label="REJECTED" size="small" color="error" /></TableCell>
                  <TableCell>{new Date(post.updatedAt).toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RejectedPosts;
