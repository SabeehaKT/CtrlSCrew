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
  LinearProgress,
  Avatar,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  CalendarMonth as CalendarIcon,
  AccessTime as ClockIcon,
  AutoAwesome as SparkleIcon,
  ChevronLeft,
  ChevronRight,
  Add as AddIcon,
  FormatListBulleted as ListIcon,
  ArrowForward as ArrowIcon,
  Schedule as AnnualIcon,
  MedicalServices as SickIcon,
  Star as CasualIcon,
} from '@mui/icons-material';

const Logo = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.25rem',
  cursor: 'pointer',
  '& span': {
    color: '#FF4500',
  },
}));

const StyledAppBar = styled(AppBar)(() => ({
  backgroundColor: '#0A0A0A',
  boxShadow: 'none',
  borderBottom: '1px solid #1A1A1A',
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

const CardDark = styled(Paper)(({ theme }) => ({
  backgroundColor: '#111',
  border: '1px solid #1A1A1A',
  borderRadius: '16px',
  padding: theme.spacing(2.5),
  height: '100%',
}));

const LeaveBalanceCard = styled(Paper)(({ theme }) => ({
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
  fontSize: '1.25rem',
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

const AIInsightCard = styled(Paper)(() => ({
  background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)',
  borderRadius: '16px',
  padding: 24,
  color: '#fff',
}));

const teamMembers = [
  { name: 'Sarah Miller', initials: 'SM', color: '#4A90E2', days: ['available', 'available', 'leave', 'leave', 'available'] },
  { name: 'Ryan K.', initials: 'RK', color: '#9B59B6', days: ['available', 'available', 'available', 'available', 'available'] },
  { name: 'Amy Lee', initials: 'AL', color: '#E91E63', days: ['available', 'available', 'leavePurple', 'leavePurple', 'leavePurple'] },
];

const recentRequests = [
  { status: 'PENDING', statusColor: '#FFC107', time: 'Submitted 2h ago', type: 'Earned Leave', range: 'Oct 25 - Oct 27 (3 Days)', note: null },
  { status: 'APPROVED', statusColor: '#4CAF50', time: '2 days ago', type: 'Casual Leave', range: 'Oct 10 (1 Day)', note: null },
  { status: 'REJECTED', statusColor: '#f44336', time: 'Sep 28', type: 'Sick Leave', range: 'Sep 27 (1 Day)', note: '*Please provide medical certificate for records.' },
];

export default function LeavePage() {
  const router = useRouter();
  const [leaveType, setLeaveType] = useState('Earned Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [monthLabel, setMonthLabel] = useState('October 2023');

  const handlePrevMonth = () => setMonthLabel('September 2023');
  const handleNextMonth = () => setMonthLabel('November 2023');

  return (
    <>
      <Head>
        <title>Leave Management - ZenX Connect</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ backgroundColor: '#000', minHeight: '100vh' }}>
        <StyledAppBar position="fixed">
          <Container maxWidth="xl">
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px' }}>
              <Logo onClick={() => router.push('/dashboard')}>
                <span>ZenX</span> Connect
              </Logo>

              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                <NavButton onClick={() => router.push('/dashboard')}>Home</NavButton>
                <NavButton className="active">Leaves</NavButton>
                <NavButton onClick={() => router.push('/career')}>Career</NavButton>
                <NavButton onClick={() => router.push('/learning')}>Learning</NavButton>
                <NavButton onClick={() => router.push('/wellbeing')}>Wellbeing</NavButton>
                <NavButton onClick={() => router.push('/compliance')}>Compliance</NavButton>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <OrangeBtn startIcon={<AddIcon sx={{ fontSize: 20 }} />}>Apply for Leave</OrangeBtn>
                <Avatar sx={{ bgcolor: '#8B4513', width: 44, height: 44, fontWeight: 700, fontSize: '1rem' }}>JD</Avatar>
              </Box>
            </Toolbar>
          </Container>
        </StyledAppBar>

        <Container maxWidth="lg" sx={{ pt: '90px', pb: 6 }}>
          {/* Page title */}
          <Box sx={{ mb: 3.5 }}>
            <Typography sx={{ color: '#fff', fontSize: '1.75rem', fontWeight: 700, mb: 0.5, letterSpacing: '-0.02em' }}>
              Leave Management
            </Typography>
            <Typography sx={{ color: '#9e9e9e', fontSize: '0.95rem', lineHeight: 1.5 }}>
              Track your balances, peer availability, and manage requests.
            </Typography>
          </Box>

          {/* Leave balance cards: Annual (left), Sick (middle), Casual (right); full-width row, wider boxes */}
          <Box sx={{ display: 'flex', gap: 2, width: '100%', mb: 3, flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 260px', minWidth: 260, maxWidth: '100%', display: 'flex' }}>
              <LeaveBalanceCard sx={{ display: 'flex', flexDirection: 'column', minHeight: 200, height: '100%', width: '100%', p: 2.5, borderRadius: '16px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <IconBox bg="rgba(74, 144, 226, 0.25)" sx={{ width: 48, height: 48, borderRadius: '12px' }}>
                    <AnnualIcon sx={{ color: '#5B9BD5', fontSize: 24 }} />
                  </IconBox>
                  <Typography sx={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 0.8 }}>ANNUAL</Typography>
                </Box>
                <Typography sx={{ color: '#fff', fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 }}>12</Typography>
                <Typography sx={{ color: '#9e9e9e', fontSize: '0.85rem', mb: 1.25 }}>Days remaining</Typography>
                <LinearProgress variant="determinate" value={60} sx={{ height: 6, borderRadius: 3, bgcolor: '#1A1A1A', mb: 1, '& .MuiLinearProgress-bar': { bgcolor: '#4A90E2', borderRadius: 3 } }} />
                <Typography sx={{ color: '#9e9e9e', fontSize: '0.8rem' }}>Used: 8 of 20 days</Typography>
              </LeaveBalanceCard>
            </Box>
            <Box sx={{ flex: '1 1 260px', minWidth: 260, maxWidth: '100%', display: 'flex' }}>
              <LeaveBalanceCard sx={{ display: 'flex', flexDirection: 'column', minHeight: 200, height: '100%', width: '100%', p: 2.5, borderRadius: '16px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <IconBox bg="rgba(76, 175, 80, 0.25)" sx={{ width: 48, height: 48, borderRadius: '12px' }}>
                    <SickIcon sx={{ color: '#4CAF50', fontSize: 24 }} />
                  </IconBox>
                  <Typography sx={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 0.8 }}>SICK</Typography>
                </Box>
                <Typography sx={{ color: '#fff', fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 }}>06</Typography>
                <Typography sx={{ color: '#9e9e9e', fontSize: '0.85rem', mb: 1.25 }}>Days remaining</Typography>
                <LinearProgress variant="determinate" value={75} sx={{ height: 6, borderRadius: 3, bgcolor: '#1A1A1A', mb: 1, '& .MuiLinearProgress-bar': { bgcolor: '#4CAF50', borderRadius: 3 } }} />
                <Typography sx={{ color: '#9e9e9e', fontSize: '0.8rem' }}>Used: 2 of 8 days</Typography>
              </LeaveBalanceCard>
            </Box>
            <Box sx={{ flex: '1 1 260px', minWidth: 260, maxWidth: '100%', display: 'flex' }}>
              <LeaveBalanceCard sx={{ display: 'flex', flexDirection: 'column', minHeight: 200, height: '100%', width: '100%', p: 2.5, borderRadius: '16px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <IconBox bg="rgba(155, 89, 182, 0.25)" sx={{ width: 48, height: 48, borderRadius: '12px' }}>
                    <CasualIcon sx={{ color: '#9B59B6', fontSize: 24 }} />
                  </IconBox>
                  <Typography sx={{ color: '#fff', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 0.8 }}>CASUAL</Typography>
                </Box>
                <Typography sx={{ color: '#fff', fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 }}>04</Typography>
                <Typography sx={{ color: '#9e9e9e', fontSize: '0.85rem', mb: 1.25 }}>Days remaining</Typography>
                <LinearProgress variant="determinate" value={40} sx={{ height: 6, borderRadius: 3, bgcolor: '#1A1A1A', mb: 1, '& .MuiLinearProgress-bar': { bgcolor: '#9B59B6', borderRadius: 3 } }} />
                <Typography sx={{ color: '#9e9e9e', fontSize: '0.8rem' }}>Used: 6 of 10 days</Typography>
              </LeaveBalanceCard>
            </Box>
          </Box>

          {/* Two columns: Left = Quick Apply + Team Availability | Right = Recent Requests + AI Insight */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 3,
              width: '100%',
              alignItems: 'flex-start',
            }}
          >
            {/* Left column (wider): Quick Apply + Team Availability */}
            <Box sx={{ flex: { xs: 'none', sm: '2 1 0%' }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
              <CardDark sx={{ borderRadius: '16px', width: '100%', height: 'auto', pt: 1.5, pr: 1, pb: 1.5, pl: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ListIcon sx={{ color: '#FF6B35', fontSize: 20 }} />
                  <ArrowIcon sx={{ color: '#FF6B35', fontSize: 18 }} />
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1.05rem' }}>Quick Apply</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                    <Typography sx={{ color: '#9e9e9e', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Leave Type</Typography>
                    <FormControl size="small" sx={{ minWidth: 120, '& .MuiOutlinedInput-root': { bgcolor: '#1A1A1A', color: '#fff', borderRadius: '8px', fontSize: '0.8rem', minHeight: 32 }, '& .MuiSelect-icon': { color: '#fff' }, '& fieldset': { borderColor: '#333' } }}>
                      <Select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} displayEmpty>
                        <MenuItem value="Earned Leave">Earned Leave</MenuItem>
                        <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                        <MenuItem value="Casual Leave">Casual Leave</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                    <Typography sx={{ color: '#9e9e9e', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Duration</Typography>
                    <TextField
                      size="small"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        width: 140,
                        '& .MuiOutlinedInput-root': { bgcolor: '#1A1A1A', color: '#fff', borderRadius: '8px', fontSize: '0.8rem', minHeight: 32 },
                        '& .MuiOutlinedInput-input': { '&::-webkit-calendar-picker-indicator': { filter: 'invert(1)', cursor: 'pointer', opacity: 0.8 } },
                        '& fieldset': { borderColor: '#333' },
                      }}
                    />
                    <Typography sx={{ color: '#757575', fontSize: '0.75rem' }}>to</Typography>
                    <TextField
                      size="small"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        width: 140,
                        '& .MuiOutlinedInput-root': { bgcolor: '#1A1A1A', color: '#fff', borderRadius: '8px', fontSize: '0.8rem', minHeight: 32 },
                        '& .MuiOutlinedInput-input': { '&::-webkit-calendar-picker-indicator': { filter: 'invert(1)', cursor: 'pointer', opacity: 0.8 } },
                        '& fieldset': { borderColor: '#333' },
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: '1 1 160px', minWidth: 120 }}>
                    <Typography sx={{ color: '#9e9e9e', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>Reason</Typography>
                    <TextField size="small" placeholder="Briefly describe..." value={reason} onChange={(e) => setReason(e.target.value)} fullWidth sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#1A1A1A', color: '#fff', borderRadius: '8px', fontSize: '0.8rem', minHeight: 32, py: 0 }, '& fieldset': { borderColor: '#333' } }} />
                  </Box>
                  <OrangeBtn sx={{ py: 0.4, px: 1, fontSize: '0.75rem', minHeight: 32, flexShrink: 0 }}>Submit Request</OrangeBtn>
                </Box>
              </CardDark>

              <CardDark sx={{ borderRadius: '16px', p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon sx={{ color: '#FF6B35', fontSize: 22 }} />
                    <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1.05rem' }}>Team Availability</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton onClick={handlePrevMonth} size="small" sx={{ color: '#fff', p: 0.5 }}><ChevronLeft /></IconButton>
                    <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{monthLabel}</Typography>
                    <IconButton onClick={handleNextMonth} size="small" sx={{ color: '#fff', p: 0.5 }}><ChevronRight /></IconButton>
                  </Box>
                </Box>
                <Box sx={{ overflowX: 'auto' }}>
                  <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', minWidth: 420 }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', color: '#9e9e9e', fontSize: '0.75rem', fontWeight: 600, padding: '8px 12px 8px 0' }}>Team Member</th>
                        {['Mon 16', 'Tue 17', 'Wed 18', 'Thu 19', 'Fri 20'].map((d) => (
                          <th key={d} style={{ color: '#9e9e9e', fontSize: '0.75rem', fontWeight: 600, padding: '8px 6px', textAlign: 'center' }}>{d}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembers.map((member) => (
                        <tr key={member.name}>
                          <td style={{ padding: '10px 12px 10px 0', verticalAlign: 'middle' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 36, height: 36, bgcolor: member.color, fontSize: '0.8rem', fontWeight: 700 }}>{member.initials}</Avatar>
                              <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>{member.name}</Typography>
                            </Box>
                          </td>
                          {member.days.map((day, i) => (
                            <td key={i} style={{ padding: '10px 6px', verticalAlign: 'middle', textAlign: 'center' }}>
                              <Box sx={{ width: 28, height: 12, borderRadius: 1, mx: 'auto', bgcolor: day === 'available' ? '#4CAF50' : day === 'leavePurple' ? '#9B59B6' : '#E65100' }} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Box>
                </Box>
              </CardDark>
            </Box>

            {/* Right column (narrower): Recent Requests + AI Insight */}
            <Box sx={{ flex: { xs: 'none', sm: '1 1 0%' }, minWidth: 0, width: { xs: '100%', sm: 'auto' } }}>
              <CardDark sx={{ mb: 2, borderRadius: '16px', p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <ClockIcon sx={{ color: '#FF6B35', fontSize: 22 }} />
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1.05rem' }}>Recent Requests</Typography>
                </Box>
                {recentRequests.map((req, i) => (
                  <Box key={i} sx={{ borderBottom: i < recentRequests.length - 1 ? '1px solid #222' : 'none', pb: i < recentRequests.length - 1 ? 2 : 0, mb: i < recentRequests.length - 1 ? 2 : 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography sx={{ color: req.statusColor, fontSize: '0.75rem', fontWeight: 700, letterSpacing: 0.5 }}>{req.status}</Typography>
                      <Typography sx={{ color: '#9e9e9e', fontSize: '0.75rem' }}>{req.time}</Typography>
                    </Box>
                    <Typography sx={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>{req.type}</Typography>
                    <Typography sx={{ color: '#9e9e9e', fontSize: '0.85rem' }}>{req.range}</Typography>
                    {req.note && <Typography sx={{ color: '#bdbdbd', fontSize: '0.8rem', mt: 0.5, fontStyle: 'italic' }}>{req.note}</Typography>}
                  </Box>
                ))}
                <Button sx={{ color: '#FF6B35', textTransform: 'none', fontSize: '0.9rem', fontWeight: 600, p: 0, mt: 1.5, minWidth: 0 }}>View all history</Button>
              </CardDark>

              <AIInsightCard sx={{ borderRadius: '16px', p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <SparkleIcon sx={{ fontSize: 22, color: '#fff' }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>AI Insight</Typography>
                </Box>
                <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.6, mb: 2, color: '#fff', opacity: 0.95 }}>
                  Based on your team&apos;s schedule, October 24th is the best day for your team outing. No one has leaves planned yet!
                </Typography>
                <OrangeBtn fullWidth sx={{ bgcolor: 'rgba(255,255,255,0.25)', color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.35)' } }}>Schedule Sync</OrangeBtn>
              </AIInsightCard>
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 6, pt: 4, borderTop: '1px solid #1A1A1A' }}>
            <Typography sx={{ color: '#757575', fontSize: '0.8rem' }}>
              © 2023 ZenX Connect - AI Powered Enterprise Suite. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}
