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
  LinearProgress,
  Avatar,
  IconButton,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { apiClient } from '../utils/apiClient';

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

const NavButton = styled(Button)(({ theme }) => ({
  color: '#666',
  textTransform: 'none',
  fontSize: '0.9rem',
  fontWeight: 500,
  margin: theme.spacing(0, 1.5),
  '&:hover': {
    color: '#fff',
    backgroundColor: 'transparent',
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#111',
  border: '1px solid #1A1A1A',
  borderRadius: '20px',
  padding: theme.spacing(3),
  height: '100%',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5),
    borderRadius: '16px',
  },
}));

const OrangeGradientCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF4500 0%, #FF6835 100%)',
  borderRadius: '20px',
  padding: theme.spacing(3),
  height: '100%',
  color: '#fff',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5),
    borderRadius: '16px',
  },
}));

const EventCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#111',
  border: '1px solid #1A1A1A',
  borderRadius: '16px',
  padding: theme.spacing(2.5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    borderRadius: '14px',
  },
}));

const SideCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#111',
  border: '1px solid #1A1A1A',
  borderRadius: '16px',
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    borderRadius: '14px',
  },
}));

const QuickActionBtn = styled(Button)(({ theme }) => ({
  backgroundColor: '#1A1A1A',
  color: '#fff',
  borderRadius: '12px',
  padding: '14px 18px',
  textTransform: 'none',
  width: '100%',
  justifyContent: 'flex-start',
  fontSize: '0.9rem',
  fontWeight: 500,
  border: '1px solid #222',
  '&:hover': {
    backgroundColor: '#222',
    borderColor: '#2A2A2A',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '12px 16px',
    fontSize: '0.85rem',
    borderRadius: '10px',
  },
}));

const CourseCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#111',
  borderRadius: '16px',
  overflow: 'hidden',
  border: '1px solid #1A1A1A',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const EmojiButton = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  backgroundColor: '#1A1A1A',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.4rem',
  cursor: 'pointer',
  border: '2px solid transparent',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: '#222',
  },
  [theme.breakpoints.down('sm')]: {
    width: 44,
    height: 44,
    fontSize: '1.2rem',
  },
}));

const IconBox = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.3rem',
}));

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState(3);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!apiClient.isAuthenticated()) {
          router.push('/login');
          return;
        }
        const userData = await apiClient.getCurrentUser();
        
        // Redirect admins to admin panel
        if (userData.is_admin) {
          router.push('/admin');
          return;
        }
        
        setUser(userData);
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
        <title>Dashboard - ZenX Connect</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ backgroundColor: '#000', minHeight: '100vh' }}>
        {/* Top Navigation */}
        <StyledAppBar position="fixed">
          <Container maxWidth="xl">
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: '64px', md: '70px' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton 
                  sx={{ 
                    display: { xs: 'flex', md: 'none' }, 
                    color: '#fff',
                    mr: 1
                  }}
                  onClick={() => setMobileMenuOpen(true)}
                >
                  ☰
                </IconButton>
                <Logo>
                  <span>ZenX</span> Connect
                </Logo>
              </Box>
              
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5 }}>
                <NavButton>Home</NavButton>
                <NavButton>Learning</NavButton>
                <NavButton>Well-being</NavButton>
                <NavButton>Payroll</NavButton>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                <IconButton sx={{ color: '#999', '&:hover': { color: '#fff' }, display: { xs: 'none', sm: 'flex' } }}>
                  🌙
                </IconButton>
                <Box sx={{ textAlign: 'right', mr: 1.5, display: { xs: 'none', sm: 'block' } }}>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>
                    {user?.name || 'Alex Thompson'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#666', lineHeight: 1.3 }}>
                    Senior UX Designer
                  </Typography>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: '#FF4500', 
                    width: { xs: 38, sm: 44 }, 
                    height: { xs: 38, sm: 44 },
                    fontWeight: 700,
                    fontSize: { xs: '1rem', sm: '1.1rem' }
                  }}
                >
                  {firstName.charAt(0)}
                </Avatar>
              </Box>
            </Toolbar>
          </Container>
        </StyledAppBar>

        {/* Mobile Menu Drawer */}
        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              backgroundColor: '#0A0A0A',
              color: '#fff',
              width: 280,
              borderRight: '1px solid #1A1A1A',
            },
          }}
        >
          <Box sx={{ p: 3 }}>
            <Logo sx={{ mb: 3 }}>
              <span>ZenX</span> Connect
            </Logo>
            <Divider sx={{ borderColor: '#1A1A1A', mb: 2 }} />
            <List>
              <ListItem button onClick={() => setMobileMenuOpen(false)}>
                <ListItemText 
                  primary="Home" 
                  primaryTypographyProps={{ 
                    sx: { color: '#fff', fontWeight: 500, fontSize: '0.95rem' } 
                  }} 
                />
              </ListItem>
              <ListItem button onClick={() => setMobileMenuOpen(false)}>
                <ListItemText 
                  primary="Learning" 
                  primaryTypographyProps={{ 
                    sx: { color: '#fff', fontWeight: 500, fontSize: '0.95rem' } 
                  }} 
                />
              </ListItem>
              <ListItem button onClick={() => setMobileMenuOpen(false)}>
                <ListItemText 
                  primary="Well-being" 
                  primaryTypographyProps={{ 
                    sx: { color: '#fff', fontWeight: 500, fontSize: '0.95rem' } 
                  }} 
                />
              </ListItem>
              <ListItem button onClick={() => setMobileMenuOpen(false)}>
                <ListItemText 
                  primary="Payroll" 
                  primaryTypographyProps={{ 
                    sx: { color: '#fff', fontWeight: 500, fontSize: '0.95rem' } 
                  }} 
                />
              </ListItem>
              <Divider sx={{ borderColor: '#1A1A1A', my: 2 }} />
              <ListItem button onClick={handleLogout}>
                <ListItemText 
                  primary="Logout" 
                  primaryTypographyProps={{ 
                    sx: { color: '#FF4500', fontWeight: 600, fontSize: '0.95rem' } 
                  }} 
                />
              </ListItem>
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Container maxWidth="xl" sx={{ pt: { xs: '90px', md: '100px' }, pb: { xs: 4, md: 6 }, px: { xs: 0, sm: 2, md: 3 } }}>
          {/* Welcome Header */}
          <Box sx={{ mb: 5, px: { xs: 2, sm: 0 } }}>
            <Typography 
              variant="h3" 
              sx={{ 
                color: '#fff', 
                fontWeight: 700, 
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                mb: 1.5,
                lineHeight: 1.2
              }}
            >
              Welcome back, <span style={{ color: '#FF4500' }}>{firstName}</span>
            </Typography>
            <Typography sx={{ 
              color: '#888', 
              fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' }, 
              lineHeight: 1.6,
              display: { xs: 'block', sm: 'block' }
            }}>
              Ready for a productive day? You have 3 tasks due today and an AI-recommended
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'inline' } }}> learning path waiting for you.</Box>
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {/* Left Column - Main Content */}
            <Grid item xs={12} lg={8}>
              {/* Top 3 Cards */}
              <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }} sx={{ mb: { xs: 2, md: 3 } }}>
                {/* Active Tasks Card */}
                <Grid item xs={12} sm={4}>
                  <StatCard>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <IconBox sx={{ bgcolor: 'rgba(255, 69, 0, 0.1)' }}>
                        📋
                      </IconBox>
                      <Chip 
                        label="+2 new" 
                        size="small" 
                        sx={{ 
                          bgcolor: 'rgba(255, 69, 0, 0.15)', 
                          color: '#FF4500',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          height: '24px'
                        }} 
                      />
                    </Box>
                    <Typography sx={{ color: '#999', fontSize: '0.85rem', mb: 1 }}>
                      Active Tasks
                    </Typography>
                    <Typography sx={{ color: '#fff', fontSize: '2.5rem', fontWeight: 700, mb: 2 }}>
                      12
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={75} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        bgcolor: '#1A1A1A',
                        mb: 1,
                        '& .MuiLinearProgress-bar': { 
                          bgcolor: '#FF4500',
                          borderRadius: 3
                        }
                      }} 
                    />
                    <Typography sx={{ color: '#666', fontSize: '0.75rem' }}>
                      75% of weekly goal completed
                    </Typography>
                  </StatCard>
                </Grid>

                {/* Leave Balance Card */}
                <Grid item xs={12} sm={4}>
                  <StatCard>
                    <IconBox sx={{ bgcolor: 'rgba(66, 133, 244, 0.1)', mb: 2 }}>
                      📅
                    </IconBox>
                    <Typography sx={{ color: '#999', fontSize: '0.85rem', mb: 1 }}>
                      Leave Balance
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                      <Typography sx={{ color: '#fff', fontSize: '2.5rem', fontWeight: 700 }}>
                        18
                      </Typography>
                      <Typography sx={{ color: '#666', fontSize: '0.95rem' }}>
                        Days
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                      <Button 
                        size="small"
                        sx={{ 
                          bgcolor: '#1A1A1A',
                          color: '#fff',
                          textTransform: 'none',
                          fontSize: '0.8rem',
                          px: 2,
                          py: 0.75,
                          borderRadius: '8px',
                          '&:hover': { bgcolor: '#222' }
                        }}
                      >
                        Request Leave
                      </Button>
                      <Button 
                        size="small"
                        sx={{ 
                          color: '#FF4500',
                          textTransform: 'none',
                          fontSize: '0.8rem',
                          '&:hover': { bgcolor: 'rgba(255, 69, 0, 0.05)' }
                        }}
                      >
                        History
                      </Button>
                    </Box>
                  </StatCard>
                </Grid>

                {/* AI Suggestion Card */}
                <Grid item xs={12} sm={4}>
                  <OrangeGradientCard>
                    <IconBox sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mb: 2 }}>
                      ✨
                    </IconBox>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 1.5 }}>
                      AI Suggestion
                    </Typography>
                    <Typography sx={{ fontSize: '0.85rem', mb: 3, fontStyle: 'italic', lineHeight: 1.5, opacity: 0.95 }}>
                      "Based on your recent design work, you might enjoy the 'Advanced Prototyping' course."
                    </Typography>
                    <Button 
                      fullWidth
                      sx={{ 
                        bgcolor: '#fff', 
                        color: '#FF4500',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        py: 1.2,
                        borderRadius: '10px',
                        '&:hover': { bgcolor: '#f5f5f5' }
                      }}
                    >
                      View Recommendation
                    </Button>
                  </OrangeGradientCard>
                </Grid>
              </Grid>

              {/* What's Happening Section */}
              <Box sx={{ mb: { xs: 2, md: 3 }, px: { xs: 2, sm: 0 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ color: '#fff', fontSize: { xs: '1.1rem', md: '1.25rem' }, fontWeight: 700 }}>
                    What's Happening
                  </Typography>
                  <Button sx={{ color: '#FF4500', textTransform: 'none', fontSize: { xs: '0.8rem', md: '0.85rem' } }}>
                    View All
                  </Button>
                </Box>

                <EventCard>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
                    <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2.5 }, width: { xs: '100%', sm: 'auto' } }}>
                      <Box 
                        sx={{ 
                          bgcolor: '#1A1A1A', 
                          borderRadius: '12px', 
                          px: { xs: 1.5, sm: 2 },
                          py: 1.5,
                          textAlign: 'center',
                          minWidth: { xs: '50px', sm: '60px' }
                        }}
                      >
                        <Typography sx={{ color: '#FF4500', fontSize: { xs: '0.65rem', sm: '0.7rem' }, fontWeight: 700, letterSpacing: 0.5 }}>
                          OCT
                        </Typography>
                        <Typography sx={{ color: '#fff', fontSize: { xs: '1.5rem', sm: '1.75rem' }, fontWeight: 700, lineHeight: 1 }}>
                          24
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' }, mb: 0.5 }}>
                          Product Roadmap sync-up
                        </Typography>
                        <Typography sx={{ color: '#666', fontSize: { xs: '0.8rem', sm: '0.85rem' }, mb: 1.5 }}>
                          🕐 14:00 - 15:30 • Virtual
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                          <Avatar sx={{ width: { xs: 26, sm: 28 }, height: { xs: 26, sm: 28 }, fontSize: '0.75rem' }}>A</Avatar>
                          <Avatar sx={{ width: { xs: 26, sm: 28 }, height: { xs: 26, sm: 28 }, fontSize: '0.75rem' }}>B</Avatar>
                          <Avatar 
                            sx={{ 
                              width: { xs: 26, sm: 28 }, 
                              height: { xs: 26, sm: 28 }, 
                              bgcolor: '#1A1A1A',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              color: '#999'
                            }}
                          >
                            +6
                          </Avatar>
                        </Box>
                      </Box>
                    </Box>
                    <Chip 
                      label="ATTENDING" 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(76, 175, 80, 0.15)', 
                        color: '#4CAF50',
                        fontWeight: 700,
                        fontSize: { xs: '0.6rem', sm: '0.65rem' },
                        height: { xs: '24px', sm: '26px' },
                        letterSpacing: 0.5,
                        alignSelf: { xs: 'flex-start', sm: 'auto' }
                      }} 
                    />
                  </Box>
                </EventCard>
              </Box>

              {/* Recommended Learning */}
              <Box sx={{ px: { xs: 2, sm: 0 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>🎓</Box>
                  <Typography sx={{ color: '#fff', fontSize: { xs: '1.1rem', md: '1.25rem' }, fontWeight: 700 }}>
                    Recommended Learning
                  </Typography>
                </Box>

                <Grid container spacing={{ xs: 2, sm: 2.5 }}>
                  <Grid item xs={12} md={6}>
                    <CourseCard>
                      <Box 
                        sx={{ 
                          height: 180, 
                          bgcolor: '#1A1A1A',
                          position: 'relative',
                          backgroundImage: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '3rem',
                          opacity: 0.5
                        }}
                      >
                        📚
                        <Chip 
                          label="Expert" 
                          size="small" 
                          sx={{ 
                            position: 'absolute',
                            bottom: 12,
                            left: 12,
                            bgcolor: '#FF4500',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            height: '24px'
                          }} 
                        />
                      </Box>
                      <Box sx={{ p: 2 }}>
                        <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>
                          Mastering Systems Thinking
                        </Typography>
                        <Typography sx={{ color: '#666', fontSize: '0.8rem' }}>
                          4.5 hours • 12 Modules
                        </Typography>
                      </Box>
                    </CourseCard>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <CourseCard>
                      <Box 
                        sx={{ 
                          height: 180, 
                          bgcolor: '#1A1A1A',
                          position: 'relative',
                          backgroundImage: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '3rem',
                          opacity: 0.5
                        }}
                      >
                        📊
                        <Chip 
                          label="Intermediate" 
                          size="small" 
                          sx={{ 
                            position: 'absolute',
                            bottom: 12,
                            left: 12,
                            bgcolor: '#4A90E2',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            height: '24px'
                          }} 
                        />
                      </Box>
                      <Box sx={{ p: 2 }}>
                        <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>
                          Data Visualization Best Practices
                        </Typography>
                        <Typography sx={{ color: '#666', fontSize: '0.8rem' }}>
                          2 hours • 8 Modules
                        </Typography>
                      </Box>
                    </CourseCard>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Right Sidebar */}
            <Grid item xs={12} lg={4} sx={{ px: { xs: 2, sm: 0 } }}>
              {/* Daily Pulse */}
              <SideCard>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>❤️</Box>
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: '0.9rem', sm: '0.95rem' } }}>
                    Daily Pulse
                  </Typography>
                </Box>
                <Typography sx={{ color: '#777', fontSize: { xs: '0.8rem', sm: '0.85rem' }, mb: 2.5 }}>
                  How are you feeling today?
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5, px: { xs: 0, sm: 1 } }}>
                  {['😊', '😐', '😕', '😞'].map((emoji, idx) => (
                    <EmojiButton
                      key={idx}
                      onClick={() => setSelectedMood(idx)}
                      sx={{
                        bgcolor: selectedMood === idx ? '#FF4500' : '#1A1A1A',
                        borderColor: selectedMood === idx ? '#FF4500' : 'transparent',
                        '&:hover': {
                          bgcolor: selectedMood === idx ? '#FF4500' : '#222',
                        }
                      }}
                    >
                      {emoji}
                    </EmojiButton>
                  ))}
                </Box>
                <Button
                  fullWidth
                  sx={{
                    color: '#fff',
                    bgcolor: '#1A1A1A',
                    textTransform: 'none',
                    fontSize: '0.85rem',
                    py: 1.2,
                    borderRadius: '10px',
                    border: '1px solid #222',
                    '&:hover': { bgcolor: '#222' }
                  }}
                >
                  See well-being report
                </Button>
              </SideCard>

              {/* Quick Actions */}
              <Box sx={{ mb: 2 }}>
                <Typography 
                  sx={{ 
                    color: '#666', 
                    fontSize: { xs: '0.65rem', sm: '0.7rem' }, 
                    fontWeight: 700, 
                    mb: 2, 
                    letterSpacing: 1.5,
                    textTransform: 'uppercase'
                  }}
                >
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <QuickActionBtn startIcon={<span>📄</span>}>
                    Payslips & Tax
                  </QuickActionBtn>
                  <QuickActionBtn startIcon={<span>👤</span>}>
                    Job Profile
                  </QuickActionBtn>
                  <QuickActionBtn startIcon={<span>👥</span>}>
                    Org Directory
                  </QuickActionBtn>
                </Box>
              </Box>

              {/* AI Assistant */}
              <SideCard sx={{ textAlign: 'center' }}>
                <Box 
                  sx={{ 
                    width: 70, 
                    height: 70, 
                    borderRadius: '50%', 
                    bgcolor: '#1A1A1A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 2.5,
                    fontSize: '2rem'
                  }}
                >
                  🤖
                </Box>
                <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem', mb: 1 }}>
                  Need assistance?
                </Typography>
                <Typography sx={{ color: '#777', fontSize: '0.85rem', mb: 3, lineHeight: 1.5 }}>
                  Chat with ZenX AI assistant for immediate help with HR queries.
                </Typography>
                <Button
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #FF4500 0%, #FF6835 100%)',
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    py: 1.4,
                    borderRadius: '10px',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #FF6835 0%, #FF4500 100%)',
                    }
                  }}
                >
                  Start Chat
                </Button>
              </SideCard>
            </Grid>
          </Grid>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: { xs: 6, md: 8 }, pt: { xs: 3, md: 4 }, borderTop: '1px solid #1A1A1A', px: { xs: 2, sm: 0 } }}>
            <Typography sx={{ color: '#666', fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
              © 2024 ZenX Connect. All rights reserved. Secure employee environment.
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}
