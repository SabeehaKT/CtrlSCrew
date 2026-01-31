import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const StyledAppBar = styled(AppBar)(() => ({
  backgroundColor: '#0A0A0A',
  boxShadow: 'none',
  borderBottom: '1px solid #1A1A1A',
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

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#000',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  paddingTop: '80px',
  paddingBottom: '80px',
  [theme.breakpoints.down('md')]: {
    paddingTop: '60px',
    paddingBottom: '60px',
    minHeight: 'auto',
    paddingLeft: '16px',
    paddingRight: '16px',
  },
  [theme.breakpoints.down('sm')]: {
    paddingTop: '40px',
    paddingBottom: '40px',
  },
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
  fontSize: '4.5rem',
  fontWeight: 800,
  textAlign: 'center',
  marginBottom: theme.spacing(2),
  lineHeight: 1.2,
  '& .highlight': {
    background: 'linear-gradient(135deg, #FF4500 0%, #FF6B35 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '3rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.2rem',
  },
  [theme.breakpoints.down('xs')]: {
    fontSize: '1.8rem',
  },
}));

const HeroSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  textAlign: 'center',
  color: '#B8B8B8',
  marginBottom: theme.spacing(5),
  maxWidth: '800px',
  margin: '0 auto',
  [theme.breakpoints.down('md')]: {
    fontSize: '1.1rem',
    padding: '0 20px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.95rem',
    padding: '0 16px',
  },
}));

const GetStartedButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF4500 0%, #FF6B35 100%)',
  color: '#fff',
  padding: '14px 40px',
  fontSize: '1.1rem',
  borderRadius: '50px',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 4px 15px rgba(255, 69, 0, 0.4)',
  '&:hover': {
    background: 'linear-gradient(135deg, #FF6B35 0%, #FF4500 100%)',
    boxShadow: '0 6px 20px rgba(255, 69, 0, 0.6)',
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('md')]: {
    padding: '12px 32px',
    fontSize: '1rem',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '10px 28px',
    fontSize: '0.9rem',
    width: '100%',
    maxWidth: '300px',
  },
}));

const LearnMoreButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  padding: '14px 40px',
  fontSize: '1.1rem',
  borderRadius: '50px',
  textTransform: 'none',
  fontWeight: 600,
  border: '2px solid #fff',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: '#FF4500',
    color: '#FF4500',
  },
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('md')]: {
    padding: '12px 32px',
    fontSize: '1rem',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '10px 28px',
    fontSize: '0.9rem',
    width: '100%',
    maxWidth: '300px',
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  color: '#FF4500',
  border: '2px solid #FF4500',
  borderRadius: '50px',
  padding: '8px 30px',
  textTransform: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#FF4500',
    color: '#fff',
  },
  transition: 'all 0.3s ease',
  [theme.breakpoints.down('sm')]: {
    padding: '6px 20px',
    fontSize: '0.9rem',
  },
}));

const FeaturesSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#000',
  color: '#fff',
  padding: theme.spacing(10, 0),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(8, 0),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6, 0),
  },
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#0D0D0D',
  border: '1px solid #1A1A1A',
  borderRadius: '16px',
  padding: theme.spacing(3),
  height: '100%',
  textAlign: 'left',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#FF4500',
    transform: 'translateY(-4px)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2.5),
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: '40px',
  height: '40px',
  borderRadius: '8px',
  backgroundColor: '#FF4500',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  fontSize: '1.2rem',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  textAlign: 'center',
  marginBottom: theme.spacing(2),
  lineHeight: 1.3,
  '& .highlight': {
    color: '#FF4500',
  },
  [theme.breakpoints.down('md')]: {
    fontSize: '2rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.6rem',
  },
}));

const TestimonialSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#000',
  color: '#fff',
  padding: theme.spacing(10, 0),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(8, 0),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6, 0),
  },
}));

const CTASection = styled(Box)(({ theme }) => ({
  backgroundColor: '#000',
  color: '#fff',
  padding: theme.spacing(10, 0),
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(8, 0),
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6, 0),
  },
}));

const FooterSection = styled(Box)(({ theme }) => ({
  backgroundColor: '#000',
  padding: theme.spacing(6, 0, 3, 0),
  color: '#fff',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(4, 0, 2, 0),
  },
}));

const NewsletterInput = styled('input')(({ theme }) => ({
  backgroundColor: '#1A1A1A',
  border: 'none',
  borderRadius: '4px',
  padding: '12px 16px',
  color: '#fff',
  fontSize: '0.9rem',
  outline: 'none',
  width: '100%',
  maxWidth: '300px',
  '&::placeholder': {
    color: '#666',
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    fontSize: '0.85rem',
    padding: '10px 14px',
  },
}));

const NewsletterButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FF4500',
  color: '#fff',
  minWidth: '40px',
  width: '40px',
  height: '40px',
  padding: 0,
  borderRadius: '4px',
  marginLeft: '8px',
  '&:hover': {
    backgroundColor: '#FF6B35',
  },
}));

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  const features = [
    {
      icon: '🤖',
      title: 'AI Personal Assistant',
      description: 'A dedicated AI companion that helps employees manage their schedules, set reminders, and optimize their work-life balance.',
    },
    {
      icon: '💚',
      title: 'Holistic Well-Being',
      description: 'Integrated mental health resources and physical wellness programs to support your well-being every day.',
    },
    {
      icon: '📈',
      title: 'Smart Career Pathing',
      description: 'AI-driven career growth insights and personalized training driven by predictive analytics.',
    },
  ];

  return (
    <>
      <Head>
        <title>ZenX Connect - Employee Portal</title>
        <meta name="description" content="The ultimate self-service portal for modern employees" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ backgroundColor: '#000', minHeight: '100vh' }}>
        {/* Navigation Bar */}
        <StyledAppBar position="fixed">
          <Container maxWidth="xl">
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px' }}>
              <Logo onClick={() => router.push('/')}>
                <span>ZenX</span> Connect
              </Logo>

              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                <NavButton className="active">Home</NavButton>
                <NavButton>Career Path</NavButton>
                <NavButton>Learning</NavButton>
                <NavButton>Wellbeing</NavButton>
                <NavButton>Compliance</NavButton>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LoginButton onClick={() => router.push('/login')}>Login</LoginButton>
              </Box>
            </Toolbar>
          </Container>
        </StyledAppBar>

        {/* Hero Section */}
        <HeroSection>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center' }}>
              <HeroTitle>
                Empower Your
                <br />
                <span className="highlight">Workforce</span>
              </HeroTitle>
              
              <HeroSubtitle sx={{ mb: 5 }}>
                The ultimate self-service portal for modern employees. Manage leaves,
                payroll, and tasks seamlessly.
              </HeroSubtitle>
              
              <Box
                sx={{
                  display: 'flex',
                  gap: 3,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  mt: 4,
                }}
              >
                <GetStartedButton variant="contained" size="large">
                  Get Started
                </GetStartedButton>
                <LearnMoreButton variant="outlined" size="large">
                  Learn More
                </LearnMoreButton>
              </Box>
            </Box>
          </Container>
        </HeroSection>

        {/* Features Section */}
        <FeaturesSection>
          <Container maxWidth="lg">
            <SectionTitle>
              Future-Proof Your <span className="highlight">Culture</span>
            </SectionTitle>
            
            <Typography
              sx={{
                textAlign: 'center',
                color: '#999',
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                maxWidth: '700px',
                margin: '0 auto',
                marginBottom: { xs: '48px', md: '64px' },
                px: { xs: 2, sm: 0 },
              }}
            >
              Innovate and empower by offering employees AI-based tools ahead of your competition
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 2, sm: 2.5, md: 3 }, 
              flexWrap: { xs: 'wrap', md: 'nowrap' },
              px: { xs: 2, sm: 0 },
            }}>
              {features.map((feature, index) => (
                <Box key={index} sx={{ flex: 1, minWidth: { xs: '100%', md: '280px' } }}>
                  <FeatureCard>
                    <FeatureIcon>{feature.icon}</FeatureIcon>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        mb: 1.5,
                        color: '#fff',
                        fontSize: { xs: '0.95rem', md: '1rem' },
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#999',
                        lineHeight: 1.6,
                        fontSize: { xs: '0.8rem', md: '0.85rem' },
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </FeatureCard>
                </Box>
              ))}
            </Box>
          </Container>
        </FeaturesSection>

        {/* Testimonial Section */}
        <TestimonialSection>
          <Container maxWidth="md">
            <Box sx={{ textAlign: 'center', px: { xs: 3, sm: 2 } }}>
              <Typography
                sx={{
                  fontSize: { xs: '2.5rem', md: '3rem' },
                  color: '#FF4500',
                  mb: 2,
                  lineHeight: 0.5,
                }}
              >
                ❝❞
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '1rem', sm: '1.15rem', md: '1.35rem' },
                  fontStyle: 'italic',
                  color: '#fff',
                  lineHeight: 1.6,
                  mb: 4,
                  fontWeight: 300,
                }}
              >
                "ZenX Connect hasn't just improved our internal operations; it has completely transformed how our employees feel valued and supported every single day."
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Box
                  sx={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: '#2A2A2A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                  }}
                >
                  👤
                </Box>
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: '#fff',
                      fontSize: { xs: '0.9rem', md: '0.95rem' },
                    }}
                  >
                    Sarah Jenkins
                  </Typography>
                  <Typography
                    sx={{
                      color: '#FF4500',
                      fontSize: { xs: '0.75rem', md: '0.8rem' },
                    }}
                  >
                    HR Director, TechFlow Inc (A USA)
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Container>
        </TestimonialSection>

        {/* CTA Section */}
        <CTASection>
          <Container maxWidth="md">
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '1.6rem', sm: '1.8rem', md: '2.2rem' },
                px: { xs: 2, sm: 0 },
              }}
            >
              Ready to Connect?
            </Typography>
            <Typography
              sx={{
                color: '#999',
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '0.95rem' },
                mb: 4,
                maxWidth: '550px',
                margin: '0 auto 32px',
                px: { xs: 3, sm: 2 },
              }}
            >
              Join the future of workplace experience and start your 30-day free trial today.
            </Typography>
            <Box sx={{ px: { xs: 2, sm: 0 } }}>
              <GetStartedButton variant="contained" size="large">
                Empower Your Team Now
              </GetStartedButton>
            </Box>
          </Container>
        </CTASection>

        {/* Footer */}
        <FooterSection>
          <Container maxWidth="lg">
            <Grid container spacing={{ xs: 3, sm: 4 }} sx={{ mb: { xs: 3, md: 4 } }}>
              {/* Logo and Description */}
              <Grid item xs={12} sm={6} md={3}>
                <Logo variant="h6" sx={{ mb: 1.5, fontSize: { xs: '1rem', md: '1.1rem' } }}>
                  <span>ZenX</span> Connect
                </Logo>
                <Typography
                  sx={{
                    color: '#666',
                    fontSize: { xs: '0.75rem', md: '0.8rem' },
                    lineHeight: 1.6,
                  }}
                >
                  Simplifies the complexities of employee engagement to enhance employee satisfaction
                </Typography>
              </Grid>

              {/* Platform */}
              <Grid item xs={6} sm={6} md={2.25}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    mb: 1.5,
                    fontSize: { xs: '0.8rem', md: '0.85rem' },
                  }}
                >
                  Platform
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography sx={{ color: '#666', fontSize: { xs: '0.75rem', md: '0.8rem' }, cursor: 'pointer', '&:hover': { color: '#FF4500' } }}>
                    Features
                  </Typography>
                  <Typography sx={{ color: '#666', fontSize: { xs: '0.75rem', md: '0.8rem' }, cursor: 'pointer', '&:hover': { color: '#FF4500' } }}>
                    Pricing
                  </Typography>
                  <Typography sx={{ color: '#666', fontSize: { xs: '0.75rem', md: '0.8rem' }, cursor: 'pointer', '&:hover': { color: '#FF4500' } }}>
                    Security
                  </Typography>
                  <Typography sx={{ color: '#666', fontSize: { xs: '0.75rem', md: '0.8rem' }, cursor: 'pointer', '&:hover': { color: '#FF4500' } }}>
                    Roadmap
                  </Typography>
                </Box>
              </Grid>

              {/* Company */}
              <Grid item xs={6} sm={6} md={2.25}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    mb: 1.5,
                    fontSize: { xs: '0.8rem', md: '0.85rem' },
                  }}
                >
                  Company
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography sx={{ color: '#666', fontSize: { xs: '0.75rem', md: '0.8rem' }, cursor: 'pointer', '&:hover': { color: '#FF4500' } }}>
                    About us
                  </Typography>
                  <Typography sx={{ color: '#666', fontSize: { xs: '0.75rem', md: '0.8rem' }, cursor: 'pointer', '&:hover': { color: '#FF4500' } }}>
                    Careers
                  </Typography>
                  <Typography sx={{ color: '#666', fontSize: { xs: '0.75rem', md: '0.8rem' }, cursor: 'pointer', '&:hover': { color: '#FF4500' } }}>
                    Contact
                  </Typography>
                  <Typography sx={{ color: '#666', fontSize: { xs: '0.75rem', md: '0.8rem' }, cursor: 'pointer', '&:hover': { color: '#FF4500' } }}>
                    Partners
                  </Typography>
                </Box>
              </Grid>

              {/* Newsletter */}
              <Grid item xs={12} sm={6} md={4.5}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    mb: 1.5,
                    fontSize: { xs: '0.8rem', md: '0.85rem' },
                  }}
                >
                  Newsletter
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: { xs: 'nowrap', sm: 'nowrap' } }}>
                  <NewsletterInput type="email" placeholder="Email address" />
                  <NewsletterButton>
                    →
                  </NewsletterButton>
                </Box>
              </Grid>
            </Grid>

            {/* Bottom Footer */}
            <Box
              sx={{
                borderTop: '1px solid #1A1A1A',
                pt: 2.5,
                pb: 1,
                display: 'flex',
                justifyContent: { xs: 'center', sm: 'space-between' },
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
              }}
            >
              <Typography sx={{ color: '#666', fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                © 2025 ZenX Connect. All rights reserved.
              </Typography>
              <Box sx={{ display: 'flex', gap: { xs: 2, sm: 2.5 }, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ color: '#666', fontSize: { xs: '0.7rem', md: '0.75rem' }, cursor: 'pointer', '&:hover': { color: '#FF4500' } }}>
                  Privacy Policy
                </Typography>
                <Typography sx={{ color: '#666', fontSize: { xs: '0.7rem', md: '0.75rem' }, cursor: 'pointer', '&:hover': { color: '#FF4500' } }}>
                  Terms of Service
                </Typography>
                <Typography sx={{ color: '#666', fontSize: { xs: '0.7rem', md: '0.75rem' }, cursor: 'pointer', '&:hover': { color: '#FF4500' } }}>
                  Cookies
                </Typography>
              </Box>
            </Box>
          </Container>
        </FooterSection>
      </Box>
    </>
  );
}
