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
  Avatar,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
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

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.25rem',
  cursor: 'pointer',
  '& span': {
    color: '#FF4500',
  },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#0A0A0A',
  boxShadow: 'none',
  borderBottom: '1px solid #1A1A1A',
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: '#666',
  textTransform: 'none',
  fontSize: '0.85rem',
  fontWeight: 500,
  margin: theme.spacing(0, 0.8),
  padding: theme.spacing(0.5, 1),
  whiteSpace: 'nowrap',
  minWidth: 'auto',
  '&:hover': {
    color: '#fff',
    backgroundColor: 'transparent',
  },
  '&.active': {
    color: '#FF4500',
  },
}));

const SkillsCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#0D0D0D',
  border: '1px solid #1A1A1A',
  borderRadius: '20px',
  padding: theme.spacing(3),
}));

const MilestoneCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF4500 0%, #FF6835 100%)',
  borderRadius: '20px',
  padding: theme.spacing(3.5),
  color: '#fff',
}));

const JobCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#0D0D0D',
  border: '1px solid #1A1A1A',
  borderRadius: '16px',
  padding: theme.spacing(3),
  cursor: 'pointer',
  transition: 'all 0.2s',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    borderColor: '#2A2A2A',
    transform: 'translateY(-2px)',
  },
}));

const MentorCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#0D0D0D',
  border: '1px solid #1A1A1A',
  borderRadius: '16px',
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(2),
}));

const LearningCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#0D0D0D',
  border: '1px solid #1A1A1A',
  borderRadius: '16px',
  padding: theme.spacing(2.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    borderColor: '#2A2A2A',
  },
}));

const ProgressBar = styled(Box)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: '#1A1A1A',
  overflow: 'hidden',
  position: 'relative',
}));

const ProgressFill = styled(Box)(({ value, color }) => ({
  height: '100%',
  width: `${value}%`,
  backgroundColor: color,
  borderRadius: 4,
  transition: 'width 0.3s ease',
}));

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    color: '#fff',
    backgroundColor: '#1A1A1A',
    borderRadius: '12px',
    '& fieldset': { borderColor: '#2A2A2A' },
    '&:hover fieldset': { borderColor: '#444' },
    '&.Mui-focused fieldset': { borderColor: '#FF4500', borderWidth: '1px' },
  },
  '& .MuiInputLabel-root': { color: '#888' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#FF4500' },
};

/** Shown when the roadmap-summary API is unavailable (e.g. backend not restarted). */
function getFallbackSummary(form) {
  return `Here's how you can get from ${form?.currentRole || 'your current role'} to ${form?.nextRole || 'your next role'}. By ${form?.nextDate || 'your target date'}, aim to take on more ownership, cross-team initiatives, and visible projects. Focus on Technical Leadership, Cloud Architecture, and Strategic Design to bridge the gap. From there, your path to ${form?.futureRole || 'your long-term goal'} will build on these steps—consider mentorship and curated learning to accelerate your growth.`;
}

export default function CareerPath() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [careerData, setCareerData] = useState(null);
  const [editRoadmapOpen, setEditRoadmapOpen] = useState(false);
  const [roadmapSummary, setRoadmapSummary] = useState(null);
  const [roadmapSummaryLoading, setRoadmapSummaryLoading] = useState(false);
  const [roadmapError, setRoadmapError] = useState(null);
  const [roadmapForm, setRoadmapForm] = useState({
    currentRole: '',
    nextRole: '',
    nextDate: '',
    futureRole: '',
  });

  const openEditRoadmap = () => {
    setEditRoadmapOpen(true);
    
    // Use career data from backend if available
    const form = careerData ? {
      currentRole: careerData.current_role,
      nextRole: careerData.next_milestone?.role || '',
      nextDate: careerData.next_milestone?.date || 'Q3 2025',
      futureRole: careerData.next_milestone?.future || '',
    } : {
      currentRole: user?.role || 'Employee',
      nextRole: 'Senior Position',
      nextDate: 'Q3 2025',
      futureRole: 'Leadership Role',
    };
    
    setRoadmapForm(form);
    setRoadmapSummary(null);
    setRoadmapError(null);
    setRoadmapSummaryLoading(true);
    
    const priorities = careerData?.growth_priorities?.map(p => p.skill) || ['Technical Leadership', 'Cloud Architecture', 'Strategic Design'];
    
    apiClient
      .getRoadmapSummary({
        current_role: form.currentRole,
        next_role: form.nextRole,
        next_date: form.nextDate,
        future_role: form.futureRole,
        growth_priorities: priorities,
      })
      .then((data) => setRoadmapSummary(data.summary))
      .catch((err) => {
        setRoadmapError(err.message || 'Could not load roadmap summary');
        setRoadmapSummary(getFallbackSummary(form));
      })
      .finally(() => setRoadmapSummaryLoading(false));
  };

  const closeEditRoadmap = () => {
    setEditRoadmapOpen(false);
    setRoadmapSummary(null);
    setRoadmapError(null);
  };

  const refreshRoadmapSummary = () => {
    setRoadmapError(null);
    setRoadmapSummaryLoading(true);
    
    const priorities = careerData?.growth_priorities?.map(p => p.skill) || ['Technical Leadership', 'Cloud Architecture', 'Strategic Design'];
    
    apiClient
      .getRoadmapSummary({
        current_role: roadmapForm.currentRole,
        next_role: roadmapForm.nextRole,
        next_date: roadmapForm.nextDate,
        future_role: roadmapForm.futureRole,
        growth_priorities: priorities,
      })
      .then((data) => setRoadmapSummary(data.summary))
      .catch((err) => {
        setRoadmapError(err.message || 'Could not load roadmap summary');
        setRoadmapSummary(getFallbackSummary(roadmapForm));
      })
      .finally(() => setRoadmapSummaryLoading(false));
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
        
        // Fetch career path data from backend
        try {
          const careerPathData = await apiClient.getCareerPath();
          setCareerData(careerPathData);
        } catch (error) {
          console.error('Error fetching career data:', error);
          // Continue without career data - will use defaults
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

  const handleLogout = () => {
    apiClient.logout();
    router.push('/');
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleMenuClose();
    router.push('/profile');
  };

  const handleChangePassword = () => {
    handleMenuClose();
    router.push('/change-password');
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#FF4500' }} />
      </Box>
    );
  }

  const firstName = user?.name?.split(' ')[0] || 'Alex';

  return (
    <>
      <Head>
        <title>Career Path - ZenX Connect</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ backgroundColor: '#000', minHeight: '100vh' }}>
        {/* Top Navigation */}
        <StyledAppBar position="fixed">
          <Container maxWidth="xl">
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px' }}>
              <Logo onClick={() => router.push('/dashboard')}>
                <span>ZenX</span> Connect
              </Logo>
              
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                <NavButton onClick={() => router.push('/dashboard')}>Home</NavButton>
                <NavButton onClick={() => router.push('/learning')}>Learning</NavButton>
                <NavButton onClick={() => router.push('/wellbeing')}>Wellbeing</NavButton>
                <NavButton className="active">Career</NavButton>
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
                    {user?.name?.charAt(0) || 'U'}
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
        <Container maxWidth="xl" sx={{ pt: '100px', pb: 6 }}>
          {/* Page Header */}
          <Box sx={{ mb: 5 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                color: '#fff', 
                fontWeight: 700, 
                fontSize: { xs: '2rem', md: '2.5rem' },
                mb: 1.5,
                lineHeight: 1.2
              }}
            >
              Elevate Your <span style={{ color: '#FF4500' }}>Career Path</span>
            </Typography>
            <Typography sx={{ color: '#888', fontSize: '1rem', lineHeight: 1.6 }}>
              AI-driven insights to help you navigate your professional journey, bridge skill gaps, and<br />
              find your next big opportunity within ZenX.
            </Typography>
          </Box>

          {/* Main Grid Layout */}
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
            {/* Left Column - Main Content */}
            <Box sx={{ flex: 1 }}>
              {/* Skills Analysis */}
              <SkillsCard sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}>
                    Skills Analysis
                  </Typography>
                  <Button 
                    startIcon={<span>🔄</span>}
                    sx={{ 
                      color: '#FF4500', 
                      textTransform: 'none', 
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      '&:hover': { backgroundColor: 'rgba(255, 69, 0, 0.05)' }
                    }}
                  >
                    Update Skills
                  </Button>
                </Box>

                <Typography sx={{ color: '#888', fontSize: '0.9rem', mb: 2.5 }}>
                  Based on your current role: {careerData?.current_role || user?.role || 'Employee'}
                </Typography>

                <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center' }}>
                  {/* Radar Chart Placeholder */}
                  <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                    <Box 
                      sx={{ 
                        position: 'relative',
                        width: 280,
                        height: 280,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/* Circular Radar Chart */}
                      <Box 
                        sx={{ 
                          position: 'relative',
                          width: 280,
                          height: 280,
                          borderRadius: '50%',
                          background: 'radial-gradient(circle, rgba(255,69,0,0.03) 0%, transparent 70%)',
                          border: '1px solid #1A1A1A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {/* Inner filled circle */}
                        <Box 
                          sx={{ 
                            width: 180,
                            height: 180,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(66, 133, 244, 0.25) 0%, rgba(66, 133, 244, 0.5) 100%)',
                            border: '2px solid rgba(66, 133, 244, 0.4)',
                          }}
                        />
                        
                        {/* Skill Labels */}
                        <Typography sx={{ position: 'absolute', top: -5, color: '#FF4500', fontSize: '0.75rem', fontWeight: 600 }}>
                          Leadership
                        </Typography>
                        <Typography sx={{ position: 'absolute', right: -15, color: '#FF4500', fontSize: '0.75rem', fontWeight: 600 }}>
                          Frontend
                        </Typography>
                        <Typography sx={{ position: 'absolute', bottom: -5, color: '#FF4500', fontSize: '0.75rem', fontWeight: 600 }}>
                          Product Strategy
                        </Typography>
                        <Typography sx={{ position: 'absolute', left: -25, color: '#FF4500', fontSize: '0.75rem', fontWeight: 600 }}>
                          Architecture
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Growth Priorities */}
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: '#999', fontSize: '0.75rem', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', mb: 2.5 }}>
                      GROWTH PRIORITIES
                    </Typography>

                    {careerData?.growth_priorities && careerData.growth_priorities.length > 0 ? (
                      careerData.growth_priorities.map((priority, index) => (
                        <Box key={index} sx={{ mb: index === careerData.growth_priorities.length - 1 ? 2 : 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography sx={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>
                              {priority.skill}
                            </Typography>
                            <Typography sx={{ color: priority.color || '#FF4500', fontSize: '0.9rem', fontWeight: 700 }}>
                              {priority.current}%
                            </Typography>
                          </Box>
                          <ProgressBar>
                            <ProgressFill value={priority.current} color={priority.color || '#FF4500'} />
                          </ProgressBar>
                        </Box>
                      ))
                    ) : (
                      <>
                        <Box sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography sx={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>
                              Technical Leadership
                            </Typography>
                            <Typography sx={{ color: '#FF4500', fontSize: '0.9rem', fontWeight: 700 }}>
                              85%
                            </Typography>
                          </Box>
                          <ProgressBar>
                            <ProgressFill value={85} color="#FF4500" />
                          </ProgressBar>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography sx={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>
                              Domain Expertise
                            </Typography>
                            <Typography sx={{ color: '#4A90E2', fontSize: '0.9rem', fontWeight: 700 }}>
                              70%
                            </Typography>
                          </Box>
                          <ProgressBar>
                            <ProgressFill value={70} color="#4A90E2" />
                          </ProgressBar>
                        </Box>
                      </>
                    )}

                    <Typography sx={{ color: '#888', fontSize: '0.8rem', fontStyle: 'italic', lineHeight: 1.5, mb: 0 }}>
                      "Focus on these areas to accelerate your career growth." — AI Advisor
                    </Typography>
                  </Box>
                </Box>
              </SkillsCard>

              {/* Recommended Internal Roles */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                  <Typography sx={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}>
                    Recommended Internal Roles
                  </Typography>
                  <Button sx={{ color: '#FF4500', textTransform: 'none', fontSize: '0.85rem', fontWeight: 600 }}>
                    View all jobs
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', gap: 2.5, flexDirection: { xs: 'column', md: 'row' } }}>
                  {careerData?.recommended_roles && careerData.recommended_roles.length > 0 ? (
                    careerData.recommended_roles.slice(0, 2).map((role, index) => {
                      const matchColor = role.match >= 85 ? '#4CAF50' : role.match >= 70 ? '#FF9800' : '#999';
                      const matchBg = role.match >= 85 ? 'rgba(76, 175, 80, 0.15)' : role.match >= 70 ? 'rgba(255, 152, 0, 0.15)' : 'rgba(153, 153, 153, 0.15)';
                      const gradients = [
                        'linear-gradient(135deg, #FF4500 0%, #FF6835 100%)',
                        'linear-gradient(135deg, #4A90E2 0%, #5BA3F5 100%)',
                        'linear-gradient(135deg, #34A853 0%, #4CAF50 100%)',
                      ];
                      const emojis = ['🎯', '🚀', '⭐'];
                      
                      return (
                        <Box key={index} sx={{ flex: 1 }}>
                          <JobCard>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box 
                                sx={{ 
                                  width: 48,
                                  height: 48,
                                  borderRadius: '12px',
                                  background: gradients[index % gradients.length],
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '1.5rem'
                                }}
                              >
                                {emojis[index % emojis.length]}
                              </Box>
                              <Chip 
                                label={`${role.match}% MATCH`}
                                size="small" 
                                sx={{ 
                                  bgcolor: matchBg,
                                  color: matchColor,
                                  fontWeight: 700,
                                  fontSize: '0.65rem',
                                  height: '24px',
                                  letterSpacing: 0.5
                                }} 
                              />
                            </Box>

                            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', mb: 1 }}>
                              {role.title}
                            </Typography>
                            <Typography sx={{ color: '#888', fontSize: '0.85rem', mb: 2, lineHeight: 1.5, flex: 1 }}>
                              {role.description}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
                              <Chip label="Remote" size="small" sx={{ bgcolor: '#1A1A1A', color: '#999', fontSize: '0.75rem', height: '26px' }} />
                              <Chip label={role.department} size="small" sx={{ bgcolor: '#1A1A1A', color: '#999', fontSize: '0.75rem', height: '26px' }} />
                            </Box>

                            <Button
                              fullWidth
                              sx={{
                                color: '#FF4500',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                '&:hover': { backgroundColor: 'rgba(255, 69, 0, 0.05)' }
                              }}
                            >
                              Details
                            </Button>
                          </JobCard>
                        </Box>
                      );
                    })
                  ) : (
                    <>
                      {/* Default fallback cards */}
                      <Box sx={{ flex: 1 }}>
                        <JobCard>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box 
                              sx={{ 
                                width: 48,
                                height: 48,
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #FF4500 0%, #FF6835 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem'
                              }}
                            >
                              🎯
                            </Box>
                            <Chip 
                              label="85% MATCH" 
                              size="small" 
                              sx={{ 
                                bgcolor: 'rgba(76, 175, 80, 0.15)', 
                                color: '#4CAF50',
                                fontWeight: 700,
                                fontSize: '0.65rem',
                                height: '24px',
                                letterSpacing: 0.5
                              }} 
                            />
                          </Box>

                          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', mb: 1 }}>
                            Senior Position
                          </Typography>
                          <Typography sx={{ color: '#888', fontSize: '0.85rem', mb: 2, lineHeight: 1.5, flex: 1 }}>
                            Progress to senior level in your current track
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
                            <Chip label="Remote" size="small" sx={{ bgcolor: '#1A1A1A', color: '#999', fontSize: '0.75rem', height: '26px' }} />
                            <Chip label="Your Department" size="small" sx={{ bgcolor: '#1A1A1A', color: '#999', fontSize: '0.75rem', height: '26px' }} />
                          </Box>

                          <Button
                            fullWidth
                            sx={{
                              color: '#FF4500',
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '0.9rem',
                              '&:hover': { backgroundColor: 'rgba(255, 69, 0, 0.05)' }
                            }}
                          >
                            Details
                          </Button>
                        </JobCard>
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            </Box>

            {/* Right Sidebar */}
            <Box sx={{ width: { xs: '100%', lg: '380px' }, flexShrink: 0 }}>
              {/* Next Career Milestone */}
              <MilestoneCard sx={{ mb: 3 }}>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, mb: 3 }}>
                  Next Career Milestone
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        bgcolor: '#fff',
                        border: '3px solid rgba(255,255,255,0.3)'
                      }} 
                    />
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.8, letterSpacing: 0.5 }}>
                        CURRENT
                      </Typography>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 700 }}>
                        {careerData?.current_role || user?.role || 'Employee'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, ml: 0.7 }}>
                    <Box 
                      sx={{ 
                        width: 2, 
                        height: 30, 
                        bgcolor: 'rgba(255,255,255,0.3)',
                      }} 
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        bgcolor: 'transparent',
                        border: '3px solid rgba(255,255,255,0.5)'
                      }} 
                    />
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.8, letterSpacing: 0.5 }}>
                        EST. {careerData?.next_milestone?.date || 'Q3 2025'}
                      </Typography>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 700 }}>
                        {careerData?.next_milestone?.role || 'Senior Position'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, ml: 0.7 }}>
                    <Box 
                      sx={{ 
                        width: 2, 
                        height: 30, 
                        bgcolor: 'rgba(255,255,255,0.2)',
                      }} 
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        bgcolor: 'transparent',
                        border: '3px solid rgba(255,255,255,0.3)'
                      }} 
                    />
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.8, letterSpacing: 0.5 }}>
                        FUTURE
                      </Typography>
                      <Typography sx={{ fontSize: '1rem', fontWeight: 700 }}>
                        {careerData?.next_milestone?.future || 'Leadership Role'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Button
                  fullWidth
                  onClick={openEditRoadmap}
                  sx={{
                    bgcolor: '#fff',
                    color: '#FF4500',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    py: 1.5,
                    borderRadius: '12px',
                    '&:hover': { bgcolor: '#f5f5f5' }
                  }}
                >
                  Edit Roadmap
                </Button>
              </MilestoneCard>

              {/* Mentorship */}
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, mb: 2 }}>
                  Mentorship
                </Typography>
                <Typography sx={{ color: '#888', fontSize: '0.85rem', mb: 2.5, lineHeight: 1.5 }}>
                  Connect with leaders who can help you reach your next milestone.
                </Typography>

                <MentorCard>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 50, 
                          height: 50,
                          bgcolor: '#FF4500'
                        }}
                      >
                        SC
                      </Avatar>
                      <Box>
                        <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
                          Sarah Chen
                        </Typography>
                        <Typography sx={{ color: '#888', fontSize: '0.8rem' }}>
                          VP Design • 12 years exp.
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton 
                      sx={{ 
                        color: '#FF4500',
                        '&:hover': { backgroundColor: 'rgba(255, 69, 0, 0.1)' }
                      }}
                    >
                      💬
                    </IconButton>
                  </Box>
                </MentorCard>

                <MentorCard>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 50, 
                          height: 50,
                          bgcolor: '#4A90E2'
                        }}
                      >
                        MR
                      </Avatar>
                      <Box>
                        <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>
                          Marcus Rodriguez
                        </Typography>
                        <Typography sx={{ color: '#888', fontSize: '0.8rem' }}>
                          Principal Architect
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton 
                      sx={{ 
                        color: '#FF4500',
                        '&:hover': { backgroundColor: 'rgba(255, 69, 0, 0.1)' }
                      }}
                    >
                      💬
                    </IconButton>
                  </Box>
                </MentorCard>

                <Button
                  fullWidth
                  sx={{
                    color: '#fff',
                    bgcolor: '#1A1A1A',
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    py: 1.5,
                    borderRadius: '12px',
                    border: '1px solid #222',
                    '&:hover': { bgcolor: '#222' }
                  }}
                >
                  Find New Mentor
                </Button>
              </Box>

              {/* Curated Learning */}
              <Box>
                <Typography sx={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, mb: 2 }}>
                  Curated Learning
                </Typography>

                <LearningCard>
                  <Box 
                    sx={{ 
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #4A90E2 0%, #5BA3F5 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem',
                      flexShrink: 0
                    }}
                  >
                    📘
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', mb: 0.5 }}>
                      Advanced System Design
                    </Typography>
                    <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>
                      4.5 HOURS • VIDEO COURSE
                    </Typography>
                  </Box>
                </LearningCard>

                <LearningCard>
                  <Box 
                    sx={{ 
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem',
                      flexShrink: 0
                    }}
                  >
                    📖
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', mb: 0.5 }}>
                      The Art of Leading Teams
                    </Typography>
                    <Typography sx={{ color: '#888', fontSize: '0.75rem' }}>
                      READING • CERTIFICATION
                    </Typography>
                  </Box>
                </LearningCard>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Edit Roadmap modal: AI narrative at top, then form */}
      <Dialog
        open={editRoadmapOpen}
        onClose={closeEditRoadmap}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#1A1A1A',
            border: '1px solid #2A2A2A',
            borderRadius: '16px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
          },
        }}
      >
        <DialogTitle
          sx={{
            color: '#fff',
            fontWeight: 700,
            fontSize: '1.5rem',
            pb: 3,
            pt: 3,
          }}
        >
          Edit your roadmap
        </DialogTitle>
        <DialogContent sx={{ pt: 0, pb: 3 }}>
          {/* AI Career Insights section */}
          <Box sx={{ mb: 4 }}>
            {roadmapSummaryLoading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 3 }}>
                <CircularProgress size={24} sx={{ color: '#FF4500' }} />
                <Typography sx={{ color: '#888', fontSize: '0.95rem' }}>
                  Generating your roadmap...
                </Typography>
              </Box>
            )}
            {!roadmapSummaryLoading && roadmapSummary && (
              <>
                <Paper
                  sx={{
                    p: 3,
                    backgroundColor: '#2D1810',
                    border: '1px solid #3D2820',
                    borderRadius: '12px',
                  }}
                >
                  {/* AI Career Insights header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Box sx={{ fontSize: '1.1rem' }}>✨</Box>
                    <Typography
                      sx={{
                        color: '#FF4500',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: 1.5,
                        textTransform: 'uppercase',
                      }}
                    >
                      AI Career Insights
                    </Typography>
                  </Box>
                  
                  {/* Summary text */}
                  <Typography sx={{ color: '#E0E0E0', fontSize: '0.95rem', lineHeight: 1.7, mb: 2.5 }}>
                    {roadmapSummary}
                  </Typography>
                  
                  {/* Bottom row: Update summary button and Last updated */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      size="small"
                      onClick={refreshRoadmapSummary}
                      sx={{
                        color: '#FF4500',
                        textTransform: 'none',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        p: 0,
                        minWidth: 0,
                        '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
                      }}
                    >
                      Update summary
                    </Button>
                    <Typography sx={{ color: '#666', fontSize: '0.75rem' }}>
                      Last updated today
                    </Typography>
                  </Box>
                </Paper>
                {roadmapError && (
                  <Typography sx={{ color: '#888', fontSize: '0.75rem', mt: 1.5 }}>
                    Using offline summary.&nbsp;
                    <Button
                      size="small"
                      onClick={refreshRoadmapSummary}
                      sx={{
                        color: '#FF9800',
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        minWidth: 0,
                        p: 0,
                        '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
                      }}
                    >
                      Try again
                    </Button>
                  </Typography>
                )}
              </>
            )}
          </Box>

          {/* Form section */}
          <Box>
            <Typography
              sx={{
                color: '#888',
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                mb: 2.5,
              }}
            >
              Your milestones
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography sx={{ color: '#999', fontSize: '0.8rem', mb: 0.75, fontWeight: 500 }}>
                  Current role
                </Typography>
                <TextField
                  value={roadmapForm.currentRole}
                  onChange={(e) => setRoadmapForm((p) => ({ ...p, currentRole: e.target.value }))}
                  fullWidth
                  placeholder="Senior UX Engineer"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      backgroundColor: '#0D0D0D',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      '& fieldset': { borderColor: '#2A2A2A' },
                      '&:hover fieldset': { borderColor: '#3A3A3A' },
                      '&.Mui-focused fieldset': { borderColor: '#FF4500', borderWidth: '1px' },
                    },
                    '& .MuiOutlinedInput-input': { py: 1.5 },
                  }}
                />
              </Box>
              
              <Box>
                <Typography sx={{ color: '#999', fontSize: '0.8rem', mb: 0.75, fontWeight: 500 }}>
                  Next role
                </Typography>
                <TextField
                  value={roadmapForm.nextRole}
                  onChange={(e) => setRoadmapForm((p) => ({ ...p, nextRole: e.target.value }))}
                  fullWidth
                  placeholder="Staff Engineer Candidate"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      backgroundColor: '#0D0D0D',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      '& fieldset': { borderColor: '#2A2A2A' },
                      '&:hover fieldset': { borderColor: '#3A3A3A' },
                      '&.Mui-focused fieldset': { borderColor: '#FF4500', borderWidth: '1px' },
                    },
                    '& .MuiOutlinedInput-input': { py: 1.5 },
                  }}
                />
              </Box>
              
              <Box>
                <Typography sx={{ color: '#999', fontSize: '0.8rem', mb: 0.75, fontWeight: 500 }}>
                  Target date (e.g. Q3 2024)
                </Typography>
                <TextField
                  value={roadmapForm.nextDate}
                  onChange={(e) => setRoadmapForm((p) => ({ ...p, nextDate: e.target.value }))}
                  fullWidth
                  placeholder="Q3 2024"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      backgroundColor: '#0D0D0D',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      '& fieldset': { borderColor: '#2A2A2A' },
                      '&:hover fieldset': { borderColor: '#3A3A3A' },
                      '&.Mui-focused fieldset': { borderColor: '#FF4500', borderWidth: '1px' },
                    },
                    '& .MuiOutlinedInput-input': { py: 1.5 },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1.5 }}>
          <Button
            onClick={closeEditRoadmap}
            sx={{
              color: '#999',
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
              px: 3,
              py: 1,
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={closeEditRoadmap}
            sx={{
              bgcolor: '#FF4500',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              px: 3.5,
              py: 1,
              borderRadius: '8px',
              '&:hover': { bgcolor: '#FF6835' }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
