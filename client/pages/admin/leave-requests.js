import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { apiClient } from '../../utils/apiClient';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.25rem',
  color: '#fff',
  '& span': {
    color: '#FF4500',
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#0A0A0A',
  boxShadow: 'none',
  borderBottom: '1px solid #1A1A1A',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#111',
  border: '1px solid #1A1A1A',
  borderRadius: '20px',
  padding: theme.spacing(4),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: '#fff',
  borderBottom: '1px solid #1A1A1A',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  padding: '6px 16px',
  textTransform: 'none',
  fontSize: '0.85rem',
  fontWeight: 600,
}));

export default function AdminLeaveRequests() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [rejectDialog, setRejectDialog] = useState({ open: false, requestId: null });
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!apiClient.isAuthenticated()) {
          router.push('/login');
          return;
        }
        
        const userData = await apiClient.getCurrentUser();
        
        if (!userData.is_admin) {
          router.push('/dashboard');
          return;
        }
        
        // Fetch all users and leave requests
        const [allUsers, allRequests] = await Promise.all([
          apiClient.getAllUsers(),
          apiClient.getAllLeaveRequests()
        ]);
        
        setUsers(allUsers);
        setLeaveRequests(allRequests);
      } catch (error) {
        console.error('Error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleApprove = async (requestId) => {
    try {
      await apiClient.updateLeaveRequest(requestId, { status: 'approved' });
      setSnackbar({
        open: true,
        message: 'Leave request approved',
        severity: 'success'
      });
      
      // Refresh requests
      const allRequests = await apiClient.getAllLeaveRequests();
      setLeaveRequests(allRequests);
    } catch (error) {
      console.error('Error approving leave:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to approve leave',
        severity: 'error'
      });
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setSnackbar({
        open: true,
        message: 'Please provide a rejection reason',
        severity: 'error'
      });
      return;
    }
    
    try {
      await apiClient.updateLeaveRequest(rejectDialog.requestId, {
        status: 'rejected',
        rejection_reason: rejectionReason
      });
      setSnackbar({
        open: true,
        message: 'Leave request rejected',
        severity: 'success'
      });
      
      // Refresh requests
      const allRequests = await apiClient.getAllLeaveRequests();
      setLeaveRequests(allRequests);
      
      // Close dialog
      setRejectDialog({ open: false, requestId: null });
      setRejectionReason('');
    } catch (error) {
      console.error('Error rejecting leave:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to reject leave',
        severity: 'error'
      });
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Unknown';
  };

  const getStatusChip = (status) => {
    const colors = {
      pending: { bg: '#FFA500', color: '#000' },
      approved: { bg: '#34A853', color: '#fff' },
      rejected: { bg: '#EA4335', color: '#fff' }
    };
    
    return (
      <Chip
        label={status.toUpperCase()}
        size="small"
        sx={{
          bgcolor: colors[status]?.bg || '#666',
          color: colors[status]?.color || '#fff',
          fontWeight: 600,
          fontSize: '0.75rem'
        }}
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#0A0A0A' }}>
        <CircularProgress sx={{ color: '#FF4500' }} />
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>Leave Requests - ZenX Connect</title>
      </Head>

      <Box sx={{ minHeight: '100vh', bgcolor: '#0A0A0A' }}>
        <StyledAppBar position="static">
          <Toolbar>
            <Logo>
              Zen<span>X</span> Connect
            </Logo>
            <Box sx={{ flexGrow: 1 }} />
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.push('/admin')}
              sx={{ color: '#fff', textTransform: 'none' }}
            >
              Back to Admin
            </Button>
          </Toolbar>
        </StyledAppBar>

        <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
          <StyledPaper>
            <Typography variant="h4" sx={{ color: '#fff', mb: 1, fontWeight: 700 }}>
              Leave Requests
            </Typography>
            <Typography sx={{ color: '#888', mb: 4 }}>
              Review and approve/reject employee leave requests
            </Typography>

            {leaveRequests.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Employee</StyledTableCell>
                      <StyledTableCell>Leave Type</StyledTableCell>
                      <StyledTableCell>Start Date</StyledTableCell>
                      <StyledTableCell>End Date</StyledTableCell>
                      <StyledTableCell>Days</StyledTableCell>
                      <StyledTableCell>Reason</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell>Actions</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaveRequests.map((request) => (
                      <TableRow key={request.id}>
                        <StyledTableCell>{getUserName(request.user_id)}</StyledTableCell>
                        <StyledTableCell>
                          <Chip
                            label={request.leave_type.replace('_', ' ').toUpperCase()}
                            size="small"
                            sx={{ bgcolor: '#1A1A1A', color: '#fff' }}
                          />
                        </StyledTableCell>
                        <StyledTableCell>{request.start_date}</StyledTableCell>
                        <StyledTableCell>{request.end_date}</StyledTableCell>
                        <StyledTableCell>{request.days}</StyledTableCell>
                        <StyledTableCell sx={{ color: '#888', maxWidth: 200 }}>
                          {request.reason || 'N/A'}
                        </StyledTableCell>
                        <StyledTableCell>{getStatusChip(request.status)}</StyledTableCell>
                        <StyledTableCell>
                          {request.status === 'pending' && (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <ActionButton
                                size="small"
                                startIcon={<CheckCircleIcon />}
                                onClick={() => handleApprove(request.id)}
                                sx={{
                                  bgcolor: '#34A853',
                                  color: '#fff',
                                  '&:hover': { bgcolor: '#2D8E47' }
                                }}
                              >
                                Approve
                              </ActionButton>
                              <ActionButton
                                size="small"
                                startIcon={<CancelIcon />}
                                onClick={() => setRejectDialog({ open: true, requestId: request.id })}
                                sx={{
                                  bgcolor: '#EA4335',
                                  color: '#fff',
                                  '&:hover': { bgcolor: '#D33B2E' }
                                }}
                              >
                                Reject
                              </ActionButton>
                            </Box>
                          )}
                          {request.status !== 'pending' && (
                            <Typography sx={{ color: '#666', fontSize: '0.85rem' }}>
                              {request.status === 'approved' ? 'Approved' : 'Rejected'}
                            </Typography>
                          )}
                        </StyledTableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography sx={{ color: '#666', mb: 2 }}>
                  No leave requests found
                </Typography>
                <Typography sx={{ color: '#888', fontSize: '0.9rem' }}>
                  Leave requests will appear here when employees apply for leave
                </Typography>
              </Box>
            )}
          </StyledPaper>
        </Container>
      </Box>

      {/* Reject Dialog */}
      <Dialog
        open={rejectDialog.open}
        onClose={() => setRejectDialog({ open: false, requestId: null })}
        PaperProps={{
          sx: {
            bgcolor: '#111',
            border: '1px solid #1A1A1A',
            borderRadius: '16px',
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff' }}>Reject Leave Request</DialogTitle>
        <DialogContent>
          <TextField
            label="Rejection Reason"
            multiline
            rows={3}
            fullWidth
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                backgroundColor: '#1A1A1A',
                '& fieldset': { borderColor: '#2A2A2A' },
                '&:hover fieldset': { borderColor: '#3A3A3A' },
                '&.Mui-focused fieldset': { borderColor: '#FF4500' },
              },
              '& .MuiInputLabel-root': {
                color: '#888',
                '&.Mui-focused': { color: '#FF4500' },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setRejectDialog({ open: false, requestId: null })}
            sx={{ color: '#888', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            sx={{
              bgcolor: '#EA4335',
              color: '#fff',
              textTransform: 'none',
              '&:hover': { bgcolor: '#D33B2E' }
            }}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
