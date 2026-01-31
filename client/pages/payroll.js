import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Paper,
  Grid,
  Avatar,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import Link from 'next/link';
import {
  AccountBalanceWallet as WalletIcon,
  CreditCardOff as DeductionsIcon,
  Description as DocumentIcon,
  SmartToy as RobotIcon,
  LightMode as SunIcon,
  FilterList as FilterIcon,
  FileDownload as ExportIcon,
  PictureAsPdf as PdfIcon,
  AutoAwesome as SparkleIcon,
} from '@mui/icons-material';

const Logo = styled(Typography)(() => ({
  fontWeight: 700,
  fontSize: '1.25rem',
  color: '#fff',
  '& span': { color: '#FF6B35', fontWeight: 800 },
}));

const StyledAppBar = styled(AppBar)(() => ({
  backgroundColor: '#0A0A0A',
  boxShadow: 'none',
  borderBottom: '1px solid #1A1A1A',
}));

const NavLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ active }) => ({
  color: active ? '#FF6B35' : '#fff',
  textDecoration: 'none',
  fontSize: '0.9rem',
  fontWeight: 500,
  margin: '0 12px',
  '&:hover': { color: '#FF6B35' },
}));

const CardDark = styled(Paper)(({ theme }) => ({
  backgroundColor: '#111',
  border: '1px solid #1A1A1A',
  borderRadius: '16px',
  padding: theme.spacing(2.5),
  height: '100%',
}));

const IconBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bg',
})(({ theme, bg }) => ({
  width: 44,
  height: 44,
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: bg || '#1A1A1A',
  marginBottom: theme.spacing(1.5),
}));

const OrangeBtn = styled(Button)(() => ({
  background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
  color: '#fff',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  padding: '10px 20px',
  borderRadius: '10px',
  '&:hover': {
    background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
  },
}));

const paymentHistoryRows = [
  { paymentDate: 'Oct 30, 2023', period: 'Oct 01 - Oct 31', gross: '₹6,71,512', net: '₹5,17,920', status: 'Processed' },
  { paymentDate: 'Sep 30, 2023', period: 'Sep 01 - Sep 30', gross: '₹6,29,712', net: '₹4,83,060', status: 'Processed' },
  { paymentDate: 'Aug 30, 2023', period: 'Aug 01 - Aug 31', gross: '₹6,29,712', net: '₹4,83,060', status: 'Processed' },
  { paymentDate: 'Jul 30, 2023', period: 'Jul 01 - Jul 31', gross: '₹6,29,712', net: '₹4,83,060', status: 'Processed' },
];

const earningsTrendData = [
  { month: 'MAY', value: 45 },
  { month: 'JUN', value: 58 },
  { month: 'JUL', value: 62 },
  { month: 'AUG', value: 65 },
  { month: 'SEP', value: 72 },
  { month: 'OCT', value: 95 },
];

export default function PayrollPage() {
  const [earningsRange, setEarningsRange] = useState('Last 6 Months');

  return (
    <>
      <Head>
        <title>Payroll & Earnings Overview - ZenX Connect</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ backgroundColor: '#0A0A0A', minHeight: '100vh' }}>
        <StyledAppBar position="fixed">
          <Container maxWidth="xl">
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px' }}>
              <Logo component={Link} href="/dashboard">
                <span>ZenX</span> Connect
              </Logo>

              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                <NavLink href="/dashboard" active={false}>Home</NavLink>
                <NavLink href="/payroll" active={true}>Payroll</NavLink>
                <NavLink href="#" active={false}>Benefits</NavLink>
                <NavLink href="#" active={false}>AI Assistant</NavLink>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <IconButton sx={{ color: '#fff' }}><SunIcon /></IconButton>
                <Avatar sx={{ bgcolor: '#8B4513', width: 44, height: 44, fontWeight: 700, fontSize: '1rem' }}>JD</Avatar>
              </Box>
            </Toolbar>
          </Container>
        </StyledAppBar>

        <Container maxWidth="xl" sx={{ pt: '90px', pb: 6, width: '100%', px: 2 }}>
          {/* Page title and greeting */}
          <Box sx={{ mb: 3.5 }}>
            <Typography sx={{ color: '#fff', fontSize: '1.75rem', fontWeight: 700, mb: 0.5, letterSpacing: '-0.02em' }}>
              Payroll & Earnings Overview
            </Typography>
            <Typography sx={{ color: '#9e9e9e', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Welcome back, John. Here is a breakdown of your compensation for Oct 2023.
            </Typography>
          </Box>

          {/* Key metrics cards - 4 cards: fill row width, slightly right-aligned, wider cards */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, width: '100%', flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 200px', minWidth: 200, maxWidth: '100%', display: 'flex' }}>
              <CardDark sx={{ display: 'flex', flexDirection: 'column', minHeight: 150, p: 2.5, borderRadius: '16px', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                  <IconBox bg="#FF6B35">
                    <WalletIcon sx={{ color: '#fff', fontSize: 24 }} />
                  </IconBox>
                  <Typography sx={{ color: '#4CAF50', fontSize: '0.8rem', fontWeight: 600 }}>+4.2%</Typography>
                </Box>
                <Typography sx={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>Net Pay</Typography>
                <Typography sx={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>₹5,17,920</Typography>
                <Typography sx={{ color: '#9e9e9e', fontSize: '0.8rem', mt: 0.5 }}>Paid on Oct 30, 2023</Typography>
              </CardDark>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 200, maxWidth: '100%', display: 'flex' }}>
              <CardDark sx={{ display: 'flex', flexDirection: 'column', minHeight: 150, p: 2.5, borderRadius: '16px', width: '100%' }}>
                <IconBox bg="#e53935">
                  <DeductionsIcon sx={{ color: '#fff', fontSize: 24 }} />
                </IconBox>
                <Typography sx={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>Deductions</Typography>
                <Typography sx={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>₹1,53,592</Typography>
                <Typography sx={{ color: '#9e9e9e', fontSize: '0.8rem', mt: 0.5 }}>Taxes & Contributions</Typography>
              </CardDark>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 200, maxWidth: '100%', display: 'flex' }}>
              <CardDark sx={{ display: 'flex', flexDirection: 'column', minHeight: 150, p: 2.5, borderRadius: '16px', width: '100%' }}>
                <IconBox bg="#2196F3">
                  <DocumentIcon sx={{ color: '#fff', fontSize: 24 }} />
                </IconBox>
                <Typography sx={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>YTD Gross</Typography>
                <Typography sx={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>₹69,72,000</Typography>
                <Typography sx={{ color: '#9e9e9e', fontSize: '0.8rem', mt: 0.5 }}>Fiscal Year 2023</Typography>
              </CardDark>
            </Box>
            <Box sx={{ flex: '1 1 200px', minWidth: 200, maxWidth: '100%', display: 'flex' }}>
              <CardDark sx={{ display: 'flex', flexDirection: 'column', minHeight: 150, p: 2.5, borderRadius: '16px', width: '100%' }}>
                <IconBox bg="#FF6B35">
                  <RobotIcon sx={{ color: '#fff', fontSize: 24 }} />
                </IconBox>
                <Typography sx={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, mb: 0.5 }}>AI Tax Estimate</Typography>
                <Typography sx={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>₹48,140</Typography>
                <Typography sx={{ color: '#9e9e9e', fontSize: '0.8rem', mt: 0.5 }}>Next month projected savings</Typography>
              </CardDark>
            </Box>
          </Box>

          {/* Earnings Trend (left) + Payslip Breakdown (extreme right) */}
          <Box sx={{ marginLeft: -2, marginRight: -2, width: 'calc(100% + 32px)', mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: { md: 'space-between' }, alignItems: 'stretch', gap: 1 }}>
            <Box sx={{ flex: { md: '1 1 0%' }, maxWidth: { md: '62%' }, minWidth: 0, display: 'flex' }}>
              <CardDark sx={{ borderRadius: { xs: '16px', md: '16px 0 0 16px' }, p: 2.5, height: '100%', minHeight: 320, width: '100%', boxSizing: 'border-box' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1.05rem' }}>Earnings Trend</Typography>
                  <FormControl size="small" sx={{ minWidth: 140, '& .MuiOutlinedInput-root': { bgcolor: '#1A1A1A', color: '#fff', borderRadius: '8px', fontSize: '0.85rem' }, '& .MuiSelect-icon': { color: '#fff' }, '& fieldset': { borderColor: '#333' } }}>
                    <Select value={earningsRange} onChange={(e) => setEarningsRange(e.target.value)}>
                      <MenuItem value="Last 6 Months">Last 6 Months</MenuItem>
                      <MenuItem value="Last 12 Months">Last 12 Months</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                {/* Bar chart: gray max track + colored bar (dark blue / orange for OCT) */}
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 180, mt: 2, width: '100%' }}>
                  {earningsTrendData.map((d, i) => (
                    <Box key={d.month} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
                      <Box sx={{ width: '100%', height: 160, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', borderRadius: '8px 8px 0 0', bgcolor: 'rgba(255,255,255,0.06)' }}>
                        <Box
                          sx={{
                            width: '100%',
                            height: `${d.value}%`,
                            minHeight: 12,
                            borderRadius: '6px 6px 0 0',
                            bgcolor: i === earningsTrendData.length - 1 ? '#FF6B35' : '#1e40af',
                          }}
                        />
                      </Box>
                      <Typography sx={{ color: '#9e9e9e', fontSize: '0.7rem', mt: 1, fontWeight: 600 }}>{d.month}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardDark>
            </Box>
            <Box sx={{ flex: { md: '0 0 33%' }, minWidth: { md: 320 }, maxWidth: { md: '33%' }, display: 'flex' }}>
              <CardDark sx={{ borderRadius: { xs: '16px', md: '0 16px 16px 0' }, p: 2.5, height: '100%', minHeight: 320, width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1.05rem', mb: 2 }}>Payslip Breakdown</Typography>
                <Box sx={{ mb: 2, width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', py: 0.75, gap: 1 }}>
                    <Typography sx={{ color: '#fff', fontSize: '0.9rem', flex: '1 1 auto', minWidth: 0 }}>Base Salary</Typography>
                    <Typography sx={{ color: '#fff', fontSize: '0.9rem', flexShrink: 0 }}>₹6,22,500</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', py: 0.75, gap: 1 }}>
                    <Typography sx={{ color: '#fff', fontSize: '0.9rem', flex: '1 1 auto', minWidth: 0 }}>Performance Bonus</Typography>
                    <Typography sx={{ color: '#4CAF50', fontSize: '0.9rem', flexShrink: 0 }}>+₹41,500</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', py: 0.75, gap: 1 }}>
                    <Typography sx={{ color: '#fff', fontSize: '0.9rem', flex: '1 1 auto', minWidth: 0 }}>Meal Allowance</Typography>
                    <Typography sx={{ color: '#4CAF50', fontSize: '0.9rem', flexShrink: 0 }}>+₹7,512</Typography>
                  </Box>
                </Box>
                <Typography sx={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700, letterSpacing: 1, mb: 1 }}>DEDUCTIONS</Typography>
                <Box sx={{ mb: 2, width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', py: 0.75, gap: 1 }}>
                    <Typography sx={{ color: '#fff', fontSize: '0.9rem', flex: '1 1 auto', minWidth: 0 }}>Income Tax (FIT)</Typography>
                    <Typography sx={{ color: '#f44336', fontSize: '0.9rem', flexShrink: 0 }}>-₹1,03,750</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', py: 0.75, gap: 1 }}>
                    <Typography sx={{ color: '#fff', fontSize: '0.9rem', flex: '1 1 auto', minWidth: 0 }}>Medical Insurance</Typography>
                    <Typography sx={{ color: '#f44336', fontSize: '0.9rem', flexShrink: 0 }}>-₹33,200</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', py: 0.75, gap: 1 }}>
                    <Typography sx={{ color: '#fff', fontSize: '0.9rem', flex: '1 1 auto', minWidth: 0 }}>Retirement 401k</Typography>
                    <Typography sx={{ color: '#f44336', fontSize: '0.9rem', flexShrink: 0 }}>-₹16,642</Typography>
                  </Box>
                </Box>
                <Box sx={{ borderTop: '1px solid #333', pt: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: 1 }}>
                  <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem', flex: '1 1 auto', minWidth: 0 }}>Net Pay</Typography>
                  <Typography sx={{ color: '#FF6B35', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0 }}>₹5,17,920</Typography>
                </Box>
              </CardDark>
            </Box>
          </Box>

          {/* Payment History */}
          <CardDark sx={{ borderRadius: '16px', p: 2.5, mb: 3, overflow: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1.05rem' }}>Payment History</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button startIcon={<FilterIcon />} sx={{ color: '#9e9e9e', textTransform: 'none', fontSize: '0.9rem' }}>Filter</Button>
                <OrangeBtn startIcon={<ExportIcon />} sx={{ fontSize: '0.85rem', py: 0.75, px: 1.5 }}>Export All</OrangeBtn>
              </Box>
            </Box>
            <Table size="small" sx={{ '& .MuiTableCell-root': { borderColor: '#222', color: '#fff' }, '& th': { color: '#9e9e9e', fontWeight: 600, fontSize: '0.8rem' } }}>
              <TableHead>
                <TableRow>
                  <TableCell>Payment Date</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell>Gross Salary</TableCell>
                  <TableCell>Net Salary</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentHistoryRows.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ fontSize: '0.9rem' }}>{row.paymentDate}</TableCell>
                    <TableCell sx={{ fontSize: '0.9rem' }}>{row.period}</TableCell>
                    <TableCell sx={{ fontSize: '0.9rem' }}>{row.gross}</TableCell>
                    <TableCell sx={{ fontSize: '0.9rem', color: '#FF6B35', fontWeight: 600 }}>{row.net}</TableCell>
                    <TableCell sx={{ fontSize: '0.9rem', color: '#4CAF50' }}>{row.status}</TableCell>
                    <TableCell>
                      <IconButton size="small" sx={{ color: '#fff' }}><PdfIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardDark>

          {/* Optimize Your Earnings banner */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
              borderRadius: '16px',
              p: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              mb: 4,
            }}
          >
            <Box>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.25rem', mb: 0.5 }}>Optimize Your Earnings</Typography>
              <Typography sx={{ color: '#fff', fontSize: '0.95rem', opacity: 0.95 }}>
                Our AI assistant analyzed your recent deductions. You could save up to ₹12,450/month by adjusting your HSA contributions.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<SparkleIcon />}
              sx={{
                bgcolor: '#fff',
                color: '#FF6B35',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                px: 2,
                py: 1.25,
                borderRadius: '10px',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
              }}
            >
              View AI Recommendations
            </Button>
          </Box>

          {/* Footer */}
          <Box sx={{ borderTop: '1px solid #1A1A1A', pt: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Typography sx={{ color: '#757575', fontSize: '0.8rem' }}>
              © 2023 ZenX Connect. All rights reserved. Secure Financial Services.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="#" style={{ color: '#9e9e9e', fontSize: '0.8rem', textDecoration: 'none' }}>Privacy Policy</Link>
              <Link href="#" style={{ color: '#9e9e9e', fontSize: '0.8rem', textDecoration: 'none' }}>Terms of Service</Link>
              <Link href="#" style={{ color: '#9e9e9e', fontSize: '0.8rem', textDecoration: 'none' }}>Support</Link>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
