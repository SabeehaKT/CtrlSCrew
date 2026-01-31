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
  IconButton,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LockIcon from '@mui/icons-material/Lock';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { apiClient } from '../utils/apiClient';

const StyledAppBar = styled(AppBar)(() => ({
  backgroundColor: '#000000',
  boxShadow: 'none',
  borderBottom: '1px solid #1a1a1a',
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.25rem',
  cursor: 'pointer',
  '& span': {
    color: '#FF4500',
  },
}));

const DarkCard = styled(Card)(() => ({
  backgroundColor: '#0f0f0f',
  borderRadius: '16px',
  border: '1px solid #1a1a1a',
  boxShadow: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: '#FF6B35',
  },
}));

const CourseCard = styled(Card)(() => ({
  backgroundColor: '#111111',
  borderRadius: '16px',
  border: '1px solid #1f1f1f',
  boxShadow: 'none',
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: '#FF6B35',
    boxShadow: '0 8px 24px rgba(255, 107, 53, 0.15)',
  },
}));

const PriorityBadge = styled(Box)(({ priority }) => {
  const colors = {
    1: '#FF6B35',
    2: '#FF8C42',
    3: '#4A90E2',
    4: '#9B59B6',
    5: '#666',
  };
  
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: colors[priority] || '#666',
    color: '#fff',
    fontWeight: 700,
    fontSize: '14px',
    boxShadow: `0 4px 12px ${colors[priority]}40`,
  };
});

const NavButton = styled(Button)(({ theme }) => ({
  color: '#888',
  textTransform: 'none',
  fontSize: '0.85rem',
  fontWeight: 500,
  margin: theme.spacing(0, 0.8),
  padding: theme.spacing(0.5, 1),
  whiteSpace: 'nowrap',
  minWidth: 'auto',
  '&:hover': {
    color: '#FF4500',
    backgroundColor: 'transparent',
  },
  '&.active': {
    color: '#FF4500',
  },
}));

export default function Learning() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    apiClient.logout();
    router.push('/login');
  };

  const handleProfile = () => {
    handleMenuClose();
    router.push('/profile');
  };

  const handleChangePassword = () => {
    handleMenuClose();
    router.push('/change-password');
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!apiClient.isAuthenticated()) {
          router.push('/login');
          return;
        }
        const userData = await apiClient.getCurrentUser();
        setUser(userData);
        
        // Automatically fetch recommendations on page load
        fetchRecommendations();
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const fetchRecommendations = async () => {
    setLoadingRecommendations(true);
    setError(null);
    
    try {
      const response = await apiClient.getCourseRecommendations();
      
      if (response.success) {
        setRecommendations(response.recommendations || []);
      } else {
        setError(response.error || 'Failed to get recommendations');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError(err.message || 'Failed to fetch course recommendations. Please try again.');
    } finally {
      setLoadingRecommendations(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#FF6B35' }} />
      </Box>
    );
  }

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <>
      <Head>
        <title>Learning - ZenX Connect</title>
      </Head>

      <Box sx={{ backgroundColor: '#000000', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
        
        {/* Top Navigation */}
        <StyledAppBar position="fixed">
          <Container maxWidth="xl">
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px' }}>
              <Logo onClick={() => router.push('/dashboard')}>
                <span>ZenX</span> Connect
              </Logo>
              
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                <NavButton onClick={() => router.push('/dashboard')}>Home</NavButton>
                <NavButton className="active">Learning</NavButton>
                <NavButton onClick={() => router.push('/wellbeing')}>Wellbeing</NavButton>
                <NavButton onClick={() => router.push('/career')}>Career</NavButton>
                <NavButton onClick={() => router.push('/leave')}>Leaves</NavButton>
                <NavButton onClick={() => router.push('/compliance')}>Compliance</NavButton>

              </Box>

              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ p: 0 }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: '#FF4500', 
                      width: 40, 
                      height: 40,
                      fontWeight: 700,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.8,
                      }
                    }}
                  >
                    {firstName.charAt(0)}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      backgroundColor: '#0D0D0D',
                      border: '1px solid #1A1A1A',
                      borderRadius: '12px',
                      mt: 1,
                      minWidth: 200,
                    },
                  }}
                >
                  <MenuItem onClick={handleProfile}>
                    <ListItemIcon>
                      <PersonIcon sx={{ color: '#FF4500' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="My Profile" 
                      primaryTypographyProps={{ sx: { color: '#fff' } }}
                    />
                  </MenuItem>
                  <MenuItem onClick={handleChangePassword}>
                    <ListItemIcon>
                      <LockIcon sx={{ color: '#FF4500' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Change Password" 
                      primaryTypographyProps={{ sx: { color: '#fff' } }}
                    />
                  </MenuItem>
                  <Divider sx={{ borderColor: '#1A1A1A', my: 1 }} />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon sx={{ color: '#FF4500' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Logout" 
                      primaryTypographyProps={{ sx: { color: '#fff' } }}
                    />
                  </MenuItem>
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </StyledAppBar>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ pt: '100px', pb: 8, px: 3 }}>
          
          {/* Header Section */}
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography sx={{ fontSize: '36px' }}>🎓</Typography>
              <Typography sx={{ color: '#fff', fontSize: '32px', fontWeight: 700 }}>
                Learning & Development
              </Typography>
            </Box>
            <Typography sx={{ color: '#999', fontSize: '15px', mb: 3 }}>
              AI-powered personalized course recommendations based on your profile and career goals
            </Typography>

            {/* Profile Summary Card */}
            <DarkCard sx={{ mb: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography sx={{ color: '#FF6B35', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, mb: 2 }}>
                  Your Learning Profile
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={3}>
                    <Typography sx={{ color: '#666', fontSize: '12px', mb: 0.5 }}>Role</Typography>
                    <Typography sx={{ color: '#fff', fontSize: '15px', fontWeight: 600 }}>
                      {user?.role || 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography sx={{ color: '#666', fontSize: '12px', mb: 0.5 }}>Experience</Typography>
                    <Typography sx={{ color: '#fff', fontSize: '15px', fontWeight: 600 }}>
                      {user?.experience ? `${user.experience} years` : 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography sx={{ color: '#666', fontSize: '12px', mb: 0.5 }}>Current Skills</Typography>
                    <Typography sx={{ color: '#fff', fontSize: '15px', fontWeight: 600 }}>
                      {user?.skills || 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography sx={{ color: '#666', fontSize: '12px', mb: 0.5 }}>Interests</Typography>
                    <Typography sx={{ color: '#fff', fontSize: '15px', fontWeight: 600 }}>
                      {user?.area_of_interest || 'Not specified'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </DarkCard>
          </Box>

          {/* Error Message */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                backgroundColor: '#1a0000',
                color: '#ff6b6b',
                border: '1px solid #ff0000',
                '& .MuiAlert-icon': {
                  color: '#ff6b6b',
                },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Loading State */}
          {loadingRecommendations && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#FF6B35', mb: 3 }} size={60} />
              <Typography sx={{ color: '#999', fontSize: '16px' }}>
                AI is analyzing your profile and finding the best courses...
              </Typography>
            </Box>
          )}

          {/* Recommendations Section */}
          {!loadingRecommendations && recommendations.length > 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Typography sx={{ color: '#fff', fontSize: '24px', fontWeight: 700 }}>
                  Your Personalized Recommendations
                </Typography>
                <Chip 
                  label={`${recommendations.length} Courses`}
                  sx={{ 
                    backgroundColor: 'rgba(255, 107, 53, 0.15)',
                    color: '#FF6B35',
                    fontWeight: 700,
                    fontSize: '12px',
                  }}
                />
              </Box>

              <Grid container spacing={3}>
                {recommendations.map((course, index) => (
                  <Grid item xs={12} key={index}>
                    <CourseCard>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', gap: 3 }}>
                          
                          {/* Priority Badge */}
                          <Box sx={{ flexShrink: 0 }}>
                            <PriorityBadge priority={course.priority}>
                              {course.priority}
                            </PriorityBadge>
                            <Typography sx={{ color: '#666', fontSize: '10px', textAlign: 'center', mt: 1 }}>
                              PRIORITY
                            </Typography>
                          </Box>

                          {/* Course Details */}
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box>
                                <Typography sx={{ color: '#fff', fontSize: '20px', fontWeight: 700, mb: 1 }}>
                                  {course.title}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                  <Chip 
                                    label={course.level}
                                    size="small"
                                    sx={{ 
                                      backgroundColor: course.level === 'Advanced' ? 'rgba(255, 107, 53, 0.15)' : 
                                                       course.level === 'Intermediate' ? 'rgba(74, 144, 226, 0.15)' : 
                                                       'rgba(76, 175, 80, 0.15)',
                                      color: course.level === 'Advanced' ? '#FF6B35' : 
                                             course.level === 'Intermediate' ? '#4A90E2' : 
                                             '#4CAF50',
                                      fontWeight: 600,
                                      fontSize: '11px',
                                    }}
                                  />
                                  <Chip 
                                    label={course.category}
                                    size="small"
                                    sx={{ 
                                      backgroundColor: '#1a1a1a',
                                      color: '#999',
                                      fontWeight: 500,
                                      fontSize: '11px',
                                    }}
                                  />
                                </Box>
                              </Box>
                              <Button
                                variant="contained"
                                href={course.course_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  backgroundColor: '#FF6B35',
                                  color: '#fff',
                                  textTransform: 'none',
                                  fontSize: '13px',
                                  fontWeight: 600,
                                  px: 3,
                                  py: 1,
                                  borderRadius: '8px',
                                  '&:hover': {
                                    backgroundColor: '#FF7F50',
                                  },
                                }}
                              >
                                Start Learning →
                              </Button>
                            </Box>

                            {/* AI Reason */}
                            <Box sx={{ 
                              backgroundColor: '#1a1a1a',
                              borderLeft: '3px solid #FF6B35',
                              padding: '14px 18px',
                              borderRadius: '8px',
                              mb: 2
                            }}>
                              <Typography sx={{ color: '#FF6B35', fontSize: '11px', fontWeight: 700, mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                                Why This Course?
                              </Typography>
                              <Typography sx={{ color: '#ccc', fontSize: '14px', lineHeight: 1.7 }}>
                                {course.reason}
                              </Typography>
                            </Box>

                            {/* Skills */}
                            {course.skills && course.skills.length > 0 && (
                              <Box>
                                <Typography sx={{ color: '#666', fontSize: '12px', mb: 1 }}>
                                  Skills you'll learn:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                  {course.skills.map((skill, idx) => (
                                    <Chip
                                      key={idx}
                                      label={skill}
                                      size="small"
                                      sx={{
                                        backgroundColor: '#0f0f0f',
                                        color: '#FF6B35',
                                        border: '1px solid #FF6B35',
                                        fontSize: '11px',
                                        fontWeight: 500,
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </CourseCard>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Empty State */}
          {!loadingRecommendations && recommendations.length === 0 && !error && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography sx={{ fontSize: '64px', mb: 2 }}>📚</Typography>
              <Typography sx={{ color: '#fff', fontSize: '20px', fontWeight: 600, mb: 1 }}>
                No Recommendations Yet
              </Typography>
              <Typography sx={{ color: '#999', fontSize: '14px' }}>
                Click "Get AI Recommendations" to discover personalized courses for your career growth
              </Typography>
            </Box>
          )}

        </Container>
      </Box>
    </>
  );
}
