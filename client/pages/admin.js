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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { apiClient } from '../utils/apiClient';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: '#fff',
  borderBottom: '1px solid #1A1A1A',
  fontSize: '0.9rem',
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  color: '#999',
  borderBottom: '1px solid #1A1A1A',
  fontWeight: 600,
  fontSize: '0.85rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
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

const ActionButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF4500 0%, #FF6B35 100%)',
  color: '#fff',
  padding: '10px 24px',
  fontSize: '0.9rem',
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': {
    background: 'linear-gradient(135deg, #FF6B35 0%, #FF4500 100%)',
  },
}));

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    is_admin: false,
    role: '',
    experience: '',
    skills: '',
  });

  useEffect(() => {
    checkAuthAndLoadUsers();
  }, []);

  const checkAuthAndLoadUsers = async () => {
    try {
      if (!apiClient.isAuthenticated()) {
        router.push('/login');
        return;
      }

      const userData = await apiClient.getCurrentUser();
      if (!userData.is_admin) {
        router.push('/dashboard');
        return;
      }

      setUser(userData);
      await loadUsers();
    } catch (error) {
      console.error('Authentication error:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError('Failed to load users');
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        is_admin: user.is_admin,
        role: user.role || '',
        experience: user.experience || '',
        skills: user.skills || '',
      });
    } else {
      setEditUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        is_admin: false,
        role: '',
        experience: '',
        skills: '',
      });
    }
    setOpenDialog(true);
    setError('');
    setSuccess('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      is_admin: false,
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (editUser) {
        const updateData = {
          name: formData.name,
          email: formData.email,
          role: formData.role || null,
          experience: formData.experience ? parseInt(formData.experience) : null,
          skills: formData.skills || null,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }

        const response = await fetch(`http://localhost:8000/api/admin/users/${editUser.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) throw new Error('Failed to update user');
        setSuccess('User updated successfully');
      } else {
        const createData = {
          ...formData,
          experience: formData.experience ? parseInt(formData.experience) : null,
        };
        
        const response = await fetch('http://localhost:8000/api/admin/users', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(createData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to create user');
        }
        setSuccess('User created successfully');
      }

      await loadUsers();
      handleCloseDialog();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete user');
      setSuccess('User deleted successfully');
      await loadUsers();
    } catch (error) {
      setError(error.message);
    }
  };

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

  return (
    <>
      <Head>
        <title>Admin Dashboard - ZenX Connect</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ backgroundColor: '#000', minHeight: '100vh' }}>
        <StyledAppBar position="fixed">
          <Container maxWidth="xl">
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px' }}>
              <Logo>
                <span>ZenX</span> Connect Admin
              </Logo>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ textAlign: 'right', mr: 1.5 }}>
                  <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>
                    {user?.name}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#FF4500', lineHeight: 1.3 }}>
                    Administrator
                  </Typography>
                </Box>
                <Avatar 
                  sx={{ 
                    bgcolor: '#FF4500', 
                    width: 44, 
                    height: 44,
                    fontWeight: 700,
                    fontSize: '1.1rem'
                  }}
                >
                  {user?.name?.charAt(0)}
                </Avatar>
                <Button
                  onClick={handleLogout}
                  sx={{
                    color: '#999',
                    textTransform: 'none',
                    '&:hover': { color: '#fff' }
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </StyledAppBar>

        <Container maxWidth="xl" sx={{ pt: '100px', pb: 6 }}>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>
                User Management
              </Typography>
              <Typography sx={{ color: '#888' }}>
                Create and manage employee accounts
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                onClick={() => router.push('/admin/payroll')}
                sx={{
                  color: '#FF4500',
                  borderColor: '#FF4500',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#FF6B35',
                    bgcolor: 'rgba(255, 69, 0, 0.1)',
                  },
                }}
              >
                Manage Payroll
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push('/admin/leave-requests')}
                sx={{
                  color: '#4285F4',
                  borderColor: '#4285F4',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#5A95F5',
                    bgcolor: 'rgba(66, 133, 244, 0.1)',
                  },
                }}
              >
                Leave Requests
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push('/admin/attendance')}
                sx={{
                  color: '#34A853',
                  borderColor: '#34A853',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#46B864',
                    bgcolor: 'rgba(52, 168, 83, 0.1)',
                  },
                }}
              >
                Manage Attendance
              </Button>
              <Button
                variant="outlined"
                onClick={async () => {
                  try {
                    await apiClient.initializeLeaveBalances();
                    setSuccess('Leave balances initialized for all users');
                    setTimeout(() => setSuccess(''), 3000);
                  } catch (error) {
                    setError(error.message || 'Failed to initialize leave balances');
                  }
                }}
                sx={{
                  color: '#FBBC04',
                  borderColor: '#FBBC04',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#FCC515',
                    bgcolor: 'rgba(251, 188, 4, 0.1)',
                  },
                }}
              >
                Initialize Leave Balances
              </Button>
              <ActionButton startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
                Add New User
              </ActionButton>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          <TableContainer component={Paper} sx={{ backgroundColor: '#0D0D0D', border: '1px solid #1A1A1A' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell>Name</StyledTableHeadCell>
                  <StyledTableHeadCell>Email</StyledTableHeadCell>
                  <StyledTableHeadCell>Role</StyledTableHeadCell>
                  <StyledTableHeadCell>Created At</StyledTableHeadCell>
                  <StyledTableHeadCell align="right">Actions</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover sx={{ '&:hover': { backgroundColor: '#111' } }}>
                    <StyledTableCell>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1.5,
                          cursor: 'pointer',
                          '&:hover .user-name': {
                            color: '#FF4500',
                            textDecoration: 'underline',
                          }
                        }}
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                      >
                        <Avatar sx={{ bgcolor: '#FF4500', width: 32, height: 32, fontSize: '0.9rem' }}>
                          {user.name.charAt(0)}
                        </Avatar>
                        <Typography className="user-name" sx={{ transition: 'all 0.2s' }}>
                          {user.name}
                        </Typography>
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>{user.email}</StyledTableCell>
                    <StyledTableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box>
                          {user.is_admin ? (
                            <Chip label="Admin" size="small" sx={{ bgcolor: '#FF4500', color: '#fff', fontWeight: 600 }} />
                          ) : (
                            <Chip label="User" size="small" sx={{ bgcolor: '#1A1A1A', color: '#999' }} />
                          )}
                        </Box>
                        {user.role && (
                          <Typography sx={{ fontSize: '0.85rem', color: '#999' }}>
                            {user.role}
                          </Typography>
                        )}
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                        sx={{ color: '#999', '&:hover': { color: '#4CAF50' } }}
                        title="View Details"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleOpenDialog(user)}
                        sx={{ color: '#999', '&:hover': { color: '#FF4500' } }}
                        title="Edit User"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteUser(user.id)}
                        sx={{ color: '#999', '&:hover': { color: '#f44336' } }}
                        title="Delete User"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>

        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog}
          PaperProps={{
            sx: {
              backgroundColor: '#0D0D0D',
              border: '1px solid #1A1A1A',
              borderRadius: '16px',
              minWidth: '500px',
            }
          }}
        >
          <DialogTitle sx={{ color: '#fff', borderBottom: '1px solid #1A1A1A' }}>
            {editUser ? 'Edit User' : 'Add New User'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <StyledTextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <StyledTextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              margin="normal"
              required
            />
            <StyledTextField
              fullWidth
              label={editUser ? "New Password (leave blank to keep current)" : "Password"}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              margin="normal"
              required={!editUser}
              helperText={editUser ? "Leave blank to keep current password" : "User must change on first login"}
              FormHelperTextProps={{ sx: { color: '#666' } }}
            />
            <StyledTextField
              fullWidth
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              margin="normal"
              placeholder="e.g., Backend Developer, HR, Analyst"
              helperText="Job role/designation"
              FormHelperTextProps={{ sx: { color: '#666' } }}
            />
            <StyledTextField
              fullWidth
              label="Experience (years)"
              type="number"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              margin="normal"
              placeholder="e.g., 3"
              helperText="Years of experience"
              FormHelperTextProps={{ sx: { color: '#666' } }}
            />
            <StyledTextField
              fullWidth
              label="Skills"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              margin="normal"
              multiline
              rows={2}
              placeholder="e.g., React, Node.js, Python"
              helperText="Comma-separated skills"
              FormHelperTextProps={{ sx: { color: '#666' } }}
            />
            {!editUser && (
              <Box sx={{ mt: 2 }}>
                <Button
                  onClick={() => setFormData({ ...formData, is_admin: !formData.is_admin })}
                  sx={{
                    color: formData.is_admin ? '#FF4500' : '#999',
                    textTransform: 'none',
                    border: '1px solid',
                    borderColor: formData.is_admin ? '#FF4500' : '#2A2A2A',
                    '&:hover': {
                      borderColor: '#FF4500',
                      backgroundColor: 'rgba(255, 69, 0, 0.1)',
                    }
                  }}
                >
                  {formData.is_admin ? '✓ Admin User' : 'Regular User'}
                </Button>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ borderTop: '1px solid #1A1A1A', p: 2 }}>
            <Button onClick={handleCloseDialog} sx={{ color: '#999', textTransform: 'none' }}>
              Cancel
            </Button>
            <ActionButton onClick={handleSubmit}>
              {editUser ? 'Update User' : 'Create User'}
            </ActionButton>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
