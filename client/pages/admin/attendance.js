import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Paper,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  FormControl,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { apiClient } from '../../utils/apiClient';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    backgroundColor: '#1A1A1A',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: '#2A2A2A',
    },
    '&:hover fieldset': {
      borderColor: '#3A3A3A',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FF4500',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#888',
    '&.Mui-focused': {
      color: '#FF4500',
    },
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: '#fff',
  borderBottom: '1px solid #1A1A1A',
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  color: '#fff',
  backgroundColor: '#1A1A1A',
  borderRadius: '8px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#2A2A2A',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#3A3A3A',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#FF4500',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FF4500',
  color: '#fff',
  borderRadius: '12px',
  padding: '8px 24px',
  textTransform: 'none',
  fontSize: '0.9rem',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#E03E00',
  },
  '&:disabled': {
    backgroundColor: '#333',
    color: '#666',
  },
}));

export default function AdminAttendance() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
        
        // Fetch all users
        const allUsers = await apiClient.getAllUsers();
        setUsers(allUsers);
        
        // Try to fetch attendance for today
        await fetchAttendance(selectedDate);
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const fetchAttendance = async (date) => {
    try {
      const records = await apiClient.getAttendanceByDate(date);
      setAttendanceRecords(records);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setAttendanceRecords([]);
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    fetchAttendance(newDate);
  };

  const handleBulkAction = async (status) => {
    setSubmitting(true);
    try {
      await apiClient.markBulkAttendance(selectedDate, status);
      setSnackbar({
        open: true,
        message: `All employees marked as ${status}`,
        severity: 'success'
      });
      
      // Refresh attendance
      await fetchAttendance(selectedDate);
    } catch (error) {
      console.error('Error marking bulk attendance:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to mark attendance',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleIndividualChange = async (attendanceId, newStatus, leaveType = null) => {
    try {
      await apiClient.updateAttendance(attendanceId, newStatus, leaveType);
      setSnackbar({
        open: true,
        message: 'Attendance updated',
        severity: 'success'
      });
      
      // Refresh attendance
      await fetchAttendance(selectedDate);
    } catch (error) {
      console.error('Error updating attendance:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update attendance',
        severity: 'error'
      });
    }
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
        <title>Attendance Management - ZenX Connect</title>
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
              Attendance Management
            </Typography>
            <Typography sx={{ color: '#888', mb: 4 }}>
              Mark attendance for all employees
            </Typography>

            {/* Date Picker and Bulk Actions */}
            <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <StyledTextField
                label="Select Date"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 200 }}
              />
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <ActionButton
                  onClick={() => handleBulkAction('present')}
                  disabled={submitting}
                  sx={{ bgcolor: '#34A853', '&:hover': { bgcolor: '#2D8E47' } }}
                >
                  Mark All Present
                </ActionButton>
                <ActionButton
                  onClick={() => handleBulkAction('absent')}
                  disabled={submitting}
                  sx={{ bgcolor: '#EA4335', '&:hover': { bgcolor: '#D33B2E' } }}
                >
                  Mark All Absent
                </ActionButton>
                <ActionButton
                  onClick={() => handleBulkAction('holiday')}
                  disabled={submitting}
                  sx={{ bgcolor: '#4285F4', '&:hover': { bgcolor: '#3A75D9' } }}
                >
                  Mark All Holiday
                </ActionButton>
              </Box>
            </Box>

            {/* Attendance Table */}
            {attendanceRecords.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Employee Name</StyledTableCell>
                      <StyledTableCell>Email</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell>Leave Type</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendanceRecords.map((record) => {
                      const user = users.find(u => u.id === record.user_id);
                      return (
                        <TableRow key={record.id}>
                          <StyledTableCell>{user?.name || 'Unknown'}</StyledTableCell>
                          <StyledTableCell sx={{ color: '#888' }}>{user?.email || 'N/A'}</StyledTableCell>
                          <StyledTableCell>
                            <FormControl size="small" fullWidth>
                              <StyledSelect
                                value={record.status}
                                onChange={(e) => {
                                  const newStatus = e.target.value;
                                  if (newStatus === 'leave') {
                                    // Default to earned leave
                                    handleIndividualChange(record.id, newStatus, 'earned');
                                  } else {
                                    handleIndividualChange(record.id, newStatus, null);
                                  }
                                }}
                              >
                                <MenuItem value="present">Present</MenuItem>
                                <MenuItem value="absent">Absent</MenuItem>
                                <MenuItem value="leave">Leave</MenuItem>
                                <MenuItem value="half_day">Half Day</MenuItem>
                                <MenuItem value="holiday">Holiday</MenuItem>
                              </StyledSelect>
                            </FormControl>
                          </StyledTableCell>
                          <StyledTableCell>
                            {record.status === 'leave' ? (
                              <FormControl size="small" fullWidth>
                                <StyledSelect
                                  value={record.leave_type || 'earned'}
                                  onChange={(e) => handleIndividualChange(record.id, 'leave', e.target.value)}
                                >
                                  <MenuItem value="earned">Earned Leave</MenuItem>
                                  <MenuItem value="casual">Casual Leave</MenuItem>
                                  <MenuItem value="sick">Sick Leave</MenuItem>
                                  <MenuItem value="comp_off">Comp Off</MenuItem>
                                  <MenuItem value="lop">LOP</MenuItem>
                                </StyledSelect>
                              </FormControl>
                            ) : (
                              <Typography sx={{ color: '#666' }}>N/A</Typography>
                            )}
                          </StyledTableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography sx={{ color: '#666', mb: 2 }}>
                  No attendance records for {selectedDate}
                </Typography>
                <Typography sx={{ color: '#888', fontSize: '0.9rem' }}>
                  Use the bulk actions above to mark attendance for all employees
                </Typography>
              </Box>
            )}
          </StyledPaper>
        </Container>
      </Box>

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
