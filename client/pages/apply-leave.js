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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { apiClient } from '../utils/apiClient';
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

const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FF4500',
  color: '#fff',
  borderRadius: '12px',
  padding: '12px 32px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#E03E00',
  },
  '&:disabled': {
    backgroundColor: '#333',
    color: '#666',
  },
}));

export default function ApplyLeave() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [formData, setFormData] = useState({
    leave_type: 'earned',
    start_date: '',
    end_date: '',
    days: 1,
    reason: '',
  });

  useEffect(() => {
    const checkAuth = async () => {
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
        
        // Fetch leave balance
        try {
          const balance = await apiClient.getMyLeaveBalance();
          setLeaveBalance(balance);
        } catch (error) {
          console.error('Error fetching leave balance:', error);
          setSnackbar({
            open: true,
            message: 'Unable to fetch leave balance. Contact admin.',
            severity: 'error'
          });
        }
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateDays = () => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setFormData(prev => ({ ...prev, days: diffDays }));
    }
  };

  useEffect(() => {
    calculateDays();
  }, [formData.start_date, formData.end_date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.start_date || !formData.end_date) {
      setSnackbar({
        open: true,
        message: 'Please select start and end dates',
        severity: 'error'
      });
      return;
    }
    
    setSubmitting(true);
    
    try {
      await apiClient.applyLeave(formData);
      
      // Different message for sick leave (auto-approved)
      const isSickLeave = formData.leave_type === 'sick';
      setSnackbar({
        open: true,
        message: isSickLeave 
          ? 'Sick leave approved automatically! Your leave balance has been updated.' 
          : 'Leave request submitted successfully! Waiting for admin approval.',
        severity: 'success'
      });
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error applying leave:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to submit leave request',
        severity: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#0A0A0A' }}>
        <CircularProgress sx={{ color: '#FF4500' }} />
      </Box>
    );
  }

  const getAvailableLeave = () => {
    if (!leaveBalance) return 0;
    switch (formData.leave_type) {
      case 'earned':
        return leaveBalance.earned_leave_remaining;
      case 'casual':
        return leaveBalance.casual_leave_remaining;
      case 'sick':
        return leaveBalance.sick_leave_remaining;
      case 'comp_off':
        return leaveBalance.comp_off_remaining;
      case 'lop':
        return 'Unlimited';
      default:
        return 0;
    }
  };

  return (
    <>
      <Head>
        <title>Apply Leave - ZenX Connect</title>
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

        <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
          <StyledPaper>
            <Typography variant="h4" sx={{ color: '#fff', mb: 1, fontWeight: 700 }}>
              Apply for Leave
            </Typography>
            <Typography sx={{ color: '#888', mb: 4 }}>
              Submit your leave request. Admin will review and approve.
            </Typography>

            {leaveBalance && (
              <Box sx={{ mb: 4, p: 2, bgcolor: '#1A1A1A', borderRadius: '12px' }}>
                <Typography sx={{ color: '#999', fontSize: '0.85rem', mb: 1 }}>
                  Your Leave Balance:
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Box>
                    <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>
                      Earned: <strong>{leaveBalance.earned_leave_remaining}</strong> days
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>
                      Casual: <strong>{leaveBalance.casual_leave_remaining}</strong> days
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>
                      Sick: <strong>{leaveBalance.sick_leave_remaining}</strong> days
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>
                      Comp Off: <strong>{leaveBalance.comp_off_remaining}</strong> days
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <StyledTextField
                  select
                  label="Leave Type"
                  name="leave_type"
                  value={formData.leave_type}
                  onChange={handleChange}
                  required
                  fullWidth
                >
                  <MenuItem value="earned">Earned Leave</MenuItem>
                  <MenuItem value="casual">Casual Leave</MenuItem>
                  <MenuItem value="sick">Sick Leave</MenuItem>
                  <MenuItem value="comp_off">Comp Off</MenuItem>
                  <MenuItem value="lop">LOP (Loss of Pay)</MenuItem>
                </StyledTextField>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <StyledTextField
                    label="Start Date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                  <StyledTextField
                    label="End Date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                <StyledTextField
                  label="Number of Days"
                  name="days"
                  type="number"
                  value={formData.days}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputProps={{ readOnly: true }}
                  helperText={`Available: ${getAvailableLeave()} days`}
                  sx={{
                    '& .MuiFormHelperText-root': {
                      color: '#888',
                    },
                  }}
                />

                <StyledTextField
                  label="Reason (Optional)"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  fullWidth
                  placeholder="Briefly explain the reason for your leave..."
                />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => router.push('/dashboard')}
                    sx={{
                      borderColor: '#2A2A2A',
                      color: '#fff',
                      borderRadius: '12px',
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#3A3A3A',
                        backgroundColor: '#1A1A1A',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <SubmitButton
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Submit Request'}
                  </SubmitButton>
                </Box>
              </Box>
            </form>
          </StyledPaper>
        </Container>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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
