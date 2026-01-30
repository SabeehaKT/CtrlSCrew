import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Link as MuiLink,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { apiClient } from '../utils/apiClient';

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

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: '#1A1A1A',
    color: '#fff',
    borderRadius: '8px',
    '& fieldset': {
      borderColor: '#2A2A2A',
    },
    '&:hover fieldset': {
      borderColor: '#3A3A3A',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FF4500',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#999',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#FF4500',
  },
}));

const RegisterButton = styled(Button)(({ theme }) => ({
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
  '&:disabled': {
    background: '#333',
    color: '#666',
  },
}));

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await apiClient.register(formData.name, formData.email, formData.password);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register - ZenX Connect</title>
        <meta name="description" content="Create a new account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <RegisterContainer>
        <Container maxWidth="sm">
          <RegisterPaper elevation={0}>
            <Logo>
              <span>ZenX</span> Connect
            </Logo>
            
            <Typography
              sx={{
                textAlign: 'center',
                color: '#999',
                mb: 4,
                fontSize: '0.95rem',
              }}
            >
              Create your account to get started
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <StyledTextField
                fullWidth
                label="Full Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                margin="normal"
                autoComplete="name"
              />

              <StyledTextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                margin="normal"
                autoComplete="email"
              />

              <StyledTextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                margin="normal"
                autoComplete="new-password"
                helperText="Minimum 6 characters"
                FormHelperTextProps={{
                  sx: { color: '#666' }
                }}
              />

              <StyledTextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                margin="normal"
                autoComplete="new-password"
              />

              <RegisterButton
                type="submit"
                fullWidth
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? 'Creating Account...' : 'Register'}
              </RegisterButton>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography sx={{ color: '#999', fontSize: '0.9rem' }}>
                  Already have an account?{' '}
                  <Link href="/login" passHref legacyBehavior>
                    <MuiLink
                      sx={{
                        color: '#FF4500',
                        textDecoration: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Login here
                    </MuiLink>
                  </Link>
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Link href="/" passHref legacyBehavior>
                  <MuiLink
                    sx={{
                      color: '#666',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      '&:hover': {
                        color: '#FF4500',
                      },
                    }}
                  >
                    ← Back to Home
                  </MuiLink>
                </Link>
              </Box>
            </form>
          </RegisterPaper>
        </Container>
      </RegisterContainer>
    </>
  );
}
