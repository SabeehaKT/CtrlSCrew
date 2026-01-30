import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Paper,
  TextField,
  Alert,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { apiClient } from '../utils/apiClient';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LockIcon from '@mui/icons-material/Lock';

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.25rem',
  '& span': {
    color: '#FF4500',
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#0A0A0A',
  boxShadow: 'none',
  borderBottom: '1px solid #1A1A1A',
}));

const PasswordPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#0D0D0D',
  border: '1px solid #1A1A1A',
  borderRadius: '16px',
  padding: theme.spacing(4),
  maxWidth: '500px',
  margin: '0 auto',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#1A1A1A',
    color: '#fff',
    borderRadius: '8px',
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
    color: '#999',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#FF4500',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF4500 0%, #FF6B35 100%)',
  color: '#fff',
  padding: '12px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': {
    background: 'linear-gradient(135deg, #FF6B35 0%, #FF4500 100%)',
  },
  '&:disabled': {
    background: '#333',
    color: '#666',
  },
}));

export default function ChangePassword() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mustChange, setMustChange] = useState(false);
  
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!apiClient.isAuthenticated()) {
          router.push('/login');
          return;
        }
        const userData = await apiClient.getCurrentUser();
        setUser(userData);
        setMustChange(userData.must_change_password);
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    // Validate passwords
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setSubmitting(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setSubmitting(false);
      return;
    }

    try {
      await apiClient.changePassword(formData.oldPassword, formData.newPassword);
      setSuccess('Password changed successfully!');
      
      // Redirect after 2 seconds
      setTimeout(() => {
        if (mustChange) {
          // If it was a forced change, redirect to dashboard
          router.push(user.is_admin ? '/admin' : '/dashboard');
        } else {
          // Otherwise go back to profile
          router.push('/profile');
        }
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#000' }}>
        <CircularProgress sx={{ color: '#FF4500' }} />
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>Change Password - ZenX Connect</title>
        <meta name="description" content="Change your password" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ minHeight: '100vh', backgroundColor: '#000' }}>
        <StyledAppBar position="static">
          <Toolbar>
            {!mustChange && (
              <IconButton onClick={() => router.push('/profile')} sx={{ color: '#fff', mr: 2 }}>
                <ArrowBackIcon />
              </IconButton>
            )}
            <Logo sx={{ flexGrow: 1 }}>
              <span>ZenX</span> Connect
            </Logo>
          </Toolbar>
        </StyledAppBar>

        <Container maxWidth="sm" sx={{ py: 6 }}>
          <PasswordPaper>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <LockIcon sx={{ fontSize: 60, color: '#FF4500', mb: 2 }} />
              <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
                {mustChange ? 'Change Your Password' : 'Update Password'}
              </Typography>
              {mustChange && (
                <Alert severity="warning" sx={{ mt: 2, textAlign: 'left' }}>
                  You must change your password before continuing.
                </Alert>
              )}
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

            <form onSubmit={handleSubmit}>
              <StyledTextField
                fullWidth
                label="Current Password"
                name="oldPassword"
                type="password"
                value={formData.oldPassword}
                onChange={handleChange}
                required
                margin="normal"
                autoComplete="current-password"
              />

              <StyledTextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                required
                margin="normal"
                autoComplete="new-password"
                helperText="Minimum 6 characters"
                FormHelperTextProps={{
                  sx: { color: '#666' }
                }}
              />

              <StyledTextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                margin="normal"
                autoComplete="new-password"
              />

              <ActionButton
                type="submit"
                fullWidth
                disabled={submitting}
                sx={{ mt: 3 }}
              >
                {submitting ? 'Changing Password...' : 'Change Password'}
              </ActionButton>

              {!mustChange && (
                <Button
                  fullWidth
                  onClick={() => router.push('/profile')}
                  disabled={submitting}
                  sx={{
                    mt: 2,
                    color: '#999',
                    textTransform: 'none',
                    '&:hover': {
                      color: '#FF4500',
                    },
                  }}
                >
                  Cancel
                </Button>
              )}
            </form>
          </PasswordPaper>
        </Container>
      </Box>
    </>
  );
}
