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
  IconButton,
  Chip,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ArrowBack,
  Download,
  Print,
  Share,
  Bookmark,
  BookmarkBorder,
  NavigateNext,
} from '@mui/icons-material';
import { apiClient } from '../../utils/apiClient';
import policiesData from '../../data/policies.json';
import { jsPDF } from 'jspdf';

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
  fontSize: '0.9rem',
  fontWeight: 500,
  margin: theme.spacing(0, 1.5),
  '&:hover': {
    color: '#FF4500',
    backgroundColor: 'transparent',
  },
}));

const ContentSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#111',
  border: '1px solid #1A1A1A',
  borderRadius: '16px',
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
}));

const TableOfContents = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 100,
  backgroundColor: '#111',
  border: '1px solid #1A1A1A',
  borderRadius: '16px',
  padding: theme.spacing(3),
  maxHeight: 'calc(100vh - 120px)',
  overflowY: 'auto',
}));

export default function PolicyDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [acknowledged, setAcknowledged] = useState(false);

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

  useEffect(() => {
    if (id) {
      const foundPolicy = policiesData.find(p => p.id === id);
      setPolicy(foundPolicy);
      
      // Check if this policy was already acknowledged
      const acknowledgments = JSON.parse(localStorage.getItem('policyAcknowledgments') || '{}');
      if (acknowledgments[id]) {
        setAcknowledged(true);
      }
    }
  }, [id]);

  const handleLogout = () => {
    apiClient.logout();
    router.push('/');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!policy) return;
    
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addText = (text, fontSize, isBold = false, color = [0, 0, 0]) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      pdf.setTextColor(...color);
      
      const lines = pdf.splitTextToSize(text, maxWidth);
      lines.forEach(line => {
        if (yPosition + 10 > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += fontSize * 0.5;
      });
      yPosition += 5;
    };

    // Helper function to process bold text
    const addFormattedText = (text, fontSize) => {
      const parts = text.split(/(\*\*.*?\*\*)/g);
      pdf.setFontSize(fontSize);
      
      parts.forEach(part => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2);
          const lines = pdf.splitTextToSize(boldText, maxWidth);
          lines.forEach(line => {
            if (yPosition + 10 > pageHeight - margin) {
              pdf.addPage();
              yPosition = margin;
            }
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(0, 0, 0);
            pdf.text(line, margin, yPosition);
            yPosition += fontSize * 0.5;
          });
        } else if (part.trim()) {
          const lines = pdf.splitTextToSize(part, maxWidth);
          lines.forEach(line => {
            if (yPosition + 10 > pageHeight - margin) {
              pdf.addPage();
              yPosition = margin;
            }
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(0, 0, 0);
            pdf.text(line, margin, yPosition);
            yPosition += fontSize * 0.5;
          });
        }
      });
      yPosition += 5;
    };

    // Title
    addText(policy.title, 20, true, [255, 69, 0]);
    yPosition += 5;

    // Policy metadata
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Version ${policy.version}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Effective Date: ${policy.effectiveDate}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Last Updated: ${policy.lastUpdated}`, margin, yPosition);
    yPosition += 15;

    // Sections
    policy.sections.forEach((section, index) => {
      // Section heading
      addText(`${index + 1}. ${section.heading}`, 14, true, [255, 69, 0]);
      yPosition += 3;

      // Section content
      addFormattedText(section.content, 10);
      yPosition += 10;
    });

    // Acknowledgment info if acknowledged
    if (acknowledged) {
      const acknowledgments = JSON.parse(localStorage.getItem('policyAcknowledgments') || '{}');
      const ackData = acknowledgments[id];
      
      if (ackData) {
        pdf.addPage();
        yPosition = margin;
        
        addText('Policy Acknowledgment', 16, true, [76, 175, 80]);
        yPosition += 5;
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Acknowledged by: ${user?.fullname || 'N/A'}`, margin, yPosition);
        yPosition += 7;
        pdf.text(`Employee ID: ${user?.id || 'N/A'}`, margin, yPosition);
        yPosition += 7;
        pdf.text(`Date: ${new Date(ackData.timestamp).toLocaleString()}`, margin, yPosition);
      }
    }

    // Footer on all pages
    const totalPages = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Page ${i} of ${totalPages} | ZenX Connect - ${policy.category} Policy`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Save PDF
    const fileName = `${policy.id}-${acknowledged ? 'acknowledged' : 'policy'}.pdf`;
    pdf.save(fileName);
  };

  const scrollToSection = (index) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(index);
    }
  };

  const handleAcknowledge = () => {
    // Save acknowledgment to localStorage
    const acknowledgments = JSON.parse(localStorage.getItem('policyAcknowledgments') || '{}');
    acknowledgments[id] = {
      acknowledged: true,
      timestamp: new Date().toISOString(),
      policyTitle: policy.title,
      userId: user?.id
    };
    localStorage.setItem('policyAcknowledgments', JSON.stringify(acknowledgments));
    setAcknowledged(true);
    
    // Show success message
    alert(`Thank you for acknowledging the ${policy.title}. Your acknowledgment has been recorded.`);
  };

  if (loading || !policy) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#FF4500' }} />
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>{policy.title} - ZenX Connect</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ backgroundColor: '#000', minHeight: '100vh' }}>
        {/* Main Content */}
        <Container maxWidth="xl" sx={{ pt: '40px', pb: 6 }}>
          {/* Go Back Button - Top Left */}
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => router.push('/compliance')}
              sx={{
                color: '#FF4500',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                px: 2,
                py: 1,
                borderRadius: '8px',
                border: '1px solid #1A1A1A',
                '&:hover': { 
                  bgcolor: '#1A1A1A',
                  borderColor: '#2A2A2A'
                },
              }}
            >
              Go Back to Compliance
            </Button>
          </Box>

          {/* Breadcrumbs */}
          <Breadcrumbs 
            separator={<NavigateNext sx={{ color: '#666' }} fontSize="small" />}
            sx={{ mb: 3 }}
          >
            <MuiLink
              component="button"
              onClick={() => router.push('/dashboard')}
              sx={{ color: '#888', textDecoration: 'none', '&:hover': { color: '#FF4500' } }}
            >
              Dashboard
            </MuiLink>
            <MuiLink
              component="button"
              onClick={() => router.push('/compliance')}
              sx={{ color: '#888', textDecoration: 'none', '&:hover': { color: '#FF4500' } }}
            >
              Compliance
            </MuiLink>
            <Typography sx={{ color: '#fff' }}>{policy.title}</Typography>
          </Breadcrumbs>

          {/* Policy Header */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '2rem', mb: 1 }}>
                {policy.title}
              </Typography>
              <Typography sx={{ color: '#888', fontSize: '0.95rem', mb: 2 }}>
                {policy.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={`Version ${policy.version}`} 
                  size="small" 
                  sx={{ bgcolor: '#1A1A1A', color: '#888', border: '1px solid #2A2A2A' }} 
                />
                <Chip 
                  label={`Effective: ${policy.effectiveDate}`} 
                  size="small" 
                  sx={{ bgcolor: '#1A1A1A', color: '#888', border: '1px solid #2A2A2A' }} 
                />
                <Chip 
                  label={`Updated: ${policy.lastUpdated}`} 
                  size="small" 
                  sx={{ bgcolor: '#1A1A1A', color: '#888', border: '1px solid #2A2A2A' }} 
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                onClick={() => setBookmarked(!bookmarked)}
                sx={{ color: bookmarked ? '#FF4500' : '#888', '&:hover': { bgcolor: '#1A1A1A' } }}
              >
                {bookmarked ? <Bookmark /> : <BookmarkBorder />}
              </IconButton>
              <IconButton 
                onClick={handleDownload}
                sx={{ color: '#888', '&:hover': { bgcolor: '#1A1A1A', color: '#FF4500' } }}
              >
                <Download />
              </IconButton>
              <IconButton 
                onClick={handlePrint}
                sx={{ color: '#888', '&:hover': { bgcolor: '#1A1A1A', color: '#FF4500' } }}
              >
                <Print />
              </IconButton>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => router.push('/compliance')}
                sx={{
                  color: '#FF4500',
                  textTransform: 'none',
                  fontWeight: 600,
                  display: { xs: 'flex', md: 'none' },
                  '&:hover': { bgcolor: '#1A1A1A' },
                }}
              >
                Back
              </Button>
            </Box>
          </Box>

          {/* Two Column Layout */}
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Main Content */}
            <Box sx={{ flex: 1 }}>
              {policy.sections.map((section, index) => (
                <ContentSection key={index} id={`section-${index}`}>
                  <Typography 
                    sx={{ 
                      color: '#FF4500', 
                      fontWeight: 700, 
                      fontSize: '1.5rem', 
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '8px', 
                        bgcolor: 'rgba(255, 69, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        fontWeight: 700
                      }}
                    >
                      {index + 1}
                    </Box>
                    {section.heading}
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: '#ccc', 
                      fontSize: '0.95rem', 
                      lineHeight: 1.8,
                      whiteSpace: 'pre-line',
                      '& strong': {
                        color: '#fff',
                        fontWeight: 600
                      }
                    }}
                    dangerouslySetInnerHTML={{ __html: section.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                  />
                </ContentSection>
              ))}

              {/* Acknowledgment Section */}
              <ContentSection sx={{ background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.1) 0%, rgba(255, 99, 71, 0.1) 100%)' }}>
                <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                  Policy Acknowledgment
                </Typography>
                <Typography sx={{ color: '#ccc', fontSize: '0.9rem', mb: 3 }}>
                  I acknowledge that I have read, understood, and agree to comply with this policy. I understand that failure to comply may result in disciplinary action.
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleAcknowledge}
                  disabled={acknowledged}
                  sx={{
                    bgcolor: acknowledged ? '#4CAF50' : '#FF4500',
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    py: 1.2,
                    borderRadius: '8px',
                    '&:hover': { bgcolor: acknowledged ? '#45a049' : '#E03E00' },
                    '&:disabled': { bgcolor: '#4CAF50', color: '#fff' },
                  }}
                >
                  {acknowledged ? '✓ Acknowledged' : 'I Acknowledge'}
                </Button>
              </ContentSection>
            </Box>

            {/* Table of Contents - Sidebar */}
            <Box sx={{ flex: '0 0 300px', width: { xs: '100%', md: 300 }, display: { xs: 'none', md: 'block' } }}>
              <TableOfContents>
                <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem', mb: 2 }}>
                  Table of Contents
                </Typography>
                {policy.sections.map((section, index) => (
                  <Box
                    key={index}
                    onClick={() => scrollToSection(index)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      mb: 0.5,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      bgcolor: activeSection === index ? 'rgba(255, 69, 0, 0.1)' : 'transparent',
                      borderLeft: activeSection === index ? '3px solid #FF4500' : '3px solid transparent',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(255, 69, 0, 0.05)',
                      },
                    }}
                  >
                    <Typography 
                      sx={{ 
                        color: activeSection === index ? '#FF4500' : '#888',
                        fontSize: '0.85rem',
                        fontWeight: activeSection === index ? 600 : 400,
                      }}
                    >
                      {index + 1}. {section.heading}
                    </Typography>
                  </Box>
                ))}
              </TableOfContents>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
