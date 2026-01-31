import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { apiClient } from '../utils/apiClient';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';

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

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  color: '#999',
  borderBottom: '1px solid #1A1A1A',
  fontWeight: 600,
  fontSize: '0.85rem',
  textTransform: 'uppercase',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FF4500',
  color: '#fff',
  borderRadius: '12px',
  padding: '10px 24px',
  textTransform: 'none',
  fontSize: '0.9rem',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#E03E00',
  },
}));

export default function MyLeaves() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!apiClient.isAuthenticated()) {
          router.push('/login');
          return;
        }

        const userData = await apiClient.getCurrentUser();
        if (userData.is_admin) {
          router.push('/admin');
          return;
        }

        // Fetch leave requests
        const requests = await apiClient.getMyLeaveRequests();
        setLeaveRequests(requests);
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

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

  const getLeaveTypeChip = (leaveType) => {
    const colors = {
      earned: '#FF4500',
      casual: '#4285F4',
      sick: '#34A853',
      comp_off: '#9C27B0',
      lop: '#EA4335'
    };

    return (
      <Chip
        label={leaveType.replace('_', ' ').toUpperCase()}
        size="small"
        sx={{
          bgcolor: colors[leaveType] || '#666',
          color: '#fff',
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
        <title>My Leave History - ZenX Connect</title>
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
              onClick={() => router.push('/dashboard')}
              sx={{ color: '#fff', textTransform: 'none' }}
            >
              Back to Dashboard
            </Button>
          </Toolbar>
        </StyledAppBar>

        <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
          <StyledPaper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
                  My Leave History
                </Typography>
                <Typography sx={{ color: '#888' }}>
                  View all your leave requests and their status
                </Typography>
              </Box>
              <ActionButton
                startIcon={<AddIcon />}
                onClick={() => router.push('/apply-leave')}
              >
                Apply New Leave
              </ActionButton>
            </Box>

            {leaveRequests.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableHeadCell>Leave Type</StyledTableHeadCell>
                      <StyledTableHeadCell>Start Date</StyledTableHeadCell>
                      <StyledTableHeadCell>End Date</StyledTableHeadCell>
                      <StyledTableHeadCell>Days</StyledTableHeadCell>
                      <StyledTableHeadCell>Reason</StyledTableHeadCell>
                      <StyledTableHeadCell>Status</StyledTableHeadCell>
                      <StyledTableHeadCell>Applied On</StyledTableHeadCell>
                      <StyledTableHeadCell>Rejection Reason</StyledTableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leaveRequests.map((request) => (
                      <TableRow key={request.id}>
                        <StyledTableCell>
                          {getLeaveTypeChip(request.leave_type)}
                        </StyledTableCell>
                        <StyledTableCell>
                          {new Date(request.start_date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </StyledTableCell>
                        <StyledTableCell>
                          {new Date(request.end_date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </StyledTableCell>
                        <StyledTableCell>
                          <Typography sx={{ color: '#fff', fontWeight: 600 }}>
                            {request.days}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: '#888', maxWidth: 200 }}>
                          {request.reason || 'N/A'}
                        </StyledTableCell>
                        <StyledTableCell>
                          {getStatusChip(request.status)}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: '#888' }}>
                          {new Date(request.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </StyledTableCell>
                        <StyledTableCell sx={{ color: '#EA4335', maxWidth: 200 }}>
                          {request.rejection_reason || '-'}
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
                <Typography sx={{ color: '#888', fontSize: '0.9rem', mb: 3 }}>
                  You haven't applied for any leave yet
                </Typography>
                <ActionButton
                  startIcon={<AddIcon />}
                  onClick={() => router.push('/apply-leave')}
                >
                  Apply for Leave
                </ActionButton>
              </Box>
            )}
          </StyledPaper>
        </Container>
      </Box>
    </>
  );
}
