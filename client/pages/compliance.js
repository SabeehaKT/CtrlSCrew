import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  CircularProgress,
  LinearProgress,
  IconButton,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Avatar,
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
import {
  School,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Schedule,
  Edit,
  MenuBook,
  Security,
  Home as HomeIcon,
  HealthAndSafety,
  Policy as PolicyIcon,
  Search,
  Notifications,
} from '@mui/icons-material';
import { apiClient } from '../utils/apiClient';
import policiesData from '../data/policies.json';
import signatureDocumentsData from '../data/signatureDocuments.json';

// Styled Components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#0A0A0A',
  boxShadow: 'none',
  borderBottom: '1px solid #1A1A1A',
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  fontWeight: 700,
  color: '#fff',
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
  '&:active': {
    color: '#FF4500',
  },
}));

const ComplianceCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#111',
  border: '1px solid #1A1A1A',
  borderRadius: '16px',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
}));

const PolicyCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#111',
  border: '1px solid #1A1A1A',
  borderRadius: '12px',
  padding: theme.spacing(2.5),
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    borderColor: '#2A2A2A',
    transform: 'translateY(-2px)',
  },
}));

const StatusBadge = styled(Box)(({ status }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: 600,
  backgroundColor: status === 'pending' ? 'rgba(255, 69, 0, 0.1)' : 
                   status === 'overdue' ? 'rgba(255, 0, 0, 0.1)' : 
                   status === 'completed' ? 'rgba(76, 175, 80, 0.1)' : 
                   'rgba(136, 136, 136, 0.1)',
  color: status === 'pending' ? '#FF4500' : 
         status === 'overdue' ? '#FF0000' : 
         status === 'completed' ? '#4CAF50' : 
         '#888',
}));

export default function Compliance() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [trainings, setTrainings] = useState([
    {
      id: 1,
      title: 'Mandatory Training',
      description: 'Complete these to stay compliant',
      tasksPending: 4,
      status: 'pending',
    },
    {
      id: 2,
      title: 'Data Privacy & GDPR 2024',
      description: 'Due by Oct 15, 2024 • 45 mins',
      status: 'overdue',
      progress: 65,
    },
    {
      id: 3,
      title: 'Cybersecurity Essentials',
      description: 'Due in 5 days • 20 mins',
      status: 'pending',
    },
    {
      id: 4,
      title: 'Workplace Diversity & Inclusion',
      description: 'Completed on Nov 02, 2024',
      status: 'completed',
    },
  ]);

  const [signatures, setSignatures] = useState([]);

  useEffect(() => {
    // Select random 2-3 documents for this user based on their user ID
    const selectUserDocuments = (userId) => {
      // Use user ID as seed for consistent randomization
      const seed = userId || 1;
      const numDocs = 2 + (seed % 2); // 2 or 3 documents per user
      
      // Create a shuffled copy of documents based on user ID
      const shuffled = [...signatureDocumentsData].sort((a, b) => {
        // Simple seeded sort based on user ID and document ID
        const hashA = (seed * 7 + a.id.length) % 100;
        const hashB = (seed * 7 + b.id.length) % 100;
        return hashA - hashB;
      });
      
      // Take first numDocs documents
      return shuffled.slice(0, numDocs).map(doc => ({
        id: doc.id,
        title: doc.title,
        status: doc.status,
        addedDate: doc.addedDate,
        dueDate: doc.dueDate
      }));
    };
    
    // Will be set after user is loaded
    setSignatures([]);
  }, []);

  const [policies, setPolicies] = useState(policiesData.map(policy => ({
    id: policy.id,
    title: policy.title,
    description: policy.description,
    category: policy.category,
    lastUpdated: policy.lastUpdated,
    icon: policy.icon
  })));

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPolicies, setFilteredPolicies] = useState(policies);

  const [complianceStats, setComplianceStats] = useState({
    percentage: 0,
    completed: 0,
    urgent: 1,
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
        
        // Select random documents for this user
        const selectUserDocuments = (userId) => {
          const seed = userId || 1;
          const numDocs = 2 + (seed % 2); // 2 or 3 documents per user
          
          const shuffled = [...signatureDocumentsData].sort((a, b) => {
            const hashA = (seed * 7 + a.id.length) % 100;
            const hashB = (seed * 7 + b.id.length) % 100;
            return hashA - hashB;
          });
          
          return shuffled.slice(0, numDocs).map(doc => ({
            id: doc.id,
            title: doc.title,
            status: doc.status,
            addedDate: doc.addedDate,
            dueDate: doc.dueDate
          }));
        };
        
        setSignatures(selectUserDocuments(userData.id));
        
        // Calculate policy completion percentage
        calculateComplianceStats();
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const calculateComplianceStats = () => {
    // Get policy acknowledgments from localStorage
    const acknowledgments = JSON.parse(localStorage.getItem('policyAcknowledgments') || '{}');
    const totalPolicies = policiesData.length;
    const acknowledgedCount = Object.keys(acknowledgments).length;
    
    // Calculate percentage
    const percentage = Math.round((acknowledgedCount / totalPolicies) * 100);
    
    // Update stats - including training completion count (12) + acknowledged policies
    setComplianceStats({
      percentage: percentage,
      completed: acknowledgedCount,
      urgent: totalPolicies - acknowledgedCount, // Policies not yet acknowledged
    });
  };

  // Filter policies based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPolicies(policies);
    } else {
      const filtered = policies.filter(policy =>
        policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        policy.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPolicies(filtered);
    }
  }, [searchQuery, policies]);

  // Recalculate compliance stats when page becomes visible (user returns from policy page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        calculateComplianceStats();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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

  const handleLogout = () => {
    apiClient.logout();
    router.push('/');
  };

  const handlePolicyClick = (policyId) => {
    router.push(`/policy/${policyId}`);
  };

  const isPolicyAcknowledged = (policyId) => {
    const acknowledgments = JSON.parse(localStorage.getItem('policyAcknowledgments') || '{}');
    return acknowledgments[policyId] !== undefined;
  };

  const isDocumentSigned = (docId) => {
    const signatures = JSON.parse(localStorage.getItem('documentSignatures') || '{}');
    return signatures[docId] !== undefined;
  };

  const handleSignatureDocumentClick = (docId) => {
    router.push(`/signature/${docId}`);
  };

  const getIconComponent = (iconName) => {
    const iconMap = {
      'MenuBook': <MenuBook sx={{ color: '#888' }} />,
      'Security': <Security sx={{ color: '#888' }} />,
      'Home': <HomeIcon sx={{ color: '#888' }} />,
      'HealthAndSafety': <HealthAndSafety sx={{ color: '#888' }} />,
      'Policy': <PolicyIcon sx={{ color: '#888' }} />,
    };
    return iconMap[iconName] || <PolicyIcon sx={{ color: '#888' }} />;
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#FF4500' }} />
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>Compliance & Policy Center - ZenX Connect</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ backgroundColor: '#000', minHeight: '100vh' }}>
        {/* Top Navigation */}
        <StyledAppBar position="fixed">
          <Container maxWidth="xl">
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px' }}>
              <Logo>
                <span>ZenX</span> Connect
              </Logo>

              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                <NavButton onClick={() => router.push('/dashboard')}>Home</NavButton>
                <NavButton onClick={() => router.push('/learning')}>Learning</NavButton>
                <NavButton onClick={() => router.push('/wellbeing')}>Wellbeing</NavButton>
                <NavButton onClick={() => router.push('/career')}>Career</NavButton>
                <NavButton onClick={() => router.push('/leave')}>Leaves</NavButton>
                <NavButton className="active">Compliance</NavButton>
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
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.75rem', mb: 1 }}>
              Compliance & Policy Center
            </Typography>
            <Typography sx={{ color: '#888', fontSize: '0.95rem' }}>
              Manage your mandatory certifications, digital signatures, and access company resources.
            </Typography>
          </Box>

          {/* Two Column Layout */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
            {/* Left Column */}
            <Box sx={{ flex: 1 }}>
              {/* Mandatory Training */}
              <ComplianceCard>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '8px', bgcolor: 'rgba(255, 69, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                    <School sx={{ color: '#FF4500' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem', mb: 0.5 }}>
                      Mandatory Training
                    </Typography>
                    <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>
                      Complete these to stay compliant
                    </Typography>
                  </Box>
                  <StatusBadge status="pending">
                    4 TASKS PENDING
                  </StatusBadge>
                </Box>

                {/* Training Items */}
                {trainings.slice(1).map((training, index) => (
                  <Box key={training.id} sx={{ display: 'flex', alignItems: 'center', py: 2, borderTop: index === 0 ? 'none' : '1px solid #1A1A1A' }}>
                    <Box sx={{ mr: 2 }}>
                      {training.status === 'overdue' && <ErrorIcon sx={{ color: '#FF0000' }} />}
                      {training.status === 'pending' && <Schedule sx={{ color: '#888' }} />}
                      {training.status === 'completed' && <CheckCircle sx={{ color: '#4CAF50' }} />}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500, mb: 0.5 }}>
                        {training.title}
                      </Typography>
                      <Typography sx={{ color: '#888', fontSize: '0.8rem' }}>
                        {training.description}
                      </Typography>
                      {training.progress && (
                        <LinearProgress
                          variant="determinate"
                          value={training.progress}
                          sx={{
                            mt: 1,
                            height: 4,
                            borderRadius: 2,
                            bgcolor: '#1A1A1A',
                            '& .MuiLinearProgress-bar': { bgcolor: '#FF4500', borderRadius: 2 },
                          }}
                        />
                      )}
                    </Box>
                    <Box>
                      {training.status === 'overdue' && (
                        <StatusBadge status="overdue" sx={{ ml: 2 }}>OVERDUE</StatusBadge>
                      )}
                      {training.status === 'completed' && (
                        <Button sx={{ color: '#888', textTransform: 'none', fontSize: '0.85rem' }}>Review</Button>
                      )}
                      {training.status === 'pending' && training.id === 3 && (
                        <Button sx={{ color: '#888', textTransform: 'none', fontSize: '0.85rem' }}>Start</Button>
                      )}
                      {training.status === 'overdue' && (
                        <Button 
                          variant="contained" 
                          sx={{ 
                            ml: 2, 
                            bgcolor: '#FF4500', 
                            color: '#fff', 
                            textTransform: 'none', 
                            fontSize: '0.85rem',
                            '&:hover': { bgcolor: '#E03E00' }
                          }}
                        >
                          Resume
                        </Button>
                      )}
                    </Box>
                  </Box>
                ))}
              </ComplianceCard>

              {/* Digital Signatures */}
              <ComplianceCard>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '8px', bgcolor: 'rgba(68, 133, 244, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                    <Edit sx={{ color: '#4285F4' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem', mb: 0.5 }}>
                      Digital Signatures
                    </Typography>
                    <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>
                      Review and sign pending documents
                    </Typography>
                  </Box>
                </Box>

                {/* Signature Items */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  {signatures.map((doc) => {
                    const signed = isDocumentSigned(doc.id);
                    return (
                      <Box
                        key={doc.id}
                        onClick={() => handleSignatureDocumentClick(doc.id)}
                        sx={{
                          bgcolor: signed ? 'rgba(76, 175, 80, 0.05)' : '#1A1A1A',
                          borderRadius: '12px',
                          p: 2,
                          border: signed ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid #2A2A2A',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': { 
                            borderColor: signed ? 'rgba(76, 175, 80, 0.5)' : '#333',
                            transform: 'translateY(-2px)'
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography sx={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500, flex: 1 }}>
                            {doc.title}
                          </Typography>
                          {signed && <CheckCircle sx={{ color: '#4CAF50', fontSize: 20 }} />}
                        </Box>
                        <StatusBadge status={signed ? 'completed' : 'pending'} sx={{ mb: 1 }}>
                          {signed ? 'SIGNED' : doc.status}
                        </StatusBadge>
                        <Typography sx={{ color: '#888', fontSize: '0.75rem', mb: 1.5 }}>
                          {doc.addedDate}
                        </Typography>
                        <Button
                          fullWidth
                          sx={{
                            color: '#FF4500',
                            textTransform: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            justifyContent: 'flex-start',
                            p: 0,
                            '&:hover': { bgcolor: 'transparent' },
                          }}
                        >
                          {signed ? 'View Document →' : (doc.status === 'AWAITING SIGNATURE' ? 'Sign Document →' : 'View & Sign →')}
                        </Button>
                      </Box>
                    );
                  })}
                </Box>
              </ComplianceCard>
            </Box>

            {/* Right Column */}
            <Box sx={{ flex: '0 0 360px', width: { xs: '100%', md: 360 } }}>
              {/* Compliance Status */}
              <ComplianceCard sx={{ mb: 3 }}>
                <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem', mb: 3 }}>
                  Policy Compliance Status
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                      variant="determinate"
                      value={complianceStats.percentage}
                      size={140}
                      thickness={4}
                      sx={{
                        color: '#FF4500',
                        '& .MuiCircularProgress-circle': {
                          strokeLinecap: 'round',
                        },
                      }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      <Typography sx={{ color: '#fff', fontSize: '2rem', fontWeight: 700 }}>
                        {complianceStats.percentage}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>
                      {complianceStats.completed}
                    </Typography>
                    <Typography sx={{ color: '#888', fontSize: '0.8rem' }}>
                      Acknowledged
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ color: '#FF0000', fontSize: '1.5rem', fontWeight: 700 }}>
                      {complianceStats.urgent}
                    </Typography>
                    <Typography sx={{ color: '#888', fontSize: '0.8rem' }}>
                      Pending
                    </Typography>
                  </Box>
                </Box>
              </ComplianceCard>

              {/* Policy Library */}
              <ComplianceCard>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                    Policy Library
                  </Typography>
                  <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>
                    {filteredPolicies.length} {filteredPolicies.length === 1 ? 'policy' : 'policies'}
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="Search policies..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: '#1A1A1A',
                      borderRadius: '8px',
                      color: '#fff',
                      '& fieldset': { borderColor: '#2A2A2A' },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: '#888', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
                {filteredPolicies.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography sx={{ color: '#888', fontSize: '0.9rem' }}>
                      No policies found matching "{searchQuery}"
                    </Typography>
                  </Box>
                ) : (
                  filteredPolicies.map((policy) => (
                    <Box
                      key={policy.id}
                      onClick={() => handlePolicyClick(policy.id)}
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        py: 2,
                        px: 2,
                        mb: 1,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border: isPolicyAcknowledged(policy.id) ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid transparent',
                        bgcolor: isPolicyAcknowledged(policy.id) ? 'rgba(76, 175, 80, 0.05)' : 'transparent',
                        transition: 'all 0.2s',
                        '&:hover': { 
                          bgcolor: isPolicyAcknowledged(policy.id) ? 'rgba(76, 175, 80, 0.1)' : '#1A1A1A',
                          borderColor: isPolicyAcknowledged(policy.id) ? 'rgba(76, 175, 80, 0.5)' : '#2A2A2A',
                          transform: 'translateX(4px)'
                        },
                      }}
                    >
                      <Box sx={{ mr: 2, mt: 0.5 }}>
                        {getIconComponent(policy.icon)}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography sx={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>
                            {policy.title}
                          </Typography>
                          {isPolicyAcknowledged(policy.id) && (
                            <CheckCircle sx={{ color: '#4CAF50', fontSize: 18 }} />
                          )}
                        </Box>
                        <Typography sx={{ color: '#888', fontSize: '0.75rem', mb: 0.5 }}>
                          {policy.description}
                        </Typography>
                        <Typography sx={{ color: '#666', fontSize: '0.7rem' }}>
                          Updated: {policy.lastUpdated}
                        </Typography>
                      </Box>
                      <Typography sx={{ color: '#FF4500', fontSize: '1.2rem', ml: 1 }}>
                        →
                      </Typography>
                    </Box>
                  ))
                )}
              </ComplianceCard>

              {/* Need Help */}
              <Box
                sx={{
                  bgcolor: 'linear-gradient(135deg, #FF4500 0%, #FF6347 100%)',
                  background: 'linear-gradient(135deg, #FF4500 0%, #FF6347 100%)',
                  borderRadius: '16px',
                  p: 3,
                }}
              >
                <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem', mb: 1 }}>
                  Need Help?
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.85rem', mb: 2 }}>
                  Questions about compliance requirements or policy updates?
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: '#fff',
                    color: '#FF4500',
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.2,
                    borderRadius: '8px',
                    '&:hover': { bgcolor: '#f5f5f5' },
                  }}
                >
                  Ask ZenX AI
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>

        {/* Footer */}
        <Box
          sx={{
            borderTop: '1px solid #1A1A1A',
            py: 3,
            mt: 6,
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
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
                  Accessibility
                </Button>
                <Button sx={{ color: '#666', textTransform: 'none', fontSize: '0.85rem', minWidth: 'auto', p: 0 }}>
                  Contact Support
                </Button>
              </Box>
              <Typography sx={{ color: '#666', fontSize: '0.8rem' }}>
                © 2024. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
}
