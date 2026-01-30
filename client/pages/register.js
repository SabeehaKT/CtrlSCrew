import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';
import LockIcon from '@mui/icons-material/Lock';

const RegisterContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
}));

const RegisterPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#0D0D0D',
  border: '1px solid #1A1A1A',
  borderRadius: '16px',
  padding: theme.spacing(4),
  maxWidth: '450px',
  width: '100%',
  textAlign: 'center',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.8rem',
  textAlign: 'center',
  marginBottom: theme.spacing(1),
  color: '#fff',
  '& span': {
    color: '#FF4500',
  },
}));

const LoginButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF4500 0%, #FF6B35 100%)',
  color: '#fff',
  padding: '12px',
  fontSize: '1rem',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: '0 4px 15px rgba(255, 69, 0, 0.4)',
  '&:hover': {
    background: 'linear-gradient(135deg, #FF6B35 0%, #FF4500 100%)',
    boxShadow: '0 6px 20px rgba(255, 69, 0, 0.6)',
  },
}));

export default function Register() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect to login after 5 seconds
    const timer = setTimeout(() => {
      router.push('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <Head>
        <title>Registration Disabled - ZenX Connect</title>
        <meta name="description" content="Public registration is disabled" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <RegisterContainer>
        <Container maxWidth="sm">
          <RegisterPaper elevation={0}>
            <Box sx={{ mb: 3 }}>
              <LockIcon sx={{ fontSize: 60, color: '#FF4500', mb: 2 }} />
            </Box>

            <Logo>
              <span>ZenX</span> Connect
            </Logo>
            
            <Typography
              sx={{
                textAlign: 'center',
                color: '#FF4500',
                mb: 2,
                fontSize: '1.2rem',
                fontWeight: 600,
              }}
            >
              Public Registration Disabled
            </Typography>

            <Typography
              sx={{
                textAlign: 'center',
                color: '#999',
                mb: 3,
                fontSize: '0.95rem',
                lineHeight: 1.6,
              }}
            >
              User accounts are managed by administrators only.
              <br />
              Please contact your administrator to create an account for you.
            </Typography>

            <Box sx={{ 
              backgroundColor: '#1A1A1A', 
              borderRadius: '8px', 
              padding: 2, 
              mb: 3,
              border: '1px solid #2A2A2A'
            }}>
              <Typography sx={{ color: '#666', fontSize: '0.85rem', mb: 1 }}>
                Administrator Contact:
              </Typography>
              <Typography sx={{ color: '#FF4500', fontSize: '0.9rem', fontWeight: 600 }}>
                admin@zenx.com
              </Typography>
            </Box>

            <LoginButton
              fullWidth
              onClick={() => router.push('/login')}
              sx={{ mb: 2 }}
            >
              Go to Login
            </LoginButton>

            <Typography sx={{ color: '#666', fontSize: '0.85rem', mt: 2 }}>
              Redirecting to login in 5 seconds...
            </Typography>
          </RegisterPaper>
        </Container>
      </RegisterContainer>
    </>
  );
}
