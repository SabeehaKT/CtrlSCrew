import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  CircularProgress,
  Grid,
  Avatar,
  Card,
  CardContent,
  Alert,
  Menu,
  MenuItem,
  TextField,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { apiClient } from '../utils/apiClient';
import {
  SelfImprovement,
  TrendingUp,
  LocalLibrary,
  WbSunny,
  FitnessCenter,
  Psychology,
  AutoStories,
  Send,
  Check,
} from '@mui/icons-material';

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

const DarkCard = styled(Card)(() => ({
  backgroundColor: '#0f0f0f',
  borderRadius: '16px',
  border: '1px solid #1a1a1a',
  boxShadow: 'none',
  transition: 'all 0.3s ease',
}));

const MoodBadge = styled(Box)(({ mood }) => {
  const colors = {
    CALM: '#4CAF50',
    MOTIVATED: '#2196F3',
    STRESSED: '#FF9800',
    OVERWHELMED: '#FF6B35',
    DISENGAGED: '#9C27B0',
  };
  
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 24px',
    borderRadius: '12px',
    backgroundColor: `${colors[mood] || '#666'}20`,
    border: `2px solid ${colors[mood] || '#666'}`,
    color: colors[mood] || '#666',
    fontWeight: 700,
    fontSize: '16px',
  };
});

export default function Wellbeing() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('checkin'); // 'checkin' or 'insights'
  
  // Story-based check-in state
  const [story, setStory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  
  // Wellness insights state
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!apiClient.isAuthenticated()) {
          router.push('/login');
          return;
        }
        const userData = await apiClient.getCurrentUser();
        setUser(userData);
        
        // Load story and questions
        await fetchStory();
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const fetchStory = async () => {
    try {
      const response = await apiClient.getWellbeingStory();
      if (response.success) {
        setStory(response.story);
        setQuestions(response.questions);
      }
    } catch (err) {
      console.error('Error fetching story:', err);
    }
  };

  const fetchWellnessInsights = async () => {
    setLoadingInsights(true);
    setError(null);
    
    try {
      const response = await apiClient.getWellnessInsights();
      
      if (response.success) {
        setInsights(response.insights);
      } else {
        setError('Failed to fetch wellness insights');
      }
    } catch (err) {
      console.error('Error fetching wellness insights:', err);
      setError(err.message || 'Failed to fetch wellness insights.');
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    
    try {
      const response = await apiClient.submitWellbeingResponse(answers);
      
      if (response.success) {
        setResult(response);
      } else {
        setError('Failed to submit responses');
      }
    } catch (err) {
      console.error('Error submitting responses:', err);
      setError(err.message || 'Failed to submit responses');
    } finally {
      setSubmitting(false);
    }
  };

  const resetCheckin = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setResult(null);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#FF6B35' }} />
      </Box>
    );
  }

  const firstName = user?.name?.split(' ')[0] || 'User';
  const currentQ = questions[currentQuestion];
  const allAnswered = questions.every(q => answers[q.id]);

  return (
    <>
      <Head>
        <title>Well-being - ZenX Connect</title>
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
                <NavButton onClick={() => router.push('/leave')}>Leaves</NavButton>
                <NavButton onClick={() => router.push('/career')}>Career</NavButton>
                <NavButton onClick={() => router.push('/learning')}>Learning</NavButton>
                <NavButton className="active">Wellbeing</NavButton>
                <NavButton onClick={() => router.push('/compliance')}>Compliance</NavButton>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>
                    {user?.name}
                  </Typography>
                  <Typography sx={{ fontSize: '11px', color: '#666', lineHeight: 1.2, mt: 0.3 }}>
                    {user?.role || 'Employee'}
                  </Typography>
                </Box>
                <Avatar 
                  onClick={handleMenuOpen}
                  sx={{ 
                    bgcolor: '#FF6B35', 
                    width: 40, 
                    height: 40,
                    fontWeight: 700,
                    fontSize: '16px',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: '#FF7F50',
                    },
                  }}
                >
                  {firstName.charAt(0).toUpperCase()}
                </Avatar>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      mt: 1,
                      minWidth: 180,
                    },
                  }}
                >
                  <MenuItem 
                    onClick={() => {
                      handleMenuClose();
                      router.push('/dashboard');
                    }}
                    sx={{ 
                      color: '#fff',
                      fontSize: '14px',
                      '&:hover': {
                        backgroundColor: '#2a2a2a',
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: '16px', mr: 1.5 }}>🏠</Typography>
                    Dashboard
                  </MenuItem>
                  <MenuItem 
                    onClick={() => {
                      handleMenuClose();
                      handleLogout();
                    }}
                    sx={{ 
                      color: '#FF6B35',
                      fontSize: '14px',
                      '&:hover': {
                        backgroundColor: '#2a2a2a',
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: '16px', mr: 1.5 }}>🚪</Typography>
                    Logout
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
              <Typography sx={{ fontSize: '36px' }}>🧘</Typography>
              <Typography sx={{ color: '#fff', fontSize: '32px', fontWeight: 700 }}>
                Your Well-being
              </Typography>
            </Box>
            <Typography sx={{ color: '#999', fontSize: '15px', mb: 3 }}>
              Reflect on your work experiences and get personalized wellness insights
            </Typography>

            {/* Tab Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant={activeTab === 'checkin' ? 'contained' : 'outlined'}
                startIcon={<AutoStories />}
                onClick={() => setActiveTab('checkin')}
                sx={{
                  backgroundColor: activeTab === 'checkin' ? '#FF6B35' : 'transparent',
                  color: activeTab === 'checkin' ? '#fff' : '#999',
                  borderColor: activeTab === 'checkin' ? '#FF6B35' : '#333',
                  textTransform: 'none',
                  fontSize: '15px',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: activeTab === 'checkin' ? '#FF7F50' : '#1a1a1a',
                    borderColor: activeTab === 'checkin' ? '#FF7F50' : '#555',
                  },
                }}
              >
                Story Check-in
              </Button>
              <Button
                variant={activeTab === 'insights' ? 'contained' : 'outlined'}
                startIcon={<TrendingUp />}
                onClick={() => {
                  setActiveTab('insights');
                  if (!insights) fetchWellnessInsights();
                }}
                sx={{
                  backgroundColor: activeTab === 'insights' ? '#FF6B35' : 'transparent',
                  color: activeTab === 'insights' ? '#fff' : '#999',
                  borderColor: activeTab === 'insights' ? '#FF6B35' : '#333',
                  textTransform: 'none',
                  fontSize: '15px',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: activeTab === 'insights' ? '#FF7F50' : '#1a1a1a',
                    borderColor: activeTab === 'insights' ? '#FF7F50' : '#555',
                  },
                }}
              >
                Wellness Insights
              </Button>
            </Box>
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
              }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {/* Story-Based Check-in Tab */}
          {activeTab === 'checkin' && !result && (
            <Box sx={{ width: '100%' }}>
              
              {/* Story Card */}
              {story && (
                <Box sx={{ mb: 3 }}>
                  <DarkCard>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 3 }}>
                        <AutoStories sx={{ color: '#FF6B35', fontSize: 48 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ color: '#FF6B35', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                            Reflection Story
                          </Typography>
                          <Typography sx={{ color: '#fff', fontSize: '24px', fontWeight: 700, mb: 2 }}>
                            {story.title}
                          </Typography>
                          <Typography sx={{ color: '#ccc', fontSize: '15px', lineHeight: 1.8 }}>
                            {story.story_text}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </DarkCard>
                </Box>
              )}

              {/* Progress Stepper */}
              {questions.length > 0 && (
                <Box sx={{ width: '100%' }}>
                  <DarkCard>
                    <CardContent sx={{ p: 4 }}>
                      <Stepper activeStep={currentQuestion} sx={{ mb: 4 }}>
                        {questions.map((q, index) => (
                          <Step key={q.id}>
                            <StepLabel
                              sx={{
                                '& .MuiStepLabel-label': {
                                  color: '#666',
                                  '&.Mui-active': { color: '#FF6B35' },
                                  '&.Mui-completed': { color: '#4CAF50' },
                                },
                                '& .MuiStepIcon-root': {
                                  color: '#333',
                                  '&.Mui-active': { color: '#FF6B35' },
                                  '&.Mui-completed': { color: '#4CAF50' },
                                },
                              }}
                            >
                              Q{index + 1}
                            </StepLabel>
                          </Step>
                        ))}
                      </Stepper>

                      {currentQ && (
                        <Box sx={{ width: '100%', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                          <Typography sx={{ color: '#fff', fontSize: '18px', fontWeight: 600, mb: 3, minHeight: '54px', display: 'flex', alignItems: 'center' }}>
                            {currentQ.question}
                          </Typography>
                          
                          <TextField
                            fullWidth
                            multiline
                            rows={8}
                            value={answers[currentQ.id] || ''}
                            onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                            placeholder="Share your thoughts..."
                            sx={{
                              flex: 1,
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: '#1a1a1a',
                                color: '#fff',
                                fontSize: '15px',
                                height: '100%',
                                '& fieldset': { borderColor: '#333' },
                                '&:hover fieldset': { borderColor: '#555' },
                                '&.Mui-focused fieldset': { borderColor: '#FF6B35' },
                              },
                              '& .MuiInputBase-input': {
                                height: '100% !important',
                              },
                            }}
                          />

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                            <Button
                              onClick={handleBack}
                              disabled={currentQuestion === 0}
                              sx={{
                                color: '#999',
                                textTransform: 'none',
                                '&:disabled': { color: '#333' },
                              }}
                            >
                              Back
                            </Button>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              {currentQuestion < questions.length - 1 ? (
                                <Button
                                  variant="contained"
                                  onClick={handleNext}
                                  disabled={!answers[currentQ.id]}
                                  sx={{
                                    backgroundColor: '#FF6B35',
                                    color: '#fff',
                                    textTransform: 'none',
                                    px: 3,
                                    '&:hover': { backgroundColor: '#FF7F50' },
                                    '&:disabled': { backgroundColor: '#333', color: '#666' },
                                  }}
                                >
                                  Next
                                </Button>
                              ) : (
                                <Button
                                  variant="contained"
                                  onClick={handleSubmit}
                                  disabled={!allAnswered || submitting}
                                  startIcon={submitting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : <Send />}
                                  sx={{
                                    backgroundColor: '#4CAF50',
                                    color: '#fff',
                                    textTransform: 'none',
                                    px: 3,
                                    '&:hover': { backgroundColor: '#45a049' },
                                    '&:disabled': { backgroundColor: '#333', color: '#666' },
                                  }}
                                >
                                  {submitting ? 'Analyzing...' : 'Submit'}
                                </Button>
                              )}
                            </Box>
                          </Box>

                          <Typography sx={{ color: '#666', fontSize: '12px', mt: 2, textAlign: 'center' }}>
                            Question {currentQuestion + 1} of {questions.length}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </DarkCard>
                </Box>
              )}
            </Box>
          )}

          {/* Results Display */}
          {activeTab === 'checkin' && result && (
            <Box sx={{ width: '100%' }}>
              <DarkCard>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Check sx={{ color: '#4CAF50', fontSize: 64, mb: 2 }} />
                    <Typography sx={{ color: '#4CAF50', fontSize: '24px', fontWeight: 700, mb: 1 }}>
                      Check-in Complete!
                    </Typography>
                    <Typography sx={{ color: '#999', fontSize: '14px', mb: 4 }}>
                      Thank you for taking the time to reflect
                    </Typography>

                    <Box sx={{ mb: 4 }}>
                      <Typography sx={{ color: '#666', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, mb: 2 }}>
                        Your Current Mood
                      </Typography>
                      <MoodBadge mood={result.mood}>
                        {result.mood}
                      </MoodBadge>
                      <Typography sx={{ color: '#ccc', fontSize: '15px', mt: 2, lineHeight: 1.6, maxWidth: 600, mx: 'auto' }}>
                        {result.reason}
                      </Typography>
                    </Box>

                    <Divider sx={{ bgcolor: '#1a1a1a', my: 4 }} />

                    <Box>
                      <Typography sx={{ color: '#FF6B35', fontSize: '18px', fontWeight: 700, mb: 3 }}>
                        {result.recommended_resources.title}
                      </Typography>
                      <Grid container spacing={2}>
                        {result.recommended_resources.resources.map((resource, index) => (
                          <Grid item xs={12} md={4} key={index}>
                            <Paper
                              sx={{
                                p: 3,
                                backgroundColor: '#1a1a1a',
                                border: '1px solid #2a2a2a',
                                borderRadius: '12px',
                                height: '100%',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  borderColor: '#FF6B35',
                                  transform: 'translateY(-4px)',
                                },
                              }}
                            >
                              <LocalLibrary sx={{ color: '#FF6B35', fontSize: 36, mb: 2 }} />
                              <Typography sx={{ color: '#fff', fontSize: '16px', fontWeight: 600, mb: 1 }}>
                                {resource.title}
                              </Typography>
                              <Chip 
                                label={resource.type} 
                                size="small" 
                                sx={{ 
                                  backgroundColor: '#FF6B3520',
                                  color: '#FF6B35',
                                  fontSize: '11px',
                                  mb: 2
                                }}
                              />
                              <Typography sx={{ color: '#888', fontSize: '13px', mb: 2 }}>
                                {resource.description}
                              </Typography>
                              <Button
                                href={resource.url}
                                target="_blank"
                                variant="outlined"
                                size="small"
                                sx={{
                                  borderColor: '#FF6B35',
                                  color: '#FF6B35',
                                  textTransform: 'none',
                                  '&:hover': {
                                    borderColor: '#FF7F50',
                                    backgroundColor: '#FF6B3510',
                                  },
                                }}
                              >
                                Explore
                              </Button>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>

                    <Button
                      onClick={resetCheckin}
                      variant="outlined"
                      sx={{
                        mt: 4,
                        borderColor: '#FF6B35',
                        color: '#FF6B35',
                        textTransform: 'none',
                        px: 4,
                        '&:hover': {
                          borderColor: '#FF7F50',
                          backgroundColor: '#FF6B3510',
                        },
                      }}
                    >
                      Take Another Check-in
                    </Button>
                  </CardContent>
                </DarkCard>
            </Box>
          )}

          {/* Wellness Insights Tab */}
          {activeTab === 'insights' && (
            <>
              {loadingInsights && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <CircularProgress sx={{ color: '#FF6B35', mb: 3 }} size={60} />
                  <Typography sx={{ color: '#999', fontSize: '16px' }}>
                    Analyzing your wellness patterns...
                  </Typography>
                </Box>
              )}

              {!loadingInsights && insights && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <DarkCard>
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                          <SelfImprovement sx={{ color: '#FF6B35', fontSize: 48 }} />
                          <Box sx={{ flex: 1 }}>
                            <Typography sx={{ color: '#FF6B35', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, mb: 2 }}>
                              Wellness Risk Level: {insights.risk_level}
                            </Typography>
                            <Typography sx={{ color: '#fff', fontSize: '20px', fontWeight: 600, lineHeight: 1.6 }}>
                              {insights.wellness_message}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </DarkCard>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <DarkCard>
                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <TrendingUp sx={{ color: '#4A90E2', fontSize: 40, mb: 2 }} />
                        <Typography sx={{ color: '#666', fontSize: '12px', mb: 1 }}>
                          Work Days
                        </Typography>
                        <Typography sx={{ color: '#fff', fontSize: '32px', fontWeight: 700 }}>
                          {insights.statistics.work_days_last_week}
                        </Typography>
                      </CardContent>
                    </DarkCard>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <DarkCard>
                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <WbSunny sx={{ color: '#FFA726', fontSize: 40, mb: 2 }} />
                        <Typography sx={{ color: '#666', fontSize: '12px', mb: 1 }}>
                          Total Hours
                        </Typography>
                        <Typography sx={{ color: '#fff', fontSize: '32px', fontWeight: 700 }}>
                          {insights.statistics.total_hours_last_week}h
                        </Typography>
                      </CardContent>
                    </DarkCard>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <DarkCard>
                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <LocalLibrary sx={{ color: '#9B59B6', fontSize: 40, mb: 2 }} />
                        <Typography sx={{ color: '#666', fontSize: '12px', mb: 1 }}>
                          Learning Days
                        </Typography>
                        <Typography sx={{ color: '#fff', fontSize: '32px', fontWeight: 700 }}>
                          {insights.statistics.learning_days_last_week}
                        </Typography>
                      </CardContent>
                    </DarkCard>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <DarkCard>
                      <CardContent sx={{ p: 3, textAlign: 'center' }}>
                        <FitnessCenter sx={{ color: '#4CAF50', fontSize: 40, mb: 2 }} />
                        <Typography sx={{ color: '#666', fontSize: '12px', mb: 1 }}>
                          Avg. Hours/Day
                        </Typography>
                        <Typography sx={{ color: '#fff', fontSize: '32px', fontWeight: 700 }}>
                          {insights.statistics.average_hours_per_day}h
                        </Typography>
                      </CardContent>
                    </DarkCard>
                  </Grid>
                </Grid>
              )}

              {!loadingInsights && !insights && !error && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography sx={{ fontSize: '64px', mb: 2 }}>📊</Typography>
                  <Typography sx={{ color: '#fff', fontSize: '20px', fontWeight: 600, mb: 1 }}>
                    No Wellness Data Yet
                  </Typography>
                  <Typography sx={{ color: '#999', fontSize: '14px' }}>
                    Start using the portal to get personalized wellness insights
                  </Typography>
                </Box>
              )}
            </>
          )}

        </Container>
      </Box>
    </>
  );
}
