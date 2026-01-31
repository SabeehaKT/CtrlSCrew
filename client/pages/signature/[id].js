import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Chip,
  Breadcrumbs,
  Link as MuiLink,
  TextField,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ArrowBack,
  Download,
  Print,
  NavigateNext,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { apiClient } from '../../utils/apiClient';
import signatureDocuments from '../../data/signatureDocuments.json';
import { jsPDF } from 'jspdf';

// Styled Components
const ContentSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#111',
  border: '1px solid #1A1A1A',
  borderRadius: '16px',
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
}));

const TableOfContents = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 40,
  backgroundColor: '#111',
  border: '1px solid #1A1A1A',
  borderRadius: '16px',
  padding: theme.spacing(3),
  maxHeight: 'calc(100vh - 80px)',
  overflowY: 'auto',
}));

const SignatureCanvas = styled('canvas')({
  border: '2px solid #2A2A2A',
  borderRadius: '8px',
  cursor: 'crosshair',
  backgroundColor: '#0A0A0A',
  touchAction: 'none',
});

export default function SignatureDocument() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [document, setDocument] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const [signed, setSigned] = useState(false);
  
  // Signature form fields
  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState('');
  
  // Canvas ref for signature drawing
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!apiClient.isAuthenticated()) {
          router.push('/login');
          return;
        }
        const userData = await apiClient.getCurrentUser();
        setUser(userData);
        
        // Pre-fill form data
        setFormData({
          'Full Name': userData.fullname || '',
          'Employee ID': userData.id?.toString() || '',
          'Date': new Date().toISOString().split('T')[0],
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

  useEffect(() => {
    if (id) {
      const foundDoc = signatureDocuments.find(d => d.id === id);
      setDocument(foundDoc);
      
      // Check if already signed
      const signatures = JSON.parse(localStorage.getItem('documentSignatures') || '{}');
      if (signatures[id]) {
        setSigned(true);
      }
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!document) return;
    
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
    addText(document.title, 20, true, [255, 69, 0]);
    yPosition += 5;

    // Document metadata
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Status: ${signed ? 'SIGNED' : document.status}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Due Date: ${document.dueDate}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Added: ${document.addedDate}`, margin, yPosition);
    yPosition += 15;

    // Sections
    document.sections.forEach((section, index) => {
      // Section heading
      addText(`${index + 1}. ${section.heading}`, 14, true, [255, 69, 0]);
      yPosition += 3;

      // Section content
      addFormattedText(section.content, 10);
      yPosition += 10;
    });

    // Signature information if signed
    if (signed) {
      const signatures = JSON.parse(localStorage.getItem('documentSignatures') || '{}');
      const signatureData = signatures[id];
      
      if (signatureData) {
        // Add signature section
        pdf.addPage();
        yPosition = margin;
        
        addText('Document Signature', 16, true, [76, 175, 80]);
        yPosition += 5;
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        
        if (signatureData.formData['Full Name']) {
          pdf.text(`Name: ${signatureData.formData['Full Name']}`, margin, yPosition);
          yPosition += 7;
        }
        if (signatureData.formData['Employee ID']) {
          pdf.text(`Employee ID: ${signatureData.formData['Employee ID']}`, margin, yPosition);
          yPosition += 7;
        }
        if (signatureData.formData['Date']) {
          pdf.text(`Date: ${signatureData.formData['Date']}`, margin, yPosition);
          yPosition += 7;
        }
        
        yPosition += 5;
        pdf.text('Electronic Signature:', margin, yPosition);
        yPosition += 10;
        
        // Add signature image
        if (signatureData.signatureImage) {
          try {
            pdf.addImage(signatureData.signatureImage, 'PNG', margin, yPosition, 80, 30);
            yPosition += 35;
          } catch (error) {
            console.error('Error adding signature image:', error);
          }
        }
        
        yPosition += 5;
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Signed on: ${new Date(signatureData.timestamp).toLocaleString()}`, margin, yPosition);
      }
    }

    // Footer on last page
    const totalPages = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Page ${i} of ${totalPages} | ZenX Connect - Confidential`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
    }

    // Save PDF
    const fileName = `${document.id}-${signed ? 'signed' : 'unsigned'}.pdf`;
    pdf.save(fileName);
  };

  const scrollToSection = (index) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(index);
    }
  };

  const handleSignDocument = () => {
    setSignatureDialogOpen(true);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Signature drawing functions
  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    ctx.strokeStyle = '#FF4500';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      setSignatureDataUrl(canvasRef.current.toDataURL());
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl('');
  };

  const handleSubmitSignature = () => {
    // Validate all required fields
    const allFieldsFilled = document.signatureRequired.fields.every(field => {
      if (field.type === 'signature') {
        return signatureDataUrl !== '';
      }
      return formData[field.label] && formData[field.label].trim() !== '';
    });

    if (!allFieldsFilled) {
      alert('Please fill in all required fields and provide your signature.');
      return;
    }

    if (!agreementChecked) {
      alert('Please check the agreement box to proceed.');
      return;
    }

    // Save signature
    const signatures = JSON.parse(localStorage.getItem('documentSignatures') || '{}');
    signatures[id] = {
      signed: true,
      timestamp: new Date().toISOString(),
      documentTitle: document.title,
      userId: user?.id,
      formData: formData,
      signatureImage: signatureDataUrl,
    };
    localStorage.setItem('documentSignatures', JSON.stringify(signatures));
    
    setSigned(true);
    setSignatureDialogOpen(false);
    alert(`Thank you for signing "${document.title}". Your signature has been recorded.`);
  };

  if (loading || !document) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#FF4500' }} />
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>{document.title} - ZenX Connect</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ backgroundColor: '#000', minHeight: '100vh' }}>
        <Container maxWidth="xl" sx={{ pt: '40px', pb: 6 }}>
          {/* Go Back Button */}
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
            <Typography sx={{ color: '#fff' }}>{document.title}</Typography>
          </Breadcrumbs>

          {/* Document Header */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '2rem' }}>
                  {document.title}
                </Typography>
                {signed && <CheckCircle sx={{ color: '#4CAF50', fontSize: 32 }} />}
                {document.urgent && !signed && <Warning sx={{ color: '#FF4500', fontSize: 32 }} />}
              </Box>
              <Typography sx={{ color: '#888', fontSize: '0.95rem', mb: 2 }}>
                {document.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={signed ? 'SIGNED' : document.status}
                  size="small" 
                  sx={{ 
                    bgcolor: signed ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 69, 0, 0.2)',
                    color: signed ? '#4CAF50' : '#FF4500',
                    border: signed ? '1px solid #4CAF50' : '1px solid #FF4500',
                    fontWeight: 600
                  }} 
                />
                <Chip 
                  label={`Due: ${document.dueDate}`} 
                  size="small" 
                  sx={{ bgcolor: '#1A1A1A', color: '#888', border: '1px solid #2A2A2A' }} 
                />
                <Chip 
                  label={document.addedDate} 
                  size="small" 
                  sx={{ bgcolor: '#1A1A1A', color: '#888', border: '1px solid #2A2A2A' }} 
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<Download />}
                  onClick={handleDownload}
                  variant="outlined"
                  sx={{
                    borderColor: '#2A2A2A',
                    color: '#888',
                    textTransform: 'none',
                    '&:hover': { borderColor: '#FF4500', color: '#FF4500', bgcolor: '#1A1A1A' },
                  }}
                >
                  Download
                </Button>
                <Button
                  startIcon={<Print />}
                  onClick={handlePrint}
                  variant="outlined"
                  sx={{
                    borderColor: '#2A2A2A',
                    color: '#888',
                    textTransform: 'none',
                    '&:hover': { borderColor: '#FF4500', color: '#FF4500', bgcolor: '#1A1A1A' },
                  }}
                >
                  Print
                </Button>
              </Box>
              {!signed && (
                <Button
                  variant="contained"
                  onClick={handleSignDocument}
                  sx={{
                    bgcolor: '#FF4500',
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.5,
                    '&:hover': { bgcolor: '#E03E00' },
                  }}
                >
                  {document.status === 'AWAITING SIGNATURE' ? 'Sign Document' : 'Review & Sign'}
                </Button>
              )}
            </Box>
          </Box>

          {/* Two Column Layout */}
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Main Content */}
            <Box sx={{ flex: 1 }}>
              {document.sections.map((section, index) => (
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

              {/* Signature Section */}
              {!signed && (
                <ContentSection sx={{ background: 'linear-gradient(135deg, rgba(255, 69, 0, 0.1) 0%, rgba(255, 99, 71, 0.1) 100%)' }}>
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem', mb: 2 }}>
                    Signature Required
                  </Typography>
                  <Typography sx={{ color: '#ccc', fontSize: '0.9rem', mb: 3 }}>
                    {document.signatureRequired.acknowledgment}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleSignDocument}
                    sx={{
                      bgcolor: '#FF4500',
                      color: '#fff',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      py: 1.2,
                      borderRadius: '8px',
                      '&:hover': { bgcolor: '#E03E00' },
                    }}
                  >
                    {document.status === 'AWAITING SIGNATURE' ? 'Sign Now' : 'Review & Sign'}
                  </Button>
                </ContentSection>
              )}

              {signed && (
                <ContentSection sx={{ background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%)', border: '1px solid rgba(76, 175, 80, 0.3)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <CheckCircle sx={{ color: '#4CAF50', fontSize: 40 }} />
                    <Box>
                      <Typography sx={{ color: '#4CAF50', fontWeight: 600, fontSize: '1.1rem' }}>
                        Document Signed
                      </Typography>
                      <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>
                        You have successfully signed this document.
                      </Typography>
                    </Box>
                  </Box>
                </ContentSection>
              )}
            </Box>

            {/* Table of Contents - Sidebar */}
            <Box sx={{ flex: '0 0 300px', width: { xs: '100%', md: 300 }, display: { xs: 'none', md: 'block' } }}>
              <TableOfContents>
                <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem', mb: 2 }}>
                  Table of Contents
                </Typography>
                {document.sections.map((section, index) => (
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

      {/* Signature Dialog */}
      <Dialog 
        open={signatureDialogOpen} 
        onClose={() => setSignatureDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#111',
            border: '1px solid #1A1A1A',
            borderRadius: '16px',
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff', fontWeight: 600, borderBottom: '1px solid #1A1A1A' }}>
          Sign Document: {document?.title}
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Typography sx={{ color: '#ccc', fontSize: '0.9rem', mb: 3 }}>
            {document?.signatureRequired.acknowledgment}
          </Typography>

          {/* Form Fields */}
          {document?.signatureRequired.fields.map((field, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              {field.type !== 'signature' ? (
                <TextField
                  fullWidth
                  label={field.label}
                  type={field.type}
                  required={field.required}
                  value={formData[field.label] || ''}
                  onChange={(e) => handleFormChange(field.label, e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': { borderColor: '#2A2A2A' },
                      '&:hover fieldset': { borderColor: '#FF4500' },
                    },
                    '& .MuiInputLabel-root': { color: '#888' },
                  }}
                  InputLabelProps={field.type === 'date' ? { shrink: true } : {}}
                />
              ) : (
                <Box>
                  <Typography sx={{ color: '#888', mb: 1, fontSize: '0.9rem' }}>
                    {field.label} *
                  </Typography>
                  <SignatureCanvas
                    ref={canvasRef}
                    width={600}
                    height={200}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                  <Button
                    onClick={clearSignature}
                    sx={{
                      color: '#888',
                      textTransform: 'none',
                      fontSize: '0.85rem',
                      mt: 1,
                      '&:hover': { color: '#FF4500' },
                    }}
                  >
                    Clear Signature
                  </Button>
                </Box>
              )}
            </Box>
          ))}

          {/* Agreement Checkbox */}
          <FormControlLabel
            control={
              <Checkbox 
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
                sx={{ 
                  color: '#888',
                  '&.Mui-checked': { color: '#FF4500' }
                }}
              />
            }
            label={
              <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>
                I confirm that the information provided is accurate and I agree to the terms stated above.
              </Typography>
            }
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid #1A1A1A' }}>
          <Button 
            onClick={() => setSignatureDialogOpen(false)}
            sx={{ 
              color: '#888',
              textTransform: 'none',
              '&:hover': { bgcolor: '#1A1A1A' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitSignature}
            variant="contained"
            sx={{ 
              bgcolor: '#FF4500',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              '&:hover': { bgcolor: '#E03E00' }
            }}
          >
            Submit Signature
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
