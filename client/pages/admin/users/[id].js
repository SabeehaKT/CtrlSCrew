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
  Grid,
  Avatar,
  Chip,
  Divider,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { apiClient } from '../../../utils/apiClient';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import InterestsIcon from '@mui/icons-material/Interests';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

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

const DetailPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#0D0D0D',
  border: '1px solid #1A1A1A',
  borderRadius: '16px',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

const InfoRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2.5),
  '&:last-child': {
    marginBottom: 0,
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

export default function UserDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const loadUserDetails = async () => {
      try {
        if (!apiClient.isAuthenticated()) {
          router.push('/login');
          return;
        }

        const currentUser = await apiClient.getCurrentUser();
        if (!currentUser.is_admin) {
          router.push('/dashboard');
          return;
        }

        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8000/api/admin/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user details');
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error loading user:', error);
        setError('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    loadUserDetails();
  }, [id, router]);

  const handleEdit = () => {
    router.push(`/admin?edit=${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#000' }}>
        <CircularProgress sx={{ color: '#FF4500' }} />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ color: '#fff' }}>{error || 'User not found'}</Typography>
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>User Details - {user.name} - ZenX Connect</title>
        <meta name="description" content="User Details" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ minHeight: '100vh', backgroundColor: '#000' }}>
        <StyledAppBar position="static">
          <Container maxWidth="xl">
            <Toolbar>
              <IconButton onClick={() => router.push('/admin')} sx={{ color: '#fff', mr: 2 }}>
                <ArrowBackIcon />
              </IconButton>
              <Logo sx={{ flexGrow: 1 }}>
                <span>ZenX</span> Connect
              </Logo>
            </Toolbar>
          </Container>
        </StyledAppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700 }}>
              User Details
            </Typography>
            <ActionButton startIcon={<EditIcon />} onClick={handleEdit}>
              Edit User
            </ActionButton>
          </Box>

          {/* Profile Header */}
          <DetailPaper>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: '#FF4500',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
                  {user.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Chip
                    label={user.is_admin ? 'Admin' : 'User'}
                    size="small"
                    sx={{
                      bgcolor: user.is_admin ? '#FF4500' : '#1A1A1A',
                      color: '#fff',
                      fontWeight: 600,
                    }}
                  />
                  {user.role && (
                    <Chip
                      label={user.role}
                      size="small"
                      sx={{
                        bgcolor: '#1A1A1A',
                        color: '#999',
                      }}
                    />
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#999' }}>
                  <EmailIcon fontSize="small" />
                  <Typography sx={{ fontSize: '0.9rem' }}>{user.email}</Typography>
                </Box>
              </Box>
            </Box>
          </DetailPaper>

          <Grid container spacing={3}>
            {/* Employment Information */}
            <Grid item xs={12} md={6}>
              <DetailPaper>
                <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkIcon sx={{ color: '#FF4500' }} />
                  Employment Information
                </Typography>

                <InfoRow>
                  <Box sx={{ minWidth: 120 }}>
                    <Typography sx={{ color: '#999', fontSize: '0.85rem' }}>Role</Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ color: '#fff', fontSize: '0.95rem' }}>
                      {user.role || 'Not assigned'}
                    </Typography>
                  </Box>
                </InfoRow>

                <Divider sx={{ borderColor: '#1A1A1A', my: 2 }} />

                <InfoRow>
                  <Box sx={{ minWidth: 120 }}>
                    <Typography sx={{ color: '#999', fontSize: '0.85rem' }}>Experience</Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ color: '#fff', fontSize: '0.95rem' }}>
                      {user.experience ? `${user.experience} years` : 'Not specified'}
                    </Typography>
                  </Box>
                </InfoRow>

                <Divider sx={{ borderColor: '#1A1A1A', my: 2 }} />

                <InfoRow>
                  <Box sx={{ minWidth: 120 }}>
                    <Typography sx={{ color: '#999', fontSize: '0.85rem' }}>Skills</Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ color: '#fff', fontSize: '0.95rem' }}>
                      {user.skills || 'Not specified'}
                    </Typography>
                  </Box>
                </InfoRow>
              </DetailPaper>
            </Grid>

            {/* Personal Information */}
            <Grid item xs={12} md={6}>
              <DetailPaper>
                <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InterestsIcon sx={{ color: '#FF4500' }} />
                  Personal Information
                </Typography>

                <InfoRow>
                  <PhoneIcon sx={{ color: '#999', fontSize: '1.2rem', mt: 0.5 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ color: '#999', fontSize: '0.85rem', mb: 0.5 }}>Phone Number</Typography>
                    <Typography sx={{ color: '#fff', fontSize: '0.95rem' }}>
                      {user.phone || 'Not provided'}
                    </Typography>
                  </Box>
                </InfoRow>

                <Divider sx={{ borderColor: '#1A1A1A', my: 2 }} />

                <InfoRow>
                  <HomeIcon sx={{ color: '#999', fontSize: '1.2rem', mt: 0.5 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ color: '#999', fontSize: '0.85rem', mb: 0.5 }}>Address</Typography>
                    <Typography sx={{ color: '#fff', fontSize: '0.95rem' }}>
                      {user.address || 'Not provided'}
                    </Typography>
                  </Box>
                </InfoRow>

                <Divider sx={{ borderColor: '#1A1A1A', my: 2 }} />

                <InfoRow>
                  <InterestsIcon sx={{ color: '#999', fontSize: '1.2rem', mt: 0.5 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ color: '#999', fontSize: '0.85rem', mb: 0.5 }}>Area of Interest</Typography>
                    <Typography sx={{ color: '#fff', fontSize: '0.95rem' }}>
                      {user.area_of_interest || 'Not provided'}
                    </Typography>
                  </Box>
                </InfoRow>
              </DetailPaper>
            </Grid>

            {/* Account Information */}
            <Grid item xs={12}>
              <DetailPaper>
                <Typography variant="h6" sx={{ color: '#fff', mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarTodayIcon sx={{ color: '#FF4500' }} />
                  Account Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <InfoRow>
                      <Box sx={{ minWidth: 120 }}>
                        <Typography sx={{ color: '#999', fontSize: '0.85rem' }}>Account Created</Typography>
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography sx={{ color: '#fff', fontSize: '0.95rem' }}>
                          {new Date(user.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Typography>
                      </Box>
                    </InfoRow>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <InfoRow>
                      <Box sx={{ minWidth: 120 }}>
                        <Typography sx={{ color: '#999', fontSize: '0.85rem' }}>Password Status</Typography>
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Chip
                          label={user.must_change_password ? 'Must Change' : 'Changed'}
                          size="small"
                          sx={{
                            bgcolor: user.must_change_password ? '#ff9800' : '#4CAF50',
                            color: '#fff',
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    </InfoRow>
                  </Grid>
                </Grid>
              </DetailPaper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
