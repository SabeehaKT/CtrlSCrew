import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Paper,
  CircularProgress,
  TextField,
  Grid,
  Avatar,
  Chip,
  Alert,
  Divider,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { apiClient } from '../utils/apiClient';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

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

const ProfilePaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#0D0D0D',
  border: '1px solid #1A1A1A',
  borderRadius: '16px',
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
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
  '& .Mui-disabled': {
    color: '#666',
    WebkitTextFillColor: '#666',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF4500 0%, #FF6B35 100%)',
  color: '#fff',
  padding: '10px 24px',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': {
    background: 'linear-gradient(135deg, #FF6B35 0%, #FF4500 100%)',
  },
}));

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    area_of_interest: '',
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
        
        // Initialize form data
        setFormData({
          phone: userData.phone || '',
          address: userData.address || '',
          area_of_interest: userData.area_of_interest || '',
        });
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = () => {
    apiClient.logout();
    router.push('/login');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = await apiClient.updateUserProfile(formData);
      setUser(updatedUser);
      setSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data
    setFormData({
      phone: user.phone || '',
      address: user.address || '',
      area_of_interest: user.area_of_interest || '',
    });
    setEditMode(false);
    setError('');
    setSuccess('');
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
        <title>My Profile - ZenX Connect</title>
        <meta name="description" content="User Profile" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ minHeight: '100vh', backgroundColor: '#000' }}>
        <StyledAppBar position="static">
          <Toolbar>
            <IconButton onClick={() => router.push('/dashboard')} sx={{ color: '#fff', mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Logo sx={{ flexGrow: 1 }}>
              <span>ZenX</span> Connect
            </Logo>
            <Button
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ color: '#FF4500', textTransform: 'none' }}
            >
              Logout
            </Button>
          </Toolbar>
        </StyledAppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" sx={{ color: '#fff', mb: 4, fontWeight: 700 }}>
            My Profile
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

          {/* Profile Header */}
          <ProfilePaper>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: '#FF4500',
                  fontSize: '2.5rem',
                  mr: 3,
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
                  {user?.name}
                </Typography>
                <Typography sx={{ color: '#999', mb: 1 }}>
                  {user?.email}
                </Typography>
                <Chip
                  label={user?.is_admin ? 'Admin' : 'User'}
                  size="small"
                  sx={{
                    bgcolor: user?.is_admin ? '#FF4500' : '#2A2A2A',
                    color: '#fff',
                    fontWeight: 600,
                  }}
                />
              </Box>
              {!editMode && (
                <ActionButton
                  startIcon={<EditIcon />}
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </ActionButton>
              )}
            </Box>
          </ProfilePaper>

          <Grid container spacing={3}>
            {/* Employment Information (Read-only) */}
            <Grid item xs={12} md={6}>
              <ProfilePaper>
                <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 600 }}>
                  Employment Information
                  <Typography component="span" sx={{ color: '#999', fontSize: '0.85rem', ml: 1 }}>
                    (Admin Controlled)
                  </Typography>
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ color: '#999', fontSize: '0.85rem', mb: 1 }}>Role</Typography>
                  <Typography sx={{ color: '#fff', fontSize: '1rem' }}>
                    {user?.role || 'Not assigned'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ color: '#999', fontSize: '0.85rem', mb: 1 }}>Experience</Typography>
                  <Typography sx={{ color: '#fff', fontSize: '1rem' }}>
                    {user?.experience ? `${user.experience} years` : 'Not specified'}
                  </Typography>
                </Box>

                <Box>
                  <Typography sx={{ color: '#999', fontSize: '0.85rem', mb: 1 }}>Skills</Typography>
                  <Typography sx={{ color: '#fff', fontSize: '1rem' }}>
                    {user?.skills || 'Not specified'}
                  </Typography>
                </Box>
              </ProfilePaper>
            </Grid>

            {/* Personal Information (Editable) */}
            <Grid item xs={12} md={6}>
              <ProfilePaper>
                <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 600 }}>
                  Personal Information
                  <Typography component="span" sx={{ color: '#FF4500', fontSize: '0.85rem', ml: 1 }}>
                    (You can edit)
                  </Typography>
                </Typography>

                <StyledTextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editMode}
                  margin="normal"
                  placeholder="Enter your phone number"
                />

                <StyledTextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!editMode}
                  margin="normal"
                  multiline
                  rows={3}
                  placeholder="Enter your address"
                />

                <StyledTextField
                  fullWidth
                  label="Area of Interest"
                  name="area_of_interest"
                  value={formData.area_of_interest}
                  onChange={handleChange}
                  disabled={!editMode}
                  margin="normal"
                  multiline
                  rows={3}
                  placeholder="What are you interested in?"
                />

                {editMode && (
                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    <ActionButton
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      disabled={saving}
                      fullWidth
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </ActionButton>
                    <Button
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      disabled={saving}
                      fullWidth
                      sx={{
                        borderColor: '#2A2A2A',
                        color: '#999',
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: '#FF4500',
                          color: '#FF4500',
                        },
                      }}
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </ProfilePaper>
            </Grid>
          </Grid>

          {/* Account Settings */}
          <ProfilePaper>
            <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 600 }}>
              Account Settings
            </Typography>
            <Button
              variant="outlined"
              onClick={() => router.push('/change-password')}
              sx={{
                borderColor: '#2A2A2A',
                color: '#FF4500',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#FF4500',
                  backgroundColor: 'rgba(255, 69, 0, 0.1)',
                },
              }}
            >
              Change Password
            </Button>
          </ProfilePaper>
        </Container>
      </Box>
    </>
  );
}
