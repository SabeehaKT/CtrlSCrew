import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Paper,
  CircularProgress,
  Button,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { apiClient } from '../utils/apiClient';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

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

const CalendarDay = styled(Box)(({ status }) => {
  const colors = {
    present: '#34A853',
    absent: '#EA4335',
    leave: '#FBBC04',
    half_day: '#4285F4',
    holiday: '#9C27B0',
    default: '#1A1A1A'
  };

  return {
    backgroundColor: colors[status] || colors.default,
    border: '1px solid #2A2A2A',
    borderRadius: '8px',
    padding: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 12px rgba(255, 69, 0, 0.3)',
    },
  };
});

export default function AttendanceCalendar() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    fetchAttendance();
  }, [currentMonth, currentYear]);

  const fetchAttendance = async () => {
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

      // Get first and last day of month
      const firstDay = new Date(currentYear, currentMonth, 1);
      const lastDay = new Date(currentYear, currentMonth + 1, 0);
      
      const startDate = firstDay.toISOString().split('T')[0];
      const endDate = lastDay.toISOString().split('T')[0];

      const data = await apiClient.getMyAttendance(startDate, endDate);
      setAttendance(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  };

  const getFirstDayOfMonth = () => {
    return new Date(currentYear, currentMonth, 1).getDay();
  };

  const getAttendanceForDate = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return attendance.find(a => a.date === dateStr);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#0A0A0A' }}>
        <CircularProgress sx={{ color: '#FF4500' }} />
      </Box>
    );
  }

  const daysInMonth = getDaysInMonth();
  const firstDay = getFirstDayOfMonth();

  return (
    <>
      <Head>
        <title>Attendance Calendar - ZenX Connect</title>
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
                Attendance Calendar
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={handlePrevMonth} sx={{ color: '#fff' }}>
                  <ChevronLeftIcon />
                </IconButton>
                <Typography sx={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600, minWidth: 180, textAlign: 'center' }}>
                  {monthNames[currentMonth]} {currentYear}
                </Typography>
                <IconButton onClick={handleNextMonth} sx={{ color: '#fff' }}>
                  <ChevronRightIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Legend */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 20, height: 20, bgcolor: '#34A853', borderRadius: '4px' }} />
                <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Present</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 20, height: 20, bgcolor: '#EA4335', borderRadius: '4px' }} />
                <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Absent</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 20, height: 20, bgcolor: '#FBBC04', borderRadius: '4px' }} />
                <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Leave</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 20, height: 20, bgcolor: '#4285F4', borderRadius: '4px' }} />
                <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Half Day</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 20, height: 20, bgcolor: '#9C27B0', borderRadius: '4px' }} />
                <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Holiday</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 20, height: 20, bgcolor: '#1A1A1A', borderRadius: '4px', border: '1px solid #2A2A2A' }} />
                <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>No Record</Typography>
              </Box>
            </Box>

            {/* Calendar Grid */}
            <Box>
              {/* Day names */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 1 }}>
                {dayNames.map(day => (
                  <Box key={day} sx={{ textAlign: 'center', py: 1 }}>
                    <Typography sx={{ color: '#888', fontSize: '0.85rem', fontWeight: 600 }}>
                      {day}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {/* Calendar days */}
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDay }).map((_, index) => (
                  <Box key={`empty-${index}`} />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const record = getAttendanceForDate(day);
                  const status = record?.status || 'default';

                  return (
                    <CalendarDay
                      key={day}
                      status={status}
                      onClick={() => setSelectedDay(record)}
                    >
                      <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 600, mb: 0.5 }}>
                        {day}
                      </Typography>
                      {record && (
                        <Typography sx={{ color: '#fff', fontSize: '0.65rem', opacity: 0.8 }}>
                          {status === 'leave' && record.leave_type 
                            ? record.leave_type.toUpperCase().substring(0, 3)
                            : status.substring(0, 3).toUpperCase()}
                        </Typography>
                      )}
                    </CalendarDay>
                  );
                })}
              </Box>
            </Box>

            {/* Selected Day Details */}
            {selectedDay && (
              <Box sx={{ mt: 4, p: 3, bgcolor: '#1A1A1A', borderRadius: '12px', border: '1px solid #2A2A2A' }}>
                <Typography sx={{ color: '#FF4500', fontWeight: 600, mb: 2 }}>
                  {new Date(selectedDay.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                  <Box>
                    <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Status</Typography>
                    <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 600 }}>
                      {selectedDay.status.toUpperCase()}
                    </Typography>
                  </Box>
                  {selectedDay.leave_type && (
                    <Box>
                      <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Leave Type</Typography>
                      <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 600 }}>
                        {selectedDay.leave_type.replace('_', ' ').toUpperCase()}
                      </Typography>
                    </Box>
                  )}
                  {selectedDay.check_in && (
                    <Box>
                      <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Check In</Typography>
                      <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 600 }}>
                        {selectedDay.check_in}
                      </Typography>
                    </Box>
                  )}
                  {selectedDay.check_out && (
                    <Box>
                      <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Check Out</Typography>
                      <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 600 }}>
                        {selectedDay.check_out}
                      </Typography>
                    </Box>
                  )}
                  {selectedDay.hours_worked > 0 && (
                    <Box>
                      <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Hours Worked</Typography>
                      <Typography sx={{ color: '#fff', fontSize: '1rem', fontWeight: 600 }}>
                        {selectedDay.hours_worked}h
                      </Typography>
                    </Box>
                  )}
                  {selectedDay.remarks && (
                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Remarks</Typography>
                      <Typography sx={{ color: '#fff', fontSize: '0.95rem' }}>
                        {selectedDay.remarks}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Button
                  onClick={() => setSelectedDay(null)}
                  sx={{
                    mt: 2,
                    color: '#FF4500',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'rgba(255, 69, 0, 0.1)',
                    },
                  }}
                >
                  Close
                </Button>
              </Box>
            )}
          </StyledPaper>
        </Container>
      </Box>
    </>
  );
}
