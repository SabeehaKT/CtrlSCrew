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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { apiClient } from '../../utils/apiClient';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: '#fff',
  borderBottom: '1px solid #1A1A1A',
  padding: '16px',
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  color: '#999',
  fontWeight: 700,
  fontSize: '0.75rem',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  borderBottom: '1px solid #1A1A1A',
  padding: '16px',
}));

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

export default function AdminPayroll() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [payrolls, setPayrolls] = useState([]);
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPayroll, setCurrentPayroll] = useState(null);
  const [formData, setFormData] = useState({
    user_id: '',
    basic_salary: '',
    hra: '',
    transport_allowance: '',
    other_allowances: '',
    tax: '',
    provident_fund: '',
    insurance: '',
    other_deductions: '',
    bonus: '',
    lop_days: 0,
    absent_days: 0,
    lop_deduction: 0,
    month: months[new Date().getMonth()],
    year: currentYear,
    status: 'pending',
  });
  const [lopCalculating, setLopCalculating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
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

        // Fetch payrolls and users
        const [payrollsData, usersData] = await Promise.all([
          apiClient.getAllPayrolls(),
          apiClient.getAllUsers(),
        ]);
        
        setPayrolls(payrollsData);
        setUsers(usersData);
      } catch (error) {
        console.error('Error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleOpenDialog = (payroll = null) => {
    if (payroll) {
      setEditMode(true);
      setCurrentPayroll(payroll);
      setFormData({
        user_id: payroll.user_id,
        basic_salary: payroll.basic_salary,
        hra: payroll.hra,
        transport_allowance: payroll.transport_allowance,
        other_allowances: payroll.other_allowances,
        tax: payroll.tax,
        provident_fund: payroll.provident_fund,
        insurance: payroll.insurance,
        other_deductions: payroll.other_deductions,
        bonus: payroll.bonus,
        lop_days: payroll.lop_days || 0,
        absent_days: payroll.absent_days || 0,
        lop_deduction: payroll.lop_deduction || 0,
        month: payroll.month,
        year: payroll.year,
        status: payroll.status,
      });
    } else {
      setEditMode(false);
      setCurrentPayroll(null);
      setFormData({
        user_id: '',
        basic_salary: '',
        hra: '',
        transport_allowance: '',
        other_allowances: '',
        tax: '',
        provident_fund: '',
        insurance: '',
        other_deductions: '',
        bonus: '',
        month: months[new Date().getMonth()],
        year: currentYear,
        status: 'pending',
      });
    }
    setDialogOpen(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditMode(false);
    setCurrentPayroll(null);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setError('');
      
      // Validate required fields
      if (!formData.user_id || !formData.basic_salary || !formData.month || !formData.year) {
        setError('Please fill in all required fields');
        return;
      }

      const payrollData = {
        user_id: parseInt(formData.user_id),
        basic_salary: parseFloat(formData.basic_salary) || 0,
        hra: parseFloat(formData.hra) || 0,
        transport_allowance: parseFloat(formData.transport_allowance) || 0,
        other_allowances: parseFloat(formData.other_allowances) || 0,
        tax: parseFloat(formData.tax) || 0,
        provident_fund: parseFloat(formData.provident_fund) || 0,
        insurance: parseFloat(formData.insurance) || 0,
        other_deductions: parseFloat(formData.other_deductions) || 0,
        bonus: parseFloat(formData.bonus) || 0,
        lop_days: parseFloat(formData.lop_days) || 0,
        absent_days: parseFloat(formData.absent_days) || 0,
        lop_deduction: parseFloat(formData.lop_deduction) || 0,
        month: formData.month,
        year: parseInt(formData.year),
        status: formData.status,
      };

      if (editMode) {
        await apiClient.updatePayroll(currentPayroll.id, payrollData);
      } else {
        await apiClient.createPayroll(payrollData);
      }

      // Refresh payrolls
      const updatedPayrolls = await apiClient.getAllPayrolls();
      setPayrolls(updatedPayrolls);
      
      handleCloseDialog();
    } catch (err) {
      setError(err.message || 'Failed to save payroll');
    }
  };

  const handleDelete = async (payrollId) => {
    if (!confirm('Are you sure you want to delete this payroll record?')) {
      return;
    }

    try {
      await apiClient.deletePayroll(payrollId);
      const updatedPayrolls = await apiClient.getAllPayrolls();
      setPayrolls(updatedPayrolls);
    } catch (err) {
      alert(err.message || 'Failed to delete payroll');
    }
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : 'Unknown';
  };

  const calculateNetPay = (payroll) => {
    const gross = payroll.basic_salary + payroll.hra + payroll.transport_allowance + payroll.other_allowances + payroll.bonus;
    const deductions = payroll.tax + payroll.provident_fund + payroll.insurance + payroll.other_deductions + (payroll.lop_deduction || 0);
    return gross - deductions;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return '#4CAF50';
      case 'processed':
        return '#2196F3';
      case 'pending':
      default:
        return '#FF9800';
    }
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
        <title>Payroll Management - Admin Panel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ backgroundColor: '#000', minHeight: '100vh' }}>
        <StyledAppBar position="fixed">
          <Container maxWidth="xl">
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px' }}>
              <Logo>
                <span>ZenX</span> Connect - Admin
              </Logo>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={() => router.push('/admin')}
                  sx={{
                    color: '#fff',
                    textTransform: 'none',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Back to Admin
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </StyledAppBar>

        <Container maxWidth="xl" sx={{ pt: '100px', pb: 6 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.75rem' }}>
              Payroll Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                bgcolor: '#FF4500',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&:hover': { bgcolor: '#E03E00' },
              }}
            >
              Create Payroll
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ bgcolor: '#111', border: '1px solid #1A1A1A', borderRadius: '12px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell>Employee</StyledTableHeadCell>
                  <StyledTableHeadCell>Period</StyledTableHeadCell>
                  <StyledTableHeadCell align="right">Gross Pay</StyledTableHeadCell>
                  <StyledTableHeadCell align="right">Deductions</StyledTableHeadCell>
                  <StyledTableHeadCell align="right">Net Pay</StyledTableHeadCell>
                  <StyledTableHeadCell>Status</StyledTableHeadCell>
                  <StyledTableHeadCell align="center">Actions</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payrolls.length === 0 ? (
                  <TableRow>
                    <StyledTableCell colSpan={7} align="center">
                      <Typography sx={{ color: '#888', py: 4 }}>
                        No payroll records found. Create your first payroll record to get started.
                      </Typography>
                    </StyledTableCell>
                  </TableRow>
                ) : (
                  payrolls.map((payroll) => {
                    const grossPay = payroll.basic_salary + payroll.hra + payroll.transport_allowance + payroll.other_allowances + payroll.bonus;
                    const totalDeductions = payroll.tax + payroll.provident_fund + payroll.insurance + payroll.other_deductions + (payroll.lop_deduction || 0);
                    const netPay = calculateNetPay(payroll);

                    return (
                      <TableRow key={payroll.id} sx={{ '&:hover': { bgcolor: '#0A0A0A' } }}>
                        <StyledTableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon sx={{ color: '#FF4500', fontSize: 20 }} />
                            {getUserName(payroll.user_id)}
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>
                          {payroll.month} {payroll.year}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          ₹{grossPay.toLocaleString('en-IN')}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <Typography sx={{ color: '#f44336' }}>
                            ₹{totalDeductions.toLocaleString('en-IN')}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <Typography sx={{ color: '#4CAF50', fontWeight: 600 }}>
                            ₹{netPay.toLocaleString('en-IN')}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell>
                          <Chip
                            label={payroll.status.toUpperCase()}
                            size="small"
                            sx={{
                              bgcolor: getStatusColor(payroll.status),
                              color: '#fff',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                            }}
                          />
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <IconButton
                            onClick={() => handleOpenDialog(payroll)}
                            sx={{ color: '#4285F4', mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(payroll.id)}
                            sx={{ color: '#f44336' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </StyledTableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>

        {/* Create/Edit Payroll Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#111',
              border: '1px solid #1A1A1A',
              borderRadius: '16px',
            },
          }}
        >
          <DialogTitle sx={{ color: '#fff', fontWeight: 700, borderBottom: '1px solid #1A1A1A' }}>
            {editMode ? 'Edit Payroll' : 'Create New Payroll'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {error && (
              <Typography sx={{ color: '#f44336', mb: 2, fontSize: '0.9rem' }}>
                {error}
              </Typography>
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              {/* Employee Selection */}
              <FormControl fullWidth sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                <InputLabel sx={{ color: '#888' }}>Employee *</InputLabel>
                <Select
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleInputChange}
                  disabled={editMode}
                  sx={{
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
                    '& .MuiSvgIcon-root': { color: '#888' },
                  }}
                >
                  {users.filter(u => !u.is_admin).map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Period */}
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#888' }}>Month *</InputLabel>
                <Select
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  sx={{
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
                    '& .MuiSvgIcon-root': { color: '#888' },
                  }}
                >
                  {months.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#888' }}>Year *</InputLabel>
                <Select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  sx={{
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
                    '& .MuiSvgIcon-root': { color: '#888' },
                  }}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Earnings */}
              <Typography sx={{ color: '#FF4500', fontWeight: 600, gridColumn: '1 / -1', mt: 2 }}>
                Earnings
              </Typography>

              <TextField
                label="Basic Salary *"
                name="basic_salary"
                type="number"
                value={formData.basic_salary}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ sx: { color: '#888' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: '#333' },
                    '&:hover fieldset': { borderColor: '#555' },
                  },
                }}
              />

              <TextField
                label="HRA"
                name="hra"
                type="number"
                value={formData.hra}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ sx: { color: '#888' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: '#333' },
                    '&:hover fieldset': { borderColor: '#555' },
                  },
                }}
              />

              <TextField
                label="Transport Allowance"
                name="transport_allowance"
                type="number"
                value={formData.transport_allowance}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ sx: { color: '#888' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: '#333' },
                    '&:hover fieldset': { borderColor: '#555' },
                  },
                }}
              />

              <TextField
                label="Other Allowances"
                name="other_allowances"
                type="number"
                value={formData.other_allowances}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ sx: { color: '#888' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: '#333' },
                    '&:hover fieldset': { borderColor: '#555' },
                  },
                }}
              />

              <TextField
                label="Bonus"
                name="bonus"
                type="number"
                value={formData.bonus}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ sx: { color: '#888' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: '#333' },
                    '&:hover fieldset': { borderColor: '#555' },
                  },
                }}
              />

              {/* LOP Calculation */}
              <Box sx={{ gridColumn: '1 / -1', mt: 2, p: 2, bgcolor: '#1A1A1A', borderRadius: '12px', border: '1px solid #2A2A2A' }}>
                <Typography sx={{ color: '#FBBC04', fontWeight: 600, mb: 2 }}>
                  LOP / Absent Days Calculation
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    onClick={async () => {
                      if (!formData.user_id || !formData.month || !formData.year) {
                        alert('Please select user, month, and year first');
                        return;
                      }
                      setLopCalculating(true);
                      try {
                        const lopData = await apiClient.calculateLOP(formData.user_id, formData.month, formData.year);
                        const dailyRate = parseFloat(formData.basic_salary) / 30;
                        const lopAmount = dailyRate * lopData.total_unpaid_days;
                        
                        setFormData(prev => ({
                          ...prev,
                          lop_days: lopData.lop_days,
                          absent_days: lopData.absent_days + (lopData.half_days * 0.5),
                          lop_deduction: Math.round(lopAmount)
                        }));
                      } catch (error) {
                        alert(error.message || 'Failed to calculate LOP');
                      } finally {
                        setLopCalculating(false);
                      }
                    }}
                    disabled={lopCalculating || !formData.user_id || !formData.basic_salary}
                    sx={{
                      color: '#FBBC04',
                      borderColor: '#FBBC04',
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#FCC515',
                        bgcolor: 'rgba(251, 188, 4, 0.1)',
                      },
                    }}
                  >
                    {lopCalculating ? 'Calculating...' : 'Auto-Calculate LOP'}
                  </Button>
                  <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>
                    LOP Days: <strong style={{ color: '#fff' }}>{formData.lop_days || 0}</strong> | 
                    Absent Days: <strong style={{ color: '#fff' }}>{formData.absent_days || 0}</strong> | 
                    Deduction: <strong style={{ color: '#EA4335' }}>₹{(formData.lop_deduction || 0).toLocaleString('en-IN')}</strong>
                  </Typography>
                </Box>
              </Box>

              {/* Deductions */}
              <Typography sx={{ color: '#f44336', fontWeight: 600, gridColumn: '1 / -1', mt: 2 }}>
                Deductions
              </Typography>

              <TextField
                label="Tax"
                name="tax"
                type="number"
                value={formData.tax}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ sx: { color: '#888' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: '#333' },
                    '&:hover fieldset': { borderColor: '#555' },
                  },
                }}
              />

              <TextField
                label="Provident Fund"
                name="provident_fund"
                type="number"
                value={formData.provident_fund}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ sx: { color: '#888' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: '#333' },
                    '&:hover fieldset': { borderColor: '#555' },
                  },
                }}
              />

              <TextField
                label="Insurance"
                name="insurance"
                type="number"
                value={formData.insurance}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ sx: { color: '#888' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: '#333' },
                    '&:hover fieldset': { borderColor: '#555' },
                  },
                }}
              />

              <TextField
                label="Other Deductions"
                name="other_deductions"
                type="number"
                value={formData.other_deductions}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ sx: { color: '#888' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: '#333' },
                    '&:hover fieldset': { borderColor: '#555' },
                  },
                }}
              />

              {/* Status */}
              <FormControl fullWidth sx={{ gridColumn: '1 / -1' }}>
                <InputLabel sx={{ color: '#888' }}>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  sx={{
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#333' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
                    '& .MuiSvgIcon-root': { color: '#888' },
                  }}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processed">Processed</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: '1px solid #1A1A1A' }}>
            <Button
              onClick={handleCloseDialog}
              sx={{
                color: '#888',
                textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                bgcolor: '#FF4500',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                '&:hover': { bgcolor: '#E03E00' },
              }}
            >
              {editMode ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
