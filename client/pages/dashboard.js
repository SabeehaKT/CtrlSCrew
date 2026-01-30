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
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { apiClient } from '../utils/apiClient';
import {
  SmartToy,
  CalendarMonth,
  School,
  Chat as ChatIcon,
  Schedule,
  RequestQuote,
  RocketLaunch,
  Security,
  ShowChart,
  MoreVert,
  Send,
  Close,
  Settings,
} from '@mui/icons-material';

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

const NavButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  textTransform: 'none',
  fontSize: '0.9rem',
  fontWeight: 500,
  margin: theme.spacing(0, 1.5),
  '&:hover': {
    color: '#fff',
    backgroundColor: 'transparent',
    opacity: 0.9,
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#111',
  border: '1px solid #1A1A1A',
  borderRadius: '20px',
  padding: theme.spacing(3),
  height: '100%',
  position: 'relative',
}));

const ZenXAiCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#111',
  border: '1px solid #1A1A1A',
  borderRadius: '20px',
  padding: theme.spacing(3),
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    background: 'radial-gradient(circle, rgba(255, 69, 0, 0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
}));

const QuickActionBtn = styled(Button)(({ theme }) => ({
  backgroundColor: '#1A1A1A',
  color: '#fff',
  borderRadius: '12px',
  padding: '20px 16px',
  textTransform: 'none',
  width: '100%',
  flexDirection: 'column',
  gap: 8,
  fontSize: '0.85rem',
  fontWeight: 500,
  border: '1px solid #222',
  minHeight: 100,
  '&:hover': {
    backgroundColor: '#222',
    borderColor: '#2A2A2A',
  },
}));

const ChatBubble = styled(Box)(({ isUser }) => ({
  maxWidth: '85%',
  padding: '10px 14px',
  borderRadius: '14px',
  marginBottom: 10,
  ...(isUser
    ? {
        marginLeft: 'auto',
        backgroundColor: '#FF4500',
        color: '#fff',
        borderBottomRightRadius: 4,
      }
    : {
        backgroundColor: '#1A1A1A',
        color: '#fff',
        borderBottomLeftRadius: 4,
      }),
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#111',
  border: '1px solid #1A1A1A',
  borderRadius: '16px',
  padding: theme.spacing(3),
  textAlign: 'center',
  height: '100%',
  transition: 'border-color 0.2s',
  '&:hover': {
    borderColor: '#2A2A2A',
  },
}));

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [payslipOpen, setPayslipOpen] = useState(false);
  const [payslipMonth, setPayslipMonth] = useState(null);
  const [payslipsListOpen, setPayslipsListOpen] = useState(false);
  const [chatBotOpen, setChatBotOpen] = useState(false);
  const [chatBotMessages, setChatBotMessages] = useState([
    { role: 'assistant', text: "Hello! I'm ZenX AI. How can I help you with payroll, leave, or HR queries today?" },
  ]);
  const [chatBotInput, setChatBotInput] = useState('');
  const [timesheetDialogOpen, setTimesheetDialogOpen] = useState(false);
  const [timesheetMode, setTimesheetMode] = useState('choice');
  const [weekTimesheet, setWeekTimesheet] = useState(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return { date: d, day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], hours: '', project: '', notes: '' };
    });
  });
  const [savedWeekTimesheet, setSavedWeekTimesheet] = useState(null);

  const PAYSLIP_MONTHS = [
    { label: 'January 2026', key: 'jan2026', periodStart: 'Jan 1, 2026', periodEnd: 'Jan 31, 2026', paymentDate: 'Jan 31, 2026', hasIncrement: true },
    { label: 'December 2025', key: 'dec2025', periodStart: 'Dec 1, 2025', periodEnd: 'Dec 31, 2025', paymentDate: 'Dec 31, 2025', hasIncrement: false },
    { label: 'November 2025', key: 'nov2025', periodStart: 'Nov 1, 2025', periodEnd: 'Nov 30, 2025', paymentDate: 'Nov 28, 2025', hasIncrement: false },
    { label: 'October 2025', key: 'oct2025', periodStart: 'Oct 1, 2025', periodEnd: 'Oct 31, 2025', paymentDate: 'Oct 31, 2025', hasIncrement: false },
  ];

  const handlePayslipSelect = (month) => {
    setPayslipMonth(month);
    setPayslipsListOpen(false);
    setPayslipOpen(true);
  };

  const handleChatBotSend = () => {
    if (!chatBotInput.trim()) return;
    setChatBotMessages((prev) => [...prev, { role: 'user', text: chatBotInput }]);
    setChatBotInput('');
    setTimeout(() => {
      setChatBotMessages((prev) => [
        ...prev,
        { role: 'assistant', text: "Thanks for your message. I'm here to help with HR queries. For detailed payroll or leave requests, please use the relevant sections on the dashboard." },
      ]);
    }, 600);
  };

  const handleTimesheetDayChange = (index, field, value) => {
    setWeekTimesheet((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleTimesheetSave = () => {
    setSavedWeekTimesheet([...weekTimesheet]);
    setTimesheetMode('view');
  };

  const getWeekStart = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
    return start;
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

  const firstName = user?.name?.split(' ')[0] || 'Sarah';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 1 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      <Head>
        <title>Personal Dashboard - ZenX Connect</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ backgroundColor: '#000', minHeight: '100vh' }}>
        {/* Top Navigation - ZenX Connect style */}
        <StyledAppBar position="fixed">
          <Container maxWidth="xl">
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px' }}>
              <Logo>
                <span>ZenX</span> Connect
              </Logo>

              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                <NavButton>Home</NavButton>
                <NavButton>Features</NavButton>
                <NavButton>About</NavButton>
                <Button
                  variant="contained"
                  sx={{
                    ml: 2,
                    bgcolor: '#FF4500',
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2.5,
                    py: 1,
                    borderRadius: '8px',
                    '&:hover': { bgcolor: '#E03E00' },
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </StyledAppBar>

        {/* Main Content - matches design: Personal Dashboard header, then 3-row layout */}
        <Container maxWidth="xl" sx={{ pt: '100px', pb: 6 }}>
          {/* Personal Dashboard header: title + welcome + Customize Layout */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 4 }}>
            <Box>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: { xs: '1.5rem', md: '1.75rem' }, mb: 0.5 }}>
                Personal Dashboard
              </Typography>
              <Typography sx={{ color: '#888', fontSize: '1rem' }}>
                Welcome back, {firstName}. Here&apos;s what&apos;s happening today.
              </Typography>
            </Box>
            <Button
              startIcon={<Settings sx={{ fontSize: 18 }} />}
              sx={{
                bgcolor: '#1A1A1A',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 500,
                border: '1px solid #2A2A2A',
                borderRadius: '10px',
                px: 2,
                py: 1.2,
                '&:hover': { bgcolor: '#222' },
              }}
            >
              Customize Layout
            </Button>
          </Box>

          {/* Two-column layout: Left (ZenX AI, Payroll|Leave, Active Learning) | Right (Quick Actions, ZenX Chat) */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'flex-start',
              gap: 3,
            }}
          >
            {/* Left column: ZenX AI, then Payroll + Leave side by side, then Active Learning */}
            <Box sx={{ flex: { xs: 'none', md: '1 1 0' }, minWidth: 0, width: { xs: '100%', md: 'auto' } }}>
              {/* ZenX AI Assistant - above Payroll and Leave */}
              <ZenXAiCard sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <SmartToy sx={{ color: '#FF4500', fontSize: 24 }} />
                  <Typography sx={{ color: '#FF4500', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1.5 }}>
                    ZENX AI ASSISTANT
                  </Typography>
                </Box>
                <Typography sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
                  {getGreeting()}, {firstName}!
                </Typography>
                <Typography sx={{ color: '#ccc', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  You&apos;ve worked 38 hours this week. Based on your project load, I recommend wrapping up your
                  documentation today to enjoy a meeting-free Friday.
                </Typography>
              </ZenXAiCard>

              {/* Payroll Summary (left) | Leave Balance (right) - side by side, top-aligned, directly below ZenX AI */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <StatCard sx={{ height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                          <Typography sx={{ color: '#999', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1.5 }}>
                            PAYROLL SUMMARY
                          </Typography>
                          <RequestQuote sx={{ color: '#666', fontSize: 16 }} />
                        </Box>
                        <Typography sx={{ color: '#4CAF50', fontSize: '2rem', fontWeight: 700 }}>
                          ₹4,30,000
                        </Typography>
                        <Typography sx={{ color: '#4CAF50', fontSize: '0.8rem', mb: 1 }}>
                          ↑ Net Pay (Est.) — includes ₹5,000 increment
                        </Typography>
                        <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>
                          Next Pay Date: Jan 31, 2026
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                        <Button
                          onClick={() => { setPayslipMonth(PAYSLIP_MONTHS[0]); setPayslipOpen(true); }}
                          sx={{
                            color: '#fff',
                            textTransform: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                          }}
                        >
                          VIEW PAYSLIP
                        </Button>
                      </Box>
                    </Box>
                  </StatCard>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StatCard sx={{ height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography sx={{ color: '#999', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1.5 }}>
                        LEAVE BALANCE
                      </Typography>
                      <Box sx={{ bgcolor: '#1A1A1A', borderRadius: '6px', p: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CalendarMonth sx={{ color: '#666', fontSize: 18 }} />
                      </Box>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                        <Typography sx={{ color: '#fff', fontSize: '0.8rem', fontWeight: 400 }}>Annual Leave</Typography>
                        <Typography sx={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>12 / 20 Days</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={60}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#1A1A1A',
                          '& .MuiLinearProgress-bar': { bgcolor: '#FF4500', borderRadius: 3 },
                        }}
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                        <Typography sx={{ color: '#fff', fontSize: '0.8rem', fontWeight: 400 }}>Sick Leave</Typography>
                        <Typography sx={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>8 / 10 Days</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={80}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#1A1A1A',
                          '& .MuiLinearProgress-bar': { bgcolor: '#4285F4', borderRadius: 3 },
                        }}
                      />
                    </Box>
                  </StatCard>
                </Grid>
              </Grid>

              {/* Active Learning - spans full width of left column (below Payroll + Leave) */}
          <Box sx={{ mb: 3 }}>
            <StatCard>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      minWidth: 80,
                      borderRadius: '12px',
                      bgcolor: '#1A1A1A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 40,
                        border: '2px solid #444',
                        borderRadius: '4px',
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: -6,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          border: '2px solid #444',
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <School sx={{ color: '#FF4500', fontSize: 20 }} />
                      <Typography sx={{ color: '#999', fontSize: '0.75rem', fontWeight: 600 }}>
                        LinkedIn Learning
                      </Typography>
                    </Box>
                    <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>
                      AI Integration in HR Workflows
                    </Typography>
                    <Typography sx={{ color: '#888', fontSize: '0.8rem', mb: 1 }}>
                      Module 3: Automated Screening Systems
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={72}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: '#1A1A1A',
                        '& .MuiLinearProgress-bar': { bgcolor: '#FF4500', borderRadius: 3 },
                      }}
                    />
                    <Typography sx={{ color: '#FF4500', fontSize: '0.75rem', mt: 0.5 }}>72% Completed</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                  <Button
                    sx={{
                      color: '#FF4500',
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      p: 0,
                      minWidth: 'auto',
                      '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                    }}
                  >
                    BROWSE COURSES
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => window.open('https://www.linkedin.com/feed/', '_blank')}
                    sx={{
                      bgcolor: '#FF4500',
                      color: '#fff',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 2.5,
                      py: 1,
                      borderRadius: '8px',
                      '&:hover': { bgcolor: '#E03E00' },
                    }}
                  >
                    RESUME
                  </Button>
                </Box>
              </Box>
            </StatCard>
          </Box>
            </Box>

            {/* Right column: Quick Actions (top), ZenX Assistant Chat (below) */}
            <Box sx={{ flex: { xs: 'none', md: '0 0 auto' }, width: { xs: '100%', md: 360 }, minWidth: 0 }}>
              <StatCard sx={{ mb: 3 }}>
                <Typography sx={{ color: '#999', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1.5, mb: 2 }}>
                  QUICK ACTIONS
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <QuickActionBtn>
                      <CalendarMonth sx={{ color: '#FF4500', fontSize: 28 }} />
                      Apply Leave
                    </QuickActionBtn>
                  </Grid>
                  <Grid item xs={6}>
                    <QuickActionBtn onClick={() => setPayslipsListOpen(true)}>
                      <RequestQuote sx={{ color: '#FF4500', fontSize: 28 }} />
                      Payslips
                    </QuickActionBtn>
                  </Grid>
                  <Grid item xs={6}>
                    <QuickActionBtn onClick={() => setChatBotOpen(true)}>
                      <ChatIcon sx={{ color: '#FF4500', fontSize: 28 }} />
                      AI Chat
                    </QuickActionBtn>
                  </Grid>
                  <Grid item xs={6}>
                    <QuickActionBtn onClick={() => { setTimesheetMode('choice'); setTimesheetDialogOpen(true); }}>
                      <Schedule sx={{ color: '#FF4500', fontSize: 28 }} />
                      Timesheet
                    </QuickActionBtn>
                  </Grid>
                </Grid>
              </StatCard>
              <StatCard sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4CAF50', boxShadow: '0 0 6px #4CAF50' }} />
                    <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>ZenX Assistant</Typography>
                  </Box>
                  <IconButton size="small" sx={{ color: '#666' }}>
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Box>
                <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 180 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                    <SmartToy sx={{ color: '#FF4500', fontSize: 24, flexShrink: 0 }} />
                    <ChatBubble isUser={false}>
                      <Typography sx={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                        Hello {firstName}! How can I help you today? I can help you with payroll, benefits, or leave requests.
                      </Typography>
                    </ChatBubble>
                  </Box>
                  <ChatBubble isUser>
                    <Typography sx={{ fontSize: '0.85rem' }}>When is my next performance review?</Typography>
                  </ChatBubble>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                    <SmartToy sx={{ color: '#FF4500', fontSize: 24, flexShrink: 0 }} />
                    <ChatBubble isUser={false}>
                      <Typography sx={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
                        Your next review is scheduled for November 15th with Michael Chen. Would you like me to add it to your calendar?
                      </Typography>
                    </ChatBubble>
                  </Box>
                </Box>
                <TextField
                  fullWidth
                  placeholder="Ask anything..."
                  onFocus={() => setChatBotOpen(true)}
                  variant="outlined"
                  size="small"
                  sx={{
                    mt: 1.5,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#1A1A1A',
                      borderRadius: '12px',
                      color: '#fff',
                      '& fieldset': { borderColor: '#2A2A2A' },
                      '&:hover fieldset': { borderColor: '#333' },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton sx={{ color: '#FF4500' }} size="small" onClick={() => setChatBotOpen(true)}>
                          <Send fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </StatCard>
            </Box>
          </Box>

          {/* Why ZenX Connect? */}
          <Box sx={{ mt: 8, mb: 6 }}>
            <Typography
              sx={{
                color: '#fff',
                fontSize: '1.5rem',
                fontWeight: 700,
                textAlign: 'center',
                mb: 3,
              }}
            >
              Why ZenX Connect?
            </Typography>
            <Grid container spacing={3} sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
              <Grid item xs={12} sm={4} sx={{ minWidth: 0 }}>
                <FeatureCard>
                  <RocketLaunch sx={{ color: '#FF4500', fontSize: 40, mb: 1.5 }} />
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem', mb: 1 }}>
                    Fast & Efficient
                  </Typography>
                  <Typography sx={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    Streamlined workflows to save time for what matters most.
                  </Typography>
                </FeatureCard>
              </Grid>
              <Grid item xs={12} sm={4} sx={{ minWidth: 0 }}>
                <FeatureCard>
                  <Security sx={{ color: '#4285F4', fontSize: 40, mb: 1.5 }} />
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem', mb: 1 }}>
                    Secure Access
                  </Typography>
                  <Typography sx={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    Enterprise-grade security to protect your sensitive data.
                  </Typography>
                </FeatureCard>
              </Grid>
              <Grid item xs={12} sm={4} sx={{ minWidth: 0 }}>
                <FeatureCard>
                  <ShowChart sx={{ color: '#4CAF50', fontSize: 40, mb: 1.5 }} />
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem', mb: 1 }}>
                    Insightful Analytics
                  </Typography>
                  <Typography sx={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    Real-time dashboards to give you better visibility.
                  </Typography>
                </FeatureCard>
              </Grid>
            </Grid>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 4,
              borderTop: '1px solid #1A1A1A',
              gap: 2,
            }}
          >
            <Logo sx={{ fontSize: '1rem' }}>
              <span>ZenX</span> Connect
            </Logo>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Button sx={{ color: '#666', textTransform: 'none', fontSize: '0.85rem', minWidth: 'auto', p: 0 }}>
                Privacy Policy
              </Button>
              <Button sx={{ color: '#666', textTransform: 'none', fontSize: '0.85rem', minWidth: 'auto', p: 0 }}>
                Terms of Service
              </Button>
              <Button sx={{ color: '#666', textTransform: 'none', fontSize: '0.85rem', minWidth: 'auto', p: 0 }}>
                Contact Support
              </Button>
            </Box>
            <Typography sx={{ color: '#666', fontSize: '0.8rem' }}>
              © 2026 ZenX Connect Portal. All rights reserved.
            </Typography>
          </Box>
        </Container>

        {/* Payslips list - previous 3 months */}
        <Dialog
          open={payslipsListOpen}
          onClose={() => setPayslipsListOpen(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#111',
              border: '1px solid #1A1A1A',
              borderRadius: '16px',
              color: '#fff',
            },
          }}
        >
          <DialogTitle sx={{ color: '#fff', fontWeight: 700, borderBottom: '1px solid #1A1A1A', pb: 2 }}>
            Previous Payslips
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            {PAYSLIP_MONTHS.map((month) => (
              <Button
                key={month.key}
                fullWidth
                onClick={() => handlePayslipSelect(month)}
                sx={{
                  justifyContent: 'flex-start',
                  color: '#fff',
                  textTransform: 'none',
                  fontSize: '1rem',
                  py: 1.5,
                  mb: 1,
                  border: '1px solid #222',
                  borderRadius: '10px',
                  '&:hover': { bgcolor: '#1A1A1A' },
                }}
                startIcon={<RequestQuote sx={{ color: '#FF4500' }} />}
              >
                {month.label}
              </Button>
            ))}
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid #1A1A1A' }}>
            <Button onClick={() => setPayslipsListOpen(false)} sx={{ color: '#888', textTransform: 'none' }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Payslip Dialog - split with cutoff and deductions (single month) */}
        <Dialog
          open={payslipOpen}
          onClose={() => { setPayslipOpen(false); setPayslipMonth(null); }}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#111',
              border: '1px solid #1A1A1A',
              borderRadius: '16px',
              color: '#fff',
            },
          }}
        >
          <DialogTitle sx={{ color: '#fff', fontWeight: 700, borderBottom: '1px solid #1A1A1A', pb: 2 }}>
            Payslip — {payslipMonth?.label || 'January 2026'}
          </DialogTitle>
          <DialogContent sx={{ pt: 2.5 }}>
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ color: '#999', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1, mb: 0.5 }}>
                PAY PERIOD (CUTOFF)
              </Typography>
              <Typography sx={{ color: '#fff', fontSize: '0.95rem' }}>
                {payslipMonth?.periodStart || 'Jan 1, 2026'} — {payslipMonth?.periodEnd || 'Jan 31, 2026'}
              </Typography>
              <Typography sx={{ color: '#888', fontSize: '0.8rem', mt: 0.5 }}>
                Payment date: {payslipMonth?.paymentDate || 'Jan 31, 2026'}
              </Typography>
            </Box>
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ color: '#999', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1, mb: 1 }}>
                EARNINGS
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>Basic Salary</Typography>
                <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>₹2,55,000</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>HRA</Typography>
                <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>₹72,000</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>Special Allowance</Typography>
                <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>₹1,30,000</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>Bonus / Other</Typography>
                <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>₹8,000</Typography>
              </Box>
              {payslipMonth?.hasIncrement && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                  <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>Increment</Typography>
                  <Typography sx={{ color: '#4CAF50', fontSize: '0.9rem' }}>₹5,000</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderTop: '1px solid #222' }}>
                <Typography sx={{ color: '#fff', fontWeight: 600 }}>Gross Pay</Typography>
                <Typography sx={{ color: '#fff', fontWeight: 600 }}>
                  ₹{payslipMonth?.hasIncrement ? '4,70,000' : '4,65,000'}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ color: '#999', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1, mb: 1 }}>
                DEDUCTIONS
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>Provident Fund (PF)</Typography>
                <Typography sx={{ color: '#f44336', fontSize: '0.9rem' }}>− ₹22,320</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>Professional Tax</Typography>
                <Typography sx={{ color: '#f44336', fontSize: '0.9rem' }}>− ₹2,500</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>Income Tax (TDS)</Typography>
                <Typography sx={{ color: '#f44336', fontSize: '0.9rem' }}>− ₹15,180</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderTop: '1px solid #222' }}>
                <Typography sx={{ color: '#fff', fontWeight: 600 }}>Total Deductions</Typography>
                <Typography sx={{ color: '#f44336', fontWeight: 600 }}>− ₹40,000</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1.5,
                px: 1.5,
                bgcolor: 'rgba(76, 175, 80, 0.1)',
                borderRadius: '10px',
                border: '1px solid rgba(76, 175, 80, 0.3)',
              }}
            >
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>Net Pay</Typography>
              <Typography sx={{ color: '#4CAF50', fontWeight: 700, fontSize: '1.15rem' }}>
                ₹{payslipMonth?.hasIncrement ? '4,30,000' : '4,25,000'}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid #1A1A1A' }}>
            <Button
              onClick={() => { setPayslipOpen(false); setPayslipMonth(null); }}
              sx={{
                color: '#888',
                textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* ZenX AI Chatbot - bottom-right popup */}
        {chatBotOpen && (
          <Paper
            elevation={8}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              width: 380,
              maxWidth: 'calc(100vw - 48px)',
              height: 480,
              maxHeight: '70vh',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#111',
              border: '1px solid #1A1A1A',
              borderRadius: '16px',
              overflow: 'hidden',
              zIndex: 1300,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #1A1A1A', bgcolor: '#0A0A0A' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SmartToy sx={{ color: '#FF4500', fontSize: 28 }} />
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>ZenX AI</Typography>
              </Box>
              <IconButton size="small" onClick={() => setChatBotOpen(false)} sx={{ color: '#888' }}>
                <Close />
              </IconButton>
            </Box>
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {chatBotMessages.map((msg, i) => (
                <ChatBubble key={i} isUser={msg.role === 'user'}>
                  <Typography sx={{ fontSize: '0.9rem' }}>{msg.text}</Typography>
                </ChatBubble>
              ))}
            </Box>
            <Box sx={{ p: 2, borderTop: '1px solid #1A1A1A' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type your message..."
                value={chatBotInput}
                onChange={(e) => setChatBotInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleChatBotSend()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#1A1A1A',
                    borderRadius: '12px',
                    color: '#fff',
                    '& fieldset': { borderColor: '#2A2A2A' },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton sx={{ color: '#FF4500' }} onClick={handleChatBotSend} size="small">
                        <Send />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Paper>
        )}

        {/* Timesheet Dialog - choice / create / view */}
        <Dialog
          open={timesheetDialogOpen}
          onClose={() => { setTimesheetDialogOpen(false); setTimesheetMode('choice'); }}
          maxWidth={timesheetMode === 'choice' ? 'xs' : 'md'}
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#111',
              border: '1px solid #1A1A1A',
              borderRadius: '16px',
              color: '#fff',
            },
          }}
        >
          <DialogTitle sx={{ color: '#fff', fontWeight: 700, borderBottom: '1px solid #1A1A1A', pb: 2 }}>
            {timesheetMode === 'choice' && 'Timesheet'}
            {timesheetMode === 'create' && 'Create New Timesheet'}
            {timesheetMode === 'view' && "This Week's Timesheet"}
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            {timesheetMode === 'choice' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Schedule />}
                  onClick={() => setTimesheetMode('create')}
                  sx={{
                    color: '#FF4500',
                    borderColor: '#FF4500',
                    textTransform: 'none',
                    py: 1.5,
                    '&:hover': { borderColor: '#FF4500', bgcolor: 'rgba(255,69,0,0.08)' },
                  }}
                >
                  Create new timesheet
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CalendarMonth />}
                  onClick={() => setTimesheetMode('view')}
                  sx={{
                    color: '#fff',
                    borderColor: '#333',
                    textTransform: 'none',
                    py: 1.5,
                    '&:hover': { borderColor: '#555', bgcolor: '#1A1A1A' },
                  }}
                >
                  View this week&apos;s timesheet
                </Button>
              </Box>
            )}

            {timesheetMode === 'create' && (
              <Box sx={{ pt: 1 }}>
                <Typography sx={{ color: '#888', fontSize: '0.85rem', mb: 2 }}>
                  Week starting: {weekTimesheet[0]?.date?.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      <Typography sx={{ color: '#999', fontSize: '0.75rem', width: 60 }}>Day</Typography>
                      <Typography sx={{ color: '#999', fontSize: '0.75rem', flex: 1, minWidth: 50 }}>Hours</Typography>
                      <Typography sx={{ color: '#999', fontSize: '0.75rem', flex: 2, minWidth: 80 }}>Project / Task</Typography>
                      <Typography sx={{ color: '#999', fontSize: '0.75rem', flex: 2, minWidth: 80 }}>Notes</Typography>
                    </Box>
                  </Grid>
                  {weekTimesheet.map((row, index) => (
                    <Grid item xs={12} key={index}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Typography sx={{ color: '#ccc', fontSize: '0.85rem', width: 60 }}>{row.day}</Typography>
                        <TextField
                          type="number"
                          size="small"
                          placeholder="0"
                          value={row.hours}
                          onChange={(e) => handleTimesheetDayChange(index, 'hours', e.target.value)}
                          inputProps={{ min: 0, max: 24, step: 0.5 }}
                          sx={{
                            width: 80,
                            '& .MuiOutlinedInput-root': { bgcolor: '#1A1A1A', color: '#fff', '& fieldset': { borderColor: '#333' } },
                          }}
                        />
                        <TextField
                          size="small"
                          placeholder="Project or task"
                          value={row.project}
                          onChange={(e) => handleTimesheetDayChange(index, 'project', e.target.value)}
                          sx={{
                            flex: 1,
                            minWidth: 120,
                            '& .MuiOutlinedInput-root': { bgcolor: '#1A1A1A', color: '#fff', '& fieldset': { borderColor: '#333' } },
                          }}
                        />
                        <TextField
                          size="small"
                          placeholder="Notes"
                          value={row.notes}
                          onChange={(e) => handleTimesheetDayChange(index, 'notes', e.target.value)}
                          sx={{
                            flex: 1,
                            minWidth: 120,
                            '& .MuiOutlinedInput-root': { bgcolor: '#1A1A1A', color: '#fff', '& fieldset': { borderColor: '#333' } },
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {timesheetMode === 'view' && (
              <Box sx={{ pt: 1 }}>
                <Typography sx={{ color: '#888', fontSize: '0.85rem', mb: 2 }}>
                  Week starting: {getWeekStart().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </Typography>
                {savedWeekTimesheet && savedWeekTimesheet.length > 0 ? (
                  <Grid container spacing={1.5}>
                    {savedWeekTimesheet.map((row, index) => (
                      <Grid item xs={12} key={index}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 1.5, bgcolor: '#1A1A1A', borderRadius: '8px' }}>
                          <Typography sx={{ color: '#fff', fontWeight: 600, width: 50 }}>{row.day}</Typography>
                          <Typography sx={{ color: '#ccc' }}>{row.hours || '0'} hrs</Typography>
                          <Typography sx={{ color: '#888' }}>{row.project || '—'}</Typography>
                          <Typography sx={{ color: '#666', fontSize: '0.85rem' }}>{row.notes || '—'}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography sx={{ color: '#888', fontSize: '0.9rem' }}>
                    No timesheet saved for this week yet. Create a new timesheet to add your hours.
                  </Typography>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid #1A1A1A' }}>
            {timesheetMode === 'choice' && (
              <Button onClick={() => { setTimesheetDialogOpen(false); setTimesheetMode('choice'); }} sx={{ color: '#888', textTransform: 'none' }}>
                Close
              </Button>
            )}
            {timesheetMode === 'create' && (
              <>
                <Button onClick={() => setTimesheetMode('choice')} sx={{ color: '#888', textTransform: 'none' }}>
                  Back
                </Button>
                <Button variant="contained" onClick={handleTimesheetSave} sx={{ bgcolor: '#FF4500', textTransform: 'none', '&:hover': { bgcolor: '#E03E00' } }}>
                  Save Timesheet
                </Button>
              </>
            )}
            {timesheetMode === 'view' && (
              <>
                <Button onClick={() => setTimesheetMode('choice')} sx={{ color: '#888', textTransform: 'none' }}>
                  Back
                </Button>
                <Button onClick={() => setTimesheetDialogOpen(false)} sx={{ color: '#888', textTransform: 'none' }}>
                  Close
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
