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
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { apiClient } from '../../utils/apiClient';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

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

const StyledSelect = styled(Select)(({ theme }) => ({
  color: '#fff',
  backgroundColor: '#1A1A1A',
  borderRadius: '12px',
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

const SummaryCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#1A1A1A',
  borderRadius: '12px',
  padding: theme.spacing(2),
  textAlign: 'center',
  border: '1px solid #2A2A2A',
}));

export default function AdminAttendanceReports() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    // Set default dates to current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    setStartDate(firstDay.toISOString().split('T')[0]);
    setEndDate(lastDay.toISOString().split('T')[0]);
  }, []);

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
        
        if (allUsers.length > 0) {
          setSelectedUser(allUsers[0].id);
        }
      } catch (error) {
        console.error('Error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (selectedUser && startDate && endDate) {
      fetchAttendance();
    }
  }, [selectedUser, startDate, endDate]);

  const fetchAttendance = async () => {
    try {
      const data = await apiClient.getUserAttendance(selectedUser, startDate, endDate);
      setAttendance(data);
      
      // Calculate summary
      const present = data.filter(r => r.status === 'present').length;
      const absent = data.filter(r => r.status === 'absent').length;
      const leave = data.filter(r => r.status === 'leave').length;
      const halfDay = data.filter(r => r.status === 'half_day').length;
      const holiday = data.filter(r => r.status === 'holiday').length;
      
      setSummary({
        present_days: present,
        absent_days: absent,
        leave_days: leave,
        half_days: halfDay,
        holiday_days: holiday,
        working_days: present + leave + (halfDay * 0.5)
      });
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setAttendance([]);
      setSummary(null);
    }
  };

  const getStatusChip = (status, leaveType) => {
    const statusConfig = {
      present: { label: 'Present', color: '#34A853', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> },
      absent: { label: 'Absent', color: '#EA4335', icon: <CancelIcon sx={{ fontSize: 16 }} /> },
      leave: { label: `Leave${leaveType ? ` (${leaveType})` : ''}`, color: '#FBBC04', icon: <BeachAccessIcon sx={{ fontSize: 16 }} /> },
      half_day: { label: 'Half Day', color: '#4285F4', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> },
      holiday: { label: 'Holiday', color: '#9C27B0', icon: <EventBusyIcon sx={{ fontSize: 16 }} /> },
    };

    const config = statusConfig[status] || statusConfig.present;

    return (
      <Chip
        icon={config.icon}
        label={config.label}
        size="small"
        sx={{
          bgcolor: config.color,
          color: '#fff',
          fontWeight: 600,
          fontSize: '0.75rem',
          '& .MuiChip-icon': {
            color: '#fff'
          }
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
        <title>Attendance Reports - ZenX Connect</title>
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
          {/* Summary Cards */}
          {summary && (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2, mb: 4 }}>
              <SummaryCard>
                <Typography sx={{ color: '#34A853', fontSize: '2rem', fontWeight: 700 }}>
                  {summary.present_days}
                </Typography>
                <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Present Days</Typography>
              </SummaryCard>
              <SummaryCard>
                <Typography sx={{ color: '#EA4335', fontSize: '2rem', fontWeight: 700 }}>
                  {summary.absent_days}
                </Typography>
                <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Absent Days</Typography>
              </SummaryCard>
              <SummaryCard>
                <Typography sx={{ color: '#FBBC04', fontSize: '2rem', fontWeight: 700 }}>
                  {summary.leave_days}
                </Typography>
                <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Leave Days</Typography>
              </SummaryCard>
              <SummaryCard>
                <Typography sx={{ color: '#4285F4', fontSize: '2rem', fontWeight: 700 }}>
                  {summary.half_days}
                </Typography>
                <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Half Days</Typography>
              </SummaryCard>
              <SummaryCard>
                <Typography sx={{ color: '#9C27B0', fontSize: '2rem', fontWeight: 700 }}>
                  {summary.holiday_days}
                </Typography>
                <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Holidays</Typography>
              </SummaryCard>
              <SummaryCard>
                <Typography sx={{ color: '#FF4500', fontSize: '2rem', fontWeight: 700 }}>
                  {summary.working_days}
                </Typography>
                <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Working Days</Typography>
              </SummaryCard>
            </Box>
          )}

          <StyledPaper>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
                Attendance Reports
              </Typography>
              <Typography sx={{ color: '#888', mb: 3 }}>
                View detailed attendance records for employees
              </Typography>

              {/* Filters */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl sx={{ minWidth: 250 }}>
                  <InputLabel sx={{ color: '#888', '&.Mui-focused': { color: '#FF4500' } }}>
                    Select Employee
                  </InputLabel>
                  <StyledSelect
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    label="Select Employee"
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </MenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>
                <StyledTextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
                <StyledTextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                />
              </Box>
            </Box>

            {attendance.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableHeadCell>Date</StyledTableHeadCell>
                      <StyledTableHeadCell>Day</StyledTableHeadCell>
                      <StyledTableHeadCell>Status</StyledTableHeadCell>
                      <StyledTableHeadCell>Check In</StyledTableHeadCell>
                      <StyledTableHeadCell>Check Out</StyledTableHeadCell>
                      <StyledTableHeadCell>Hours</StyledTableHeadCell>
                      <StyledTableHeadCell>Remarks</StyledTableHeadCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendance.map((record) => {
                      const date = new Date(record.date);
                      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                      
                      return (
                        <TableRow key={record.id}>
                          <StyledTableCell>
                            {new Date(record.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </StyledTableCell>
                          <StyledTableCell sx={{ color: '#888' }}>{dayName}</StyledTableCell>
                          <StyledTableCell>
                            {getStatusChip(record.status, record.leave_type)}
                          </StyledTableCell>
                          <StyledTableCell sx={{ color: '#888' }}>
                            {record.check_in || '-'}
                          </StyledTableCell>
                          <StyledTableCell sx={{ color: '#888' }}>
                            {record.check_out || '-'}
                          </StyledTableCell>
                          <StyledTableCell sx={{ color: '#888' }}>
                            {record.hours_worked ? `${record.hours_worked}h` : '-'}
                          </StyledTableCell>
                          <StyledTableCell sx={{ color: '#888', maxWidth: 200 }}>
                            {record.remarks || '-'}
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
                  No attendance records found for the selected period
                </Typography>
                <Typography sx={{ color: '#888', fontSize: '0.9rem' }}>
                  Mark attendance in the Attendance Management page
                </Typography>
              </Box>
            )}
          </StyledPaper>
        </Container>
      </Box>
    </>
  );
}
