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
  Grid,
  LinearProgress,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import LockIcon from '@mui/icons-material/Lock';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { apiClient } from '../utils/apiClient';
import {
  SmartToy,
  CalendarMonth,
  School,
  Chat as ChatIcon,
  Schedule,
  RequestQuote,
  RocketLaunch,
  Security,
  ShowChart,
  MoreVert,
  Send,
  Close,
  Settings,
} from '@mui/icons-material';

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
  '&:active': {
    color: '#FF4500',
  },
}));

const StatCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#111',
  border: '1px solid #1A1A1A',
  borderRadius: '20px',
  padding: theme.spacing(3),
  height: '100%',
  position: 'relative',
}));

const ZenXAiCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#111',
  border: '1px solid #1A1A1A',
  borderRadius: '20px',
  padding: theme.spacing(3),
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    background: 'radial-gradient(circle, rgba(255, 69, 0, 0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
}));

const QuickActionBtn = styled(Button)(({ theme }) => ({
  backgroundColor: '#1A1A1A',
  color: '#fff',
  borderRadius: '12px',
  padding: '20px 16px',
  textTransform: 'none',
  width: '100%',
  flexDirection: 'column',
  gap: 8,
  fontSize: '0.85rem',
  fontWeight: 500,
  border: '1px solid #222',
  minHeight: 100,
  '&:hover': {
    backgroundColor: '#222',
    borderColor: '#2A2A2A',
  },
}));

const ChatBubble = styled(Box)(({ isUser }) => ({
  maxWidth: '85%',
  padding: '10px 14px',
  borderRadius: '14px',
  marginBottom: 10,
  ...(isUser
    ? {
        marginLeft: 'auto',
        backgroundColor: '#FF4500',
        color: '#fff',
        borderBottomRightRadius: 4,
      }
    : {
        backgroundColor: '#1A1A1A',
        color: '#fff',
        borderBottomLeftRadius: 4,
      }),
}));

const FeatureCard = styled(Paper)(({ theme }) => ({
  backgroundColor: '#111',
  border: '1px solid #1A1A1A',
  borderRadius: '16px',
  padding: theme.spacing(3),
  textAlign: 'center',
  height: '100%',
  transition: 'border-color 0.2s',
  '&:hover': {
    borderColor: '#2A2A2A',
  },
}));

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [payslipOpen, setPayslipOpen] = useState(false);
  const [payslipMonth, setPayslipMonth] = useState(null);
  const [payslipsListOpen, setPayslipsListOpen] = useState(false);
  const [chatBotOpen, setChatBotOpen] = useState(false);
  const [chatBotMessages, setChatBotMessages] = useState([
    { role: 'assistant', text: "Hello! I'm ZenX AI. How can I help you with payroll, leave, or HR queries today?" },
  ]);
  const [chatBotInput, setChatBotInput] = useState('');
  const [payrollData, setPayrollData] = useState(null);
  const [payrollLoading, setPayrollLoading] = useState(true);
  
  // ZenX AI Training Data - Predefined Queries and Responses
  const AI_TRAINING_DATA = [
    // GREETINGS - Random responses
    {
      keywords: ['hi', 'hello', 'hai', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'],
      response: () => {
        const responses = [
          "Hi there! How can I help you today?",
          "Hello! I'm here to assist you with any HR or payroll queries. What would you like to know?",
          "Hey! How can I make your day easier? 😊",
          "Hi! Welcome back! What can I help you with today?",
          "Hello! I'm ZenX AI, your personal HR assistant. How may I assist you?",
          "Hi there! Ready to help you with leave, payroll, or any other questions!",
          "Hey! Great to see you! What brings you here today?"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    },
    
    // NEW QUERIES - User Requested
    {
      keywords: ['next meeting', 'upcoming meeting', 'meeting today', 'meeting tomorrow', 'when is my meeting'],
      response: () => {
        const responses = [
          "Your next meeting is tomorrow at 11:00 AM.",
          "You have a meeting scheduled today at 10:30 AM.",
          "Your next meeting is tomorrow at 14:00 (2:00 PM).",
          "You have a meeting today at 18:00 (6:00 PM).",
          "You don't have any meetings scheduled for this week yet."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    },
    {
      keywords: ['annual salary', 'yearly salary', 'total salary', 'ctc', 'annual package', 'yearly pay'],
      response: `Your annual salary (CTC) is ₹51,60,000. This breaks down to:\n• Gross Monthly Pay: ₹4,70,000\n• Net Monthly Pay: ₹4,30,000 (after deductions)\n• Annual Gross: ₹56,40,000\n• Your January 2026 payslip includes a ₹5,000 monthly increment.\n\nFor detailed breakdown, please check your payslip.`
    },
    {
      keywords: ['annual leave policy', 'leave policy', 'how many leaves', 'leave entitlement', 'vacation policy'],
      response: `ZenX Connect's Annual Leave Policy:\n\n📅 Annual Leave: 20 days per year\n🏥 Sick Leave: 10 days per year\n🎉 Casual Leave: Included in Annual Leave\n\n• Leaves are credited at the beginning of each calendar year\n• Unused Annual Leave can be carried forward (max 5 days)\n• Sick Leave requires medical certificate for more than 3 consecutive days\n• Leave applications should be submitted at least 3 days in advance\n\nYou currently have 12 Annual Leave and 8 Sick Leave days remaining.`
    },
    {
      keywords: ['salary increment', 'increment policy', 'how increment works', 'when increment', 'pay raise'],
      response: `Salary Increment Policy:\n\nIncrements are usually based on the project assigned and individual performance. Normally, ₹5,000 gets incremented every year during the annual appraisal cycle.\n\nFactors considered for increment:\n• Project complexity and contribution\n• Performance ratings\n• Market standards\n• Years of experience\n\nYour last increment of ₹5,000 was applied in January 2026!`
    },
    {
      keywords: ['training courses', 'tech courses', 'recommend courses', 'learning suggestions', 'skill development'],
      response: `Recommended Tech Courses for You:\n\n1️⃣ Full Stack Web Development with React & Node.js\n   • Duration: 8 weeks\n   • Level: Intermediate\n   • Focus: Modern web development frameworks\n\n2️⃣ Cloud Computing with AWS & Azure\n   • Duration: 6 weeks\n   • Level: Intermediate to Advanced\n   • Focus: Cloud architecture and deployment\n\n3️⃣ Python for Data Science & Machine Learning\n   • Duration: 10 weeks\n   • Level: Beginner to Intermediate\n   • Focus: Data analysis, ML algorithms, visualization\n\nAll courses are available on LinkedIn Learning. Check your dashboard for current enrollments!`
    },
    {
      keywords: ['trending courses', 'ai courses', 'artificial intelligence courses', 'popular courses', 'hot courses'],
      response: `Trending AI Courses Right Now:\n\n🤖 1. Generative AI with ChatGPT & Large Language Models\n   • Hot Topic: Prompt engineering, GPT-4, AI integration\n\n🧠 2. Machine Learning & Deep Learning Fundamentals\n   • Covers: Neural networks, TensorFlow, PyTorch\n\n📊 3. AI for Business Intelligence & Data Analytics\n   • Focus: Predictive analytics, automated insights\n\n🎨 4. Computer Vision & Image Recognition with AI\n   • Topics: OpenCV, image processing, object detection\n\n💬 5. Natural Language Processing (NLP) & Chatbots\n   • Learn: Text analysis, sentiment analysis, conversational AI\n\nEnroll through LinkedIn Learning on your dashboard!`
    },
    {
      keywords: ['salary credited', 'when salary', 'payment day', 'salary credit date', 'when will i get paid'],
      response: `💰 Salary Credit Schedule:\n\nYour salary gets credited on the last Friday of every month.\n\n• January 2026: Friday, January 31st\n• If last Friday is a holiday, salary is credited on the previous working day\n• Payment time: Usually by 9:00 AM\n\nNext payment: ₹4,30,000 on January 31, 2026 (includes ₹5,000 increment)`
    },
    {
      keywords: ['food policy', 'meal policy', 'lunch policy', 'cafeteria', 'food allowance'],
      response: `🍽️ Company Food Policy:\n\n• Complimentary lunch is provided in the office cafeteria from 12:30 PM to 2:00 PM on all working days\n• Employees are entitled to one free meal per day (lunch or dinner for those working late)\n• Snacks and beverages (tea, coffee, juices) are available throughout the day in the pantry\n• Monthly meal allowance of ₹2,000 is provided for remote/hybrid employees\n• Special dietary requirements can be accommodated - please inform the cafeteria manager\n• Guests must be registered at reception for cafeteria access\n\nEnjoy your meals! 😊`
    },
    {
      keywords: ['company policies', 'company rules', 'office policy', 'workplace policy', 'what are policies'],
      response: `📋 Key Company Policies:\n\n1️⃣ Work Hours: Monday-Friday, 9:00 AM - 6:00 PM (flexible hours available)\n\n2️⃣ Dress Code: Business casual; Fridays are casual dress days\n\n3️⃣ Remote Work: Hybrid model - 3 days office, 2 days WFH (manager approval required)\n\n4️⃣ Communication: Use official email for formal communication; Slack for team collaboration\n\n5️⃣ Confidentiality: All company data and client information must be kept confidential\n\n6️⃣ Device Policy: Company laptops should not be used for personal activities; personal devices should not access company networks\n\n7️⃣ Leave Policy: Advance notice required; emergency leaves should be informed immediately\n\nFor detailed policies, please refer to the Employee Handbook or contact HR.`
    },
    
    // ADDITIONAL RANDOM RESPONSES FOR COMMON TOPICS
    {
      keywords: ['how to apply leave', 'leave application process', 'applying for leave', 'leave request process'],
      response: () => {
        const responses = [
          "To apply for leave:\n1. Click 'Apply Leave' in Quick Actions\n2. Select leave type (Annual/Sick)\n3. Choose start and end dates\n4. Add a reason (optional)\n5. Submit for approval\n\nYour manager will be notified automatically!",
          "Leave application is easy! Navigate to Quick Actions → Apply Leave, select your dates and leave type, and submit. You'll get a confirmation email once approved.",
          "You can apply for leave through the Quick Actions menu on your dashboard. Just click 'Apply Leave', fill in the details, and you're done! Your manager will review it within 24 hours."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    },
    {
      keywords: ['check leave status', 'leave approval status', 'leave request status', 'is my leave approved'],
      response: () => {
        const responses = [
          "Your recent leave requests:\n• March 5-7: Approved ✅\n• February 20: Pending approval ⏳\n\nYou can check detailed status in the Leave Management section.",
          "All your leave requests have been approved! You can view the full history in the Leave section of your dashboard.",
          "You have one pending leave request for February 20. Your manager will review it within 24 hours. Approved leaves will appear in your calendar automatically."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    },
    {
      keywords: ['payroll deduction', 'salary deduction', 'why deduction', 'tax deduction', 'pf deduction'],
      response: () => {
        const responses = [
          "Your salary deductions include:\n• Income Tax (TDS): ₹30,000\n• Provident Fund (PF): ₹7,000\n• Professional Tax: ₹2,500\n• Health Insurance: ₹500\n\nTotal Deductions: ₹40,000\nNet Pay: ₹4,30,000\n\nView detailed breakdown in your payslip.",
          "Standard deductions are applied for tax, PF, and insurance. Your net pay after deductions is ₹4,30,000. All deductions are as per government regulations and company policy.",
          "Deductions from your gross salary include PF contribution, TDS, professional tax, and insurance premiums. These are statutory deductions and help with your long-term savings and tax planning."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    },
    {
      keywords: ['bonus', 'incentive', 'performance bonus', 'annual bonus', 'variable pay'],
      response: () => {
        const responses = [
          "Annual performance bonus is typically paid in March-April based on your performance ratings and company performance. Your eligibility will be confirmed during appraisal season.",
          "Performance bonuses are awarded quarterly based on project completion and KPI achievement. Check with your manager about your current performance targets.",
          "You're eligible for annual bonus and quarterly incentives based on performance. The bonus payout is usually 10-20% of your annual CTC, subject to company and individual performance."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    },
    {
      keywords: ['submit timesheet', 'fill timesheet', 'timesheet deadline', 'timesheet submission'],
      response: () => {
        const responses = [
          "Timesheet submission deadline is every Friday by 5 PM. Click 'Timesheet' in Quick Actions to log your hours. Don't forget to add project codes and descriptions!",
          "You can submit your timesheet through Quick Actions → Timesheet. Make sure to fill in daily hours, project details, and any notes. Submit before Friday 5 PM to avoid delays in processing.",
          "Weekly timesheets must be submitted by end of day Friday. You've logged 38 hours this week so far. Click 'Timesheet' to review and submit."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    },
    {
      keywords: ['overtime', 'extra hours', 'working extra', 'overtime pay', 'comp off'],
      response: () => {
        const responses = [
          "Overtime hours are tracked in your timesheet. You can claim comp-off for hours worked beyond 40 hours/week or get overtime pay as per company policy. Talk to your manager for approval.",
          "Extra hours worked on weekdays can be logged as comp-off. Weekend work requires prior manager approval and is compensated with 2x comp-off or overtime pay based on your preference.",
          "You've worked 38 hours this week - within normal hours. Any overtime beyond 45 hours/week should be pre-approved by your manager and will be compensated through comp-off or additional pay."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    },
    {
      keywords: ['next review', 'appraisal date', 'review schedule', 'evaluation date', 'when is my review'],
      response: () => {
        const responses = [
          "Your next performance review is scheduled for November 15th with Michael Chen. It will cover your performance over the last 6 months, goal achievement, and career development.",
          "Annual appraisal cycle is in November. Your review meeting with Michael Chen is on November 15th. Start preparing your self-assessment and achievement highlights!",
          "Performance reviews happen bi-annually. Your next review is on November 15th. You'll discuss achievements, challenges, goals for next period, and increment/promotion opportunities."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    },
    {
      keywords: ['review feedback', 'appraisal feedback', 'performance feedback', 'review comments'],
      response: () => {
        const responses = [
          "Your last review feedback (May 2025):\n• Technical Skills: Excellent\n• Communication: Very Good\n• Team Collaboration: Outstanding\n• Overall Rating: 4.5/5\n\nKeep up the great work!",
          "Performance feedback from your last review was very positive! You exceeded expectations in project delivery and team leadership. Areas for development: public speaking and stakeholder management.",
          "Your manager highlighted your strong technical contributions and proactive approach. Review rating: 4.5/5. Continue focusing on innovation and mentoring junior team members."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    },
    {
      keywords: ['enroll course', 'join training', 'register course', 'course enrollment'],
      response: () => {
        const responses = [
          "You can enroll in any LinkedIn Learning course directly from your dashboard! Browse courses, click on the one you like, and start learning immediately. All courses are free for employees.",
          "To enroll in training programs:\n1. Check LinkedIn Learning section on dashboard\n2. Click 'Browse Courses'\n3. Select your preferred course\n4. Click 'Enroll' and start learning!\n\nYour progress is tracked automatically.",
          "Course enrollment is simple! Visit the LinkedIn Learning section, browse available courses, and enroll instantly. You can take multiple courses simultaneously. Certificates are awarded on completion."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    },
    {
      keywords: ['course certificate', 'training certificate', 'completion certificate', 'certification'],
      response: () => {
        const responses = [
          "Congratulations on completing 'AI Integration Basics'! Your certificate is available in your LinkedIn Learning profile. You can download and share it on LinkedIn to showcase your achievement.",
          "Course certificates are automatically generated upon 100% completion. You can download them from LinkedIn Learning and add them to your profile. These certifications are recognized industry-wide!",
          "You've earned 1 certificate so far: 'AI Integration Basics' (100% complete). Keep learning! Certificates can be downloaded from your LinkedIn Learning dashboard."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    },
    {
      keywords: ['schedule meeting', 'book meeting', 'arrange meeting', 'meeting room booking'],
      response: () => {
        const responses = [
          "To schedule a meeting:\n1. Use Outlook/Google Calendar\n2. Check room availability in conference room booking system\n3. Invite participants\n4. Add meeting agenda\n\nMeeting rooms can be booked through the office portal.",
          "You can book meetings through your calendar app. For conference rooms, use the room booking portal at booking.zenxconnect.com. Rooms have video conferencing facilities and can accommodate 4-20 people.",
          "Schedule meetings via Outlook Calendar. Don't forget to check participant availability and book a conference room if needed. For urgent meetings, contact admin at ext. 101."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    },
    {
      keywords: ['cancel meeting', 'reschedule meeting', 'postpone meeting', 'meeting cancelled'],
      response: () => {
        const responses = [
          "To cancel or reschedule a meeting, update the calendar invite and notify all participants. If it's a recurring meeting, specify whether to update only this instance or the entire series.",
          "Meetings can be rescheduled through your calendar app. Send an update to all participants with the new time. For last-minute cancellations, call or message participants directly.",
          "If you need to cancel a meeting, please notify participants at least 2 hours in advance. Update the calendar invite with cancellation reason and propose alternate times if needed."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    },
    {
      keywords: ['attendance policy', 'working hours policy', 'late coming', 'punctuality'],
      response: () => {
        const responses = [
          "Company attendance policy:\n• Core hours: 10 AM - 4 PM (mandatory)\n• Flexible arrival: 9-10 AM\n• Flexible departure: 6-7 PM\n• Minimum 8 hours/day required\n• Late arrivals (after 10 AM) should be informed to manager",
          "Work timing is 9 AM to 6 PM with flexible 1-hour window. Regular late arrivals may require discussion with HR. Track your attendance through the HR portal.",
          "Flexible working hours are available - you can start between 9-10 AM and leave between 6-7 PM, maintaining 8 work hours. Repeated late coming may affect performance reviews."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    },
    {
      keywords: ['dress code', 'what to wear', 'office attire', 'clothing policy'],
      response: () => {
        const responses = [
          "Dress code is business casual:\n• Monday-Thursday: Formal shirts, trousers, modest dresses\n• Friday: Casual (jeans allowed, but no shorts/flip-flops)\n• Client meetings: Business formal required\n• Remote days: Your choice!",
          "We follow business casual dress code. Jeans are allowed on Fridays (Casual Fridays!). Avoid overly casual attire like shorts, tank tops, or flip-flops. Dress formally for client meetings.",
          "Office dress code: Business casual attire. Keep it professional but comfortable. Fridays are casual dress days where you can wear jeans and sneakers. Always dress appropriately for external meetings."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    },
    {
      keywords: ['it support', 'technical issue', 'laptop problem', 'system issue', 'tech help'],
      response: () => {
        const responses = [
          "For IT support:\n📧 Email: it-support@zenxconnect.com\n📞 Call: Ext 200 or +91-XXXX-XXXXXX\n🎫 Raise ticket: https://helpdesk.zenxconnect.com\n\nSupport hours: 24/7 for critical issues, 9 AM - 6 PM for general queries",
          "Having technical issues? Contact IT support at ext. 200 or email it-support@zenxconnect.com. For urgent issues (system down, security), call immediately. For routine issues, raise a ticket.",
          "IT Helpdesk is available 24/7! Call ext. 200 for immediate assistance or log a ticket at the IT portal. Average response time: <30 minutes for critical issues, <4 hours for others."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    },
    {
      keywords: ['hr contact', 'hr email', 'hr phone', 'contact hr team', 'hr helpdesk'],
      response: () => {
        const responses = [
          "HR Team Contacts:\n📧 General: hr@zenxconnect.com\n📞 Phone: +91-XXXX-XXXXXX (Ext 150)\n🏢 Office: HR Dept, 2nd Floor\n⏰ Hours: Mon-Fri, 9 AM - 6 PM\n\nFor urgent matters, visit HR office directly!",
          "Need HR assistance? Contact:\n• Email: hr@zenxconnect.com\n• Call: Ext 150\n• Visit: HR Department (2nd Floor)\n\nThey handle payroll, benefits, policies, grievances, and more!",
          "HR team is here to help!\n📧 hr@zenxconnect.com\n📞 +91-XXXX-XXXXXX\n\nHR Manager: Sarah Williams (Ext 151)\nPayroll Team: payroll@zenxconnect.com (Ext 152)\n\nOffice hours: 9 AM - 6 PM, Mon-Fri"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }
    },
    
    // EXISTING QUERIES
    {
      keywords: ['leave balance', 'remaining leave', 'leaves left', 'vacation days', 'holiday balance'],
      response: `You have 12 days of Annual Leave remaining out of 20 total days, and 8 days of Sick Leave remaining out of 10 total days. You can apply for leave through the Quick Actions menu.`
    },
    {
      keywords: ['next payroll', 'salary date', 'payment date', 'when paid', 'payday'],
      response: `Your next payroll payment is scheduled for January 31, 2026. Your estimated net pay is ₹4,30,000, which includes a ₹5,000 increment. You can view your payslip details in the Payroll Summary section.`
    },
    {
      keywords: ['payslip', 'salary slip', 'pay stub', 'view payslip'],
      response: `You can view your current and previous payslips by clicking on "VIEW PAYSLIP" in the Payroll Summary card, or by selecting "Payslips" from Quick Actions. Your January 2026 payslip includes a ₹5,000 increment.`
    },
    {
      keywords: ['apply leave', 'request leave', 'take leave', 'book vacation', 'submit leave'],
      response: `To apply for leave, click on "Apply Leave" in the Quick Actions section. You can select the leave type (Annual or Sick), choose dates, and submit your request. Currently, you have 12 Annual Leave days and 8 Sick Leave days available.`
    },
    {
      keywords: ['timesheet', 'log hours', 'submit hours', 'working hours', 'time tracking'],
      response: `You can manage your timesheet by clicking "Timesheet" in Quick Actions. You can create a new timesheet for the current week or view your existing timesheet. You've worked 38 hours this week.`
    },
    {
      keywords: ['performance review', 'appraisal', 'review meeting', 'evaluation'],
      response: `Your next performance review is scheduled for November 15th with Michael Chen. This will include a review of your achievements, goals, and development opportunities. Would you like me to add it to your calendar?`
    },
    {
      keywords: ['benefits', 'health insurance', 'medical', 'insurance'],
      response: `Your benefits package includes health insurance, provident fund, and other perks. For detailed information about your benefits, please contact HR at hr@zenxconnect.com or check the Benefits section in the employee portal.`
    },
    {
      keywords: ['contact hr', 'hr contact', 'reach hr', 'hr help'],
      response: `You can reach the HR team at:\n📧 Email: hr@zenxconnect.com\n📞 Phone: +91-XXXX-XXXXXX\n🏢 Office Hours: Monday-Friday, 9 AM - 6 PM\n\nFor urgent matters, please call during office hours.`
    },
    {
      keywords: ['training', 'learning', 'courses', 'linkedin learning', 'development'],
      response: `Great question! You have access to LinkedIn Learning courses. Currently, you're working on "AI Integration in HR Workflows" (72% complete) and have completed "AI Integration Basics" (100%). Check the LinkedIn Learning section on your dashboard to browse more courses.`
    },
    {
      keywords: ['team', 'colleagues', 'manager', 'reporting'],
      response: `Your reporting manager is Michael Chen. For team-related queries, organizational structure, or collaboration tools, please refer to the Team Directory or contact your manager directly.`
    },
    {
      keywords: ['work from home', 'wfh', 'remote work', 'hybrid'],
      response: `For information about work-from-home policies, hybrid work arrangements, or remote work requests, please contact your manager or HR. Current company policy and your specific arrangements will be outlined in your employment agreement.`
    },
    {
      keywords: ['project', 'task', 'assignment', 'workload'],
      response: `You've worked 38 hours this week. Based on your project load, I recommend wrapping up your documentation today to enjoy a meeting-free Friday. Use the Timesheet feature to track your hours across different projects.`
    },
    {
      keywords: ['holiday', 'public holiday', 'company holiday', 'festival'],
      response: `For information about company holidays, public holidays, and festival leave, please check the Company Calendar or contact HR. Remember to plan your leave applications accordingly.`
    },
    {
      keywords: ['password', 'reset password', 'login issue', 'access problem'],
      response: `For password reset or login issues, please contact IT Support at it-support@zenxconnect.com or use the "Forgot Password" option on the login page. For immediate assistance, call the IT helpdesk.`
    }
  ];
  
  const [timesheetDialogOpen, setTimesheetDialogOpen] = useState(false);
  const [timesheetMode, setTimesheetMode] = useState('choice');
  const [weekTimesheet, setWeekTimesheet] = useState(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return { date: d, day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i], hours: '', project: '', notes: '' };
    });
  });
  const [savedWeekTimesheet, setSavedWeekTimesheet] = useState(null);

  const PAYSLIP_MONTHS = [
    { label: 'January 2026', key: 'jan2026', periodStart: 'Jan 1, 2026', periodEnd: 'Jan 31, 2026', paymentDate: 'Jan 31, 2026', hasIncrement: true },
    { label: 'December 2025', key: 'dec2025', periodStart: 'Dec 1, 2025', periodEnd: 'Dec 31, 2025', paymentDate: 'Dec 31, 2025', hasIncrement: false },
    { label: 'November 2025', key: 'nov2025', periodStart: 'Nov 1, 2025', periodEnd: 'Nov 30, 2025', paymentDate: 'Nov 28, 2025', hasIncrement: false },
    { label: 'October 2025', key: 'oct2025', periodStart: 'Oct 1, 2025', periodEnd: 'Oct 31, 2025', paymentDate: 'Oct 31, 2025', hasIncrement: false },
  ];

  const handlePayslipSelect = (month) => {
    setPayslipMonth(month);
    setPayslipsListOpen(false);
    setPayslipOpen(true);
  };

  const handleChatBotSend = () => {
    if (!chatBotInput.trim()) return;
    
    const userMessage = chatBotInput.trim();
    setChatBotMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setChatBotInput('');
    
    setTimeout(() => {
      // Convert user input to lowercase for matching
      const userInputLower = userMessage.toLowerCase();
      
      // Find matching response from training data
      let botResponse = null;
      for (const data of AI_TRAINING_DATA) {
        if (data.keywords.some(keyword => userInputLower.includes(keyword))) {
          // Check if response is a function (for random responses) or a string
          botResponse = typeof data.response === 'function' ? data.response() : data.response;
          break;
        }
      }
      
      // Default response if no match found
      if (!botResponse) {
        botResponse = "I understand you have a query. I can help you with:\n\n• Leave balance and applications\n• Payroll and salary information\n• Timesheet management\n• Performance reviews\n• Training and courses\n• Meeting schedules\n• Company policies\n• HR contacts and support\n\nPlease feel free to ask about any of these topics!";
      }
      
      setChatBotMessages((prev) => [...prev, { role: 'assistant', text: botResponse }]);
    }, 600);
  };

  const handleTimesheetDayChange = (index, field, value) => {
    setWeekTimesheet((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleTimesheetSave = () => {
    setSavedWeekTimesheet([...weekTimesheet]);
    setTimesheetMode('view');
  };

  const getWeekStart = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
    return start;
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!apiClient.isAuthenticated()) {
          router.push('/login');
          return;
        }
        const userData = await apiClient.getCurrentUser();
        
        // Redirect admins to admin panel
        if (userData.is_admin) {
          router.push('/admin');
          return;
        }
        
        setUser(userData);
        
        // Fetch latest payroll data
        try {
          const latestPayroll = await apiClient.getLatestPayroll(userData.id);
          setPayrollData(latestPayroll);
        } catch (error) {
          console.error('Error fetching payroll:', error);
          // No payroll data available - will show placeholder
        } finally {
          setPayrollLoading(false);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = () => {
    apiClient.logout();
    router.push('/login');
  };

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

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#FF4500' }} />
      </Box>
    );
  }

  const firstName = user?.name?.split(' ')[0] || 'Sarah';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 1 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <>
      <Head>
        <title>Personal Dashboard - ZenX Connect</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ backgroundColor: '#000', minHeight: '100vh' }}>
        {/* Top Navigation - ZenX Connect style */}
        <StyledAppBar position="fixed">
          <Container maxWidth="xl">
            <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px' }}>
              <Logo>
                <span>ZenX</span> Connect
              </Logo>

              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                <NavButton onClick={() => router.push('/dashboard')}>Home</NavButton>
                <NavButton onClick={() => router.push('/career')}>Career Path</NavButton>
                <NavButton onClick={() => router.push('/learning')}>Learning</NavButton>
                <NavButton onClick={() => router.push('/dashboard')}>Well-being</NavButton>
              </Box>

              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#FF4500',
                    color: '#FF4500',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2.5,
                    py: 1,
                    borderRadius: '8px',
                    '&:hover': { 
                      bgcolor: '#FF4500',
                      color: '#fff',
                      borderColor: '#FF4500'
                    },
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </StyledAppBar>

        {/* Main Content - matches design: Personal Dashboard header, then 3-row layout */}
        <Container maxWidth="xl" sx={{ pt: '100px', pb: 6 }}>
          {/* Personal Dashboard header: title + welcome */}
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: { xs: '1.5rem', md: '1.75rem' }, mb: 0.5 }}>
              {getGreeting()}, {firstName}
            </Typography>
            <Typography sx={{ color: '#888', fontSize: '1rem' }}>
              Welcome back. Here&apos;s what&apos;s happening today.
            </Typography>
          </Box>

          {/* Two-column layout: Left (ZenX AI, Payroll|Leave, Active Learning) | Right (Quick Actions, ZenX Chat) */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'flex-start',
              gap: 3,
            }}
          >
            {/* Left column: ZenX AI, then Payroll + Leave side by side, then Active Learning */}
            <Box sx={{ flex: { xs: 'none', md: '1 1 0' }, minWidth: 0, width: { xs: '100%', md: 'auto' } }}>
              {/* ZenX AI Assistant - above Payroll and Leave */}
              <ZenXAiCard sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <SmartToy sx={{ color: '#FF4500', fontSize: 24 }} />
                  <Typography sx={{ color: '#FF4500', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1.5 }}>
                    ZENX AI ASSISTANT
                  </Typography>
                </Box>
                <Typography sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
                  Hi, {firstName}!
                </Typography>
                <Typography sx={{ color: '#ccc', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  You&apos;ve worked 38 hours this week. Based on your project load, I recommend wrapping up your
                  documentation today to enjoy a meeting-free Friday.
                </Typography>
              </ZenXAiCard>

              {/* Payroll Summary (left) | Leave Balance (right) - side by side, top-aligned, directly below ZenX AI */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <StatCard sx={{ height: '100%' }}>
                    {payrollLoading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: 150 }}>
                        <CircularProgress sx={{ color: '#FF4500' }} size={30} />
                      </Box>
                    ) : payrollData ? (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                            <Typography sx={{ color: '#999', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1.5 }}>
                              PAYROLL SUMMARY
                            </Typography>
                            <RequestQuote sx={{ color: '#666', fontSize: 16 }} />
                          </Box>
                          <Typography sx={{ color: '#4CAF50', fontSize: '2rem', fontWeight: 700 }}>
                            ₹{(payrollData.basic_salary + payrollData.hra + payrollData.transport_allowance + payrollData.other_allowances + payrollData.bonus - payrollData.tax - payrollData.provident_fund - payrollData.insurance - payrollData.other_deductions).toLocaleString('en-IN')}
                          </Typography>
                          <Typography sx={{ color: '#4CAF50', fontSize: '0.8rem', mb: 1 }}>
                            Net Pay — {payrollData.month} {payrollData.year}
                          </Typography>
                          <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>
                            Status: {payrollData.status.charAt(0).toUpperCase() + payrollData.status.slice(1)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                          <Button
                            onClick={() => { setPayslipMonth(PAYSLIP_MONTHS[0]); setPayslipOpen(true); }}
                            sx={{
                              color: '#fff',
                              textTransform: 'none',
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                            }}
                          >
                            VIEW DETAILS
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 150 }}>
                        <RequestQuote sx={{ color: '#666', fontSize: 40, mb: 1 }} />
                        <Typography sx={{ color: '#888', fontSize: '0.9rem', textAlign: 'center' }}>
                          No payroll data available
                        </Typography>
                        <Typography sx={{ color: '#666', fontSize: '0.8rem', textAlign: 'center', mt: 0.5 }}>
                          Contact admin to set up your payroll
                        </Typography>
                      </Box>
                    )}
                  </StatCard>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <StatCard sx={{ height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography sx={{ color: '#999', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1.5 }}>
                        LEAVE BALANCE
                      </Typography>
                      <Box sx={{ bgcolor: '#1A1A1A', borderRadius: '6px', p: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CalendarMonth sx={{ color: '#666', fontSize: 18 }} />
                      </Box>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                        <Typography sx={{ color: '#fff', fontSize: '0.8rem', fontWeight: 400 }}>Annual Leave</Typography>
                        <Typography sx={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>12 / 20 Days</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={60}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#1A1A1A',
                          '& .MuiLinearProgress-bar': { bgcolor: '#FF4500', borderRadius: 3 },
                        }}
                      />
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                        <Typography sx={{ color: '#fff', fontSize: '0.8rem', fontWeight: 400 }}>Sick Leave</Typography>
                        <Typography sx={{ color: '#fff', fontSize: '0.8rem', fontWeight: 600 }}>8 / 10 Days</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={80}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#1A1A1A',
                          '& .MuiLinearProgress-bar': { bgcolor: '#4285F4', borderRadius: 3 },
                        }}
                      />
                    </Box>
                  </StatCard>
                </Grid>
              </Grid>

              {/* Active Learning - spans full width of left column (below Payroll + Leave) */}
          <Box sx={{ mb: 3 }}>
            <StatCard>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      minWidth: 80,
                      borderRadius: '12px',
                      bgcolor: '#1A1A1A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 40,
                        border: '2px solid #444',
                        borderRadius: '4px',
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: -6,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          border: '2px solid #444',
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <School sx={{ color: '#FF4500', fontSize: 20 }} />
                      <Typography sx={{ color: '#999', fontSize: '0.75rem', fontWeight: 600 }}>
                        LinkedIn Learning
                      </Typography>
                    </Box>
                    <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>
                      AI Integration in HR Workflows
                    </Typography>
                    <Typography sx={{ color: '#888', fontSize: '0.8rem', mb: 1 }}>
                      Module 3: Automated Screening Systems
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={72}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: '#1A1A1A',
                        '& .MuiLinearProgress-bar': { bgcolor: '#FF4500', borderRadius: 3 },
                      }}
                    />
                    <Typography sx={{ color: '#FF4500', fontSize: '0.75rem', mt: 0.5 }}>72% Completed</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                  <Button
                    sx={{
                      color: '#FF4500',
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      p: 0,
                      minWidth: 'auto',
                      '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                    }}
                  >
                    BROWSE COURSES
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => window.open('https://www.linkedin.com/feed/', '_blank')}
                    sx={{
                      bgcolor: '#FF4500',
                      color: '#fff',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 2.5,
                      py: 1,
                      borderRadius: '8px',
                      '&:hover': { bgcolor: '#E03E00' },
                    }}
                  >
                    RESUME
                  </Button>
                </Box>
              </Box>
              
              {/* Second Course - AI Integration Basics (100% Completed) */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, pt: 5, mt: 4, borderTop: '1px solid #1A1A1A' }}>
                <Box sx={{ display: 'flex', gap: 2, flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      minWidth: 80,
                      borderRadius: '12px',
                      bgcolor: '#1A1A1A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 40,
                        border: '2px solid #4CAF50',
                        borderRadius: '4px',
                        position: 'relative',
                        bgcolor: 'rgba(76, 175, 80, 0.1)',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: -6,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          border: '2px solid #4CAF50',
                          bgcolor: '#4CAF50',
                        },
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <School sx={{ color: '#FF4500', fontSize: 20 }} />
                      <Typography sx={{ color: '#999', fontSize: '0.75rem', fontWeight: 600 }}>
                        LinkedIn Learning
                      </Typography>
                    </Box>
                    <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>
                      AI Integration Basics
                    </Typography>
                    <Typography sx={{ color: '#888', fontSize: '0.8rem', mb: 1 }}>
                      All modules completed
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={100}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: '#1A1A1A',
                        '& .MuiLinearProgress-bar': { bgcolor: '#4CAF50', borderRadius: 3 },
                      }}
                    />
                    <Typography sx={{ color: '#4CAF50', fontSize: '0.75rem', mt: 0.5 }}>100% Completed</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                  <Button
                    component="a"
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: '#FF4500',
                      textTransform: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      p: 0,
                      minWidth: 'auto',
                      textDecoration: 'none',
                      '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                    }}
                  >
                    BROWSE COURSES
                  </Button>
                </Box>
              </Box>
            </StatCard>
          </Box>
            </Box>

            {/* Right column: Quick Actions (top), ZenX Assistant Chat (below) */}
            <Box sx={{ flex: { xs: 'none', md: '0 0 auto' }, width: { xs: '100%', md: 360 }, minWidth: 0 }}>
              <StatCard sx={{ mb: 3 }}>
                <Typography sx={{ color: '#999', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1.5, mb: 2 }}>
                  QUICK ACTIONS
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <QuickActionBtn>
                      <CalendarMonth sx={{ color: '#FF4500', fontSize: 28 }} />
                      Apply Leave
                    </QuickActionBtn>
                  </Grid>
                  <Grid item xs={6}>
                    <QuickActionBtn onClick={() => setPayslipsListOpen(true)}>
                      <RequestQuote sx={{ color: '#FF4500', fontSize: 28 }} />
                      Payslips
                    </QuickActionBtn>
                  </Grid>
                  <Grid item xs={6}>
                    <QuickActionBtn onClick={() => setChatBotOpen(true)}>
                      <ChatIcon sx={{ color: '#FF4500', fontSize: 28 }} />
                      AI Chat
                    </QuickActionBtn>
                  </Grid>
                  <Grid item xs={6}>
                    <QuickActionBtn onClick={() => { setTimesheetMode('choice'); setTimesheetDialogOpen(true); }}>
                      <Schedule sx={{ color: '#FF4500', fontSize: 28 }} />
                      Timesheet
                    </QuickActionBtn>
                  </Grid>
                </Grid>
              </StatCard>
            </Box>
          </Box>

          {/* Why ZenX Connect? */}
          <Box sx={{ mt: 8, mb: 6 }}>
            <Typography
              sx={{
                color: '#fff',
                fontSize: '1.5rem',
                fontWeight: 700,
                textAlign: 'center',
                mb: 3,
              }}
            >
              Why ZenX Connect?
            </Typography>
            <Grid container spacing={3} sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
              <Grid item xs={12} sm={4} sx={{ minWidth: 0 }}>
                <FeatureCard>
                  <RocketLaunch sx={{ color: '#FF4500', fontSize: 40, mb: 1.5 }} />
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem', mb: 1 }}>
                    Fast & Efficient
                  </Typography>
                  <Typography sx={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    Streamlined workflows to save time for what matters most.
                  </Typography>
                </FeatureCard>
              </Grid>
              <Grid item xs={12} sm={4} sx={{ minWidth: 0 }}>
                <FeatureCard>
                  <Security sx={{ color: '#4285F4', fontSize: 40, mb: 1.5 }} />
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem', mb: 1 }}>
                    Secure Access
                  </Typography>
                  <Typography sx={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    Enterprise-grade security to protect your sensitive data.
                  </Typography>
                </FeatureCard>
              </Grid>
              <Grid item xs={12} sm={4} sx={{ minWidth: 0 }}>
                <FeatureCard>
                  <ShowChart sx={{ color: '#4CAF50', fontSize: 40, mb: 1.5 }} />
                  <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '1rem', mb: 1 }}>
                    Insightful Analytics
                  </Typography>
                  <Typography sx={{ color: '#888', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    Real-time dashboards to give you better visibility.
                  </Typography>
                </FeatureCard>
              </Grid>
            </Grid>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              pt: 4,
              borderTop: '1px solid #1A1A1A',
              gap: 2,
            }}
          >
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
                Contact Support
              </Button>
            </Box>
            <Typography sx={{ color: '#666', fontSize: '0.8rem' }}>
              © 2026 ZenX Connect Portal. All rights reserved.
            </Typography>
          </Box>
        </Container>

        {/* Payslips list - previous 3 months */}
        <Dialog
          open={payslipsListOpen}
          onClose={() => setPayslipsListOpen(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#111',
              border: '1px solid #1A1A1A',
              borderRadius: '16px',
              color: '#fff',
            },
          }}
        >
          <DialogTitle sx={{ color: '#fff', fontWeight: 700, borderBottom: '1px solid #1A1A1A', pb: 2 }}>
            Previous Payslips
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            {PAYSLIP_MONTHS.map((month) => (
              <Button
                key={month.key}
                fullWidth
                onClick={() => handlePayslipSelect(month)}
                sx={{
                  justifyContent: 'flex-start',
                  color: '#fff',
                  textTransform: 'none',
                  fontSize: '1rem',
                  py: 1.5,
                  mb: 1,
                  border: '1px solid #222',
                  borderRadius: '10px',
                  '&:hover': { bgcolor: '#1A1A1A' },
                }}
                startIcon={<RequestQuote sx={{ color: '#FF4500' }} />}
              >
                {month.label}
              </Button>
            ))}
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid #1A1A1A' }}>
            <Button onClick={() => setPayslipsListOpen(false)} sx={{ color: '#888', textTransform: 'none' }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Payslip Dialog - split with cutoff and deductions (single month) */}
        <Dialog
          open={payslipOpen}
          onClose={() => { setPayslipOpen(false); setPayslipMonth(null); }}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#111',
              border: '1px solid #1A1A1A',
              borderRadius: '16px',
              color: '#fff',
            },
          }}
        >
          <DialogTitle sx={{ color: '#fff', fontWeight: 700, borderBottom: '1px solid #1A1A1A', pb: 2 }}>
            Payslip — {payslipMonth?.label || 'January 2026'}
          </DialogTitle>
          <DialogContent sx={{ pt: 2.5 }}>
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ color: '#999', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1, mb: 0.5 }}>
                PAY PERIOD (CUTOFF)
              </Typography>
              <Typography sx={{ color: '#fff', fontSize: '0.95rem' }}>
                {payslipMonth?.periodStart || 'Jan 1, 2026'} — {payslipMonth?.periodEnd || 'Jan 31, 2026'}
              </Typography>
              <Typography sx={{ color: '#888', fontSize: '0.8rem', mt: 0.5 }}>
                Payment date: {payslipMonth?.paymentDate || 'Jan 31, 2026'}
              </Typography>
            </Box>
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ color: '#999', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1, mb: 1 }}>
                EARNINGS
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>Basic Salary</Typography>
                <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>₹2,55,000</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>HRA</Typography>
                <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>₹72,000</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>Special Allowance</Typography>
                <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>₹1,30,000</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>Bonus / Other</Typography>
                <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>₹8,000</Typography>
              </Box>
              {payslipMonth?.hasIncrement && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                  <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>Increment</Typography>
                  <Typography sx={{ color: '#4CAF50', fontSize: '0.9rem' }}>₹5,000</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderTop: '1px solid #222' }}>
                <Typography sx={{ color: '#fff', fontWeight: 600 }}>Gross Pay</Typography>
                <Typography sx={{ color: '#fff', fontWeight: 600 }}>
                  ₹{payslipMonth?.hasIncrement ? '4,70,000' : '4,65,000'}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mb: 2.5 }}>
              <Typography sx={{ color: '#999', fontSize: '0.7rem', fontWeight: 700, letterSpacing: 1, mb: 1 }}>
                DEDUCTIONS
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>Provident Fund (PF)</Typography>
                <Typography sx={{ color: '#f44336', fontSize: '0.9rem' }}>− ₹22,320</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>Professional Tax</Typography>
                <Typography sx={{ color: '#f44336', fontSize: '0.9rem' }}>− ₹2,500</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                <Typography sx={{ color: '#ccc', fontSize: '0.9rem' }}>Income Tax (TDS)</Typography>
                <Typography sx={{ color: '#f44336', fontSize: '0.9rem' }}>− ₹15,180</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderTop: '1px solid #222' }}>
                <Typography sx={{ color: '#fff', fontWeight: 600 }}>Total Deductions</Typography>
                <Typography sx={{ color: '#f44336', fontWeight: 600 }}>− ₹40,000</Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1.5,
                px: 1.5,
                bgcolor: 'rgba(76, 175, 80, 0.1)',
                borderRadius: '10px',
                border: '1px solid rgba(76, 175, 80, 0.3)',
              }}
            >
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>Net Pay</Typography>
              <Typography sx={{ color: '#4CAF50', fontWeight: 700, fontSize: '1.15rem' }}>
                ₹{payslipMonth?.hasIncrement ? '4,30,000' : '4,25,000'}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid #1A1A1A' }}>
            <Button
              onClick={() => { setPayslipOpen(false); setPayslipMonth(null); }}
              sx={{
                color: '#888',
                textTransform: 'none',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* ZenX AI Chatbot - bottom-right popup */}
        {chatBotOpen && (
          <Paper
            elevation={8}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              width: 380,
              maxWidth: 'calc(100vw - 48px)',
              height: 480,
              maxHeight: '70vh',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#111',
              border: '1px solid #1A1A1A',
              borderRadius: '16px',
              overflow: 'hidden',
              zIndex: 1300,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #1A1A1A', bgcolor: '#0A0A0A' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SmartToy sx={{ color: '#FF4500', fontSize: 28 }} />
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>ZenX AI</Typography>
              </Box>
              <IconButton size="small" onClick={() => setChatBotOpen(false)} sx={{ color: '#888' }}>
                <Close />
              </IconButton>
            </Box>
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {chatBotMessages.map((msg, i) => (
                <ChatBubble key={i} isUser={msg.role === 'user'}>
                  <Typography 
                    sx={{ 
                      fontSize: '0.9rem',
                      whiteSpace: 'pre-line',
                      lineHeight: 1.6,
                      '& strong': { fontWeight: 600 }
                    }}
                  >
                    {msg.text}
                  </Typography>
                </ChatBubble>
              ))}
            </Box>
            <Box sx={{ p: 2, borderTop: '1px solid #1A1A1A' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type your message..."
                value={chatBotInput}
                onChange={(e) => setChatBotInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleChatBotSend()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#1A1A1A',
                    borderRadius: '12px',
                    color: '#fff',
                    '& fieldset': { borderColor: '#2A2A2A' },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton sx={{ color: '#FF4500' }} onClick={handleChatBotSend} size="small">
                        <Send />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Paper>
        )}

        {/* Timesheet Dialog - choice / create / view */}
        <Dialog
          open={timesheetDialogOpen}
          onClose={() => { setTimesheetDialogOpen(false); setTimesheetMode('choice'); }}
          maxWidth={timesheetMode === 'choice' ? 'xs' : 'md'}
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#111',
              border: '1px solid #1A1A1A',
              borderRadius: '16px',
              color: '#fff',
            },
          }}
        >
          <DialogTitle sx={{ color: '#fff', fontWeight: 700, borderBottom: '1px solid #1A1A1A', pb: 2 }}>
            {timesheetMode === 'choice' && 'Timesheet'}
            {timesheetMode === 'create' && 'Create New Timesheet'}
            {timesheetMode === 'view' && "This Week's Timesheet"}
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            {timesheetMode === 'choice' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Schedule />}
                  onClick={() => setTimesheetMode('create')}
                  sx={{
                    color: '#FF4500',
                    borderColor: '#FF4500',
                    textTransform: 'none',
                    py: 1.5,
                    '&:hover': { borderColor: '#FF4500', bgcolor: 'rgba(255,69,0,0.08)' },
                  }}
                >
                  Create new timesheet
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CalendarMonth />}
                  onClick={() => setTimesheetMode('view')}
                  sx={{
                    color: '#fff',
                    borderColor: '#333',
                    textTransform: 'none',
                    py: 1.5,
                    '&:hover': { borderColor: '#555', bgcolor: '#1A1A1A' },
                  }}
                >
                  View this week&apos;s timesheet
                </Button>
              </Box>
            )}

            {timesheetMode === 'create' && (
              <Box sx={{ pt: 1 }}>
                <Typography sx={{ color: '#888', fontSize: '0.85rem', mb: 2 }}>
                  Week starting: {weekTimesheet[0]?.date?.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                      <Typography sx={{ color: '#999', fontSize: '0.75rem', width: 60 }}>Day</Typography>
                      <Typography sx={{ color: '#999', fontSize: '0.75rem', flex: 1, minWidth: 50 }}>Hours</Typography>
                      <Typography sx={{ color: '#999', fontSize: '0.75rem', flex: 2, minWidth: 80 }}>Project / Task</Typography>
                      <Typography sx={{ color: '#999', fontSize: '0.75rem', flex: 2, minWidth: 80 }}>Notes</Typography>
                    </Box>
                  </Grid>
                  {weekTimesheet.map((row, index) => (
                    <Grid item xs={12} key={index}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Typography sx={{ color: '#ccc', fontSize: '0.85rem', width: 60 }}>{row.day}</Typography>
                        <TextField
                          type="number"
                          size="small"
                          placeholder="0"
                          value={row.hours}
                          onChange={(e) => handleTimesheetDayChange(index, 'hours', e.target.value)}
                          inputProps={{ min: 0, max: 24, step: 0.5 }}
                          sx={{
                            width: 80,
                            '& .MuiOutlinedInput-root': { bgcolor: '#1A1A1A', color: '#fff', '& fieldset': { borderColor: '#333' } },
                          }}
                        />
                        <TextField
                          size="small"
                          placeholder="Project or task"
                          value={row.project}
                          onChange={(e) => handleTimesheetDayChange(index, 'project', e.target.value)}
                          sx={{
                            flex: 1,
                            minWidth: 120,
                            '& .MuiOutlinedInput-root': { bgcolor: '#1A1A1A', color: '#fff', '& fieldset': { borderColor: '#333' } },
                          }}
                        />
                        <TextField
                          size="small"
                          placeholder="Notes"
                          value={row.notes}
                          onChange={(e) => handleTimesheetDayChange(index, 'notes', e.target.value)}
                          sx={{
                            flex: 1,
                            minWidth: 120,
                            '& .MuiOutlinedInput-root': { bgcolor: '#1A1A1A', color: '#fff', '& fieldset': { borderColor: '#333' } },
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {timesheetMode === 'view' && (
              <Box sx={{ pt: 1 }}>
                <Typography sx={{ color: '#888', fontSize: '0.85rem', mb: 2 }}>
                  Week starting: {getWeekStart().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </Typography>
                {savedWeekTimesheet && savedWeekTimesheet.length > 0 ? (
                  <Grid container spacing={1.5}>
                    {savedWeekTimesheet.map((row, index) => (
                      <Grid item xs={12} key={index}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', p: 1.5, bgcolor: '#1A1A1A', borderRadius: '8px' }}>
                          <Typography sx={{ color: '#fff', fontWeight: 600, width: 50 }}>{row.day}</Typography>
                          <Typography sx={{ color: '#ccc' }}>{row.hours || '0'} hrs</Typography>
                          <Typography sx={{ color: '#888' }}>{row.project || '—'}</Typography>
                          <Typography sx={{ color: '#666', fontSize: '0.85rem' }}>{row.notes || '—'}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography sx={{ color: '#888', fontSize: '0.9rem' }}>
                    No timesheet saved for this week yet. Create a new timesheet to add your hours.
                  </Typography>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid #1A1A1A' }}>
            {timesheetMode === 'choice' && (
              <Button onClick={() => { setTimesheetDialogOpen(false); setTimesheetMode('choice'); }} sx={{ color: '#888', textTransform: 'none' }}>
                Close
              </Button>
            )}
            {timesheetMode === 'create' && (
              <>
                <Button onClick={() => setTimesheetMode('choice')} sx={{ color: '#888', textTransform: 'none' }}>
                  Back
                </Button>
                <Button variant="contained" onClick={handleTimesheetSave} sx={{ bgcolor: '#FF4500', textTransform: 'none', '&:hover': { bgcolor: '#E03E00' } }}>
                  Save Timesheet
                </Button>
              </>
            )}
            {timesheetMode === 'view' && (
              <>
                <Button onClick={() => setTimesheetMode('choice')} sx={{ color: '#888', textTransform: 'none' }}>
                  Back
                </Button>
                <Button onClick={() => setTimesheetDialogOpen(false)} sx={{ color: '#888', textTransform: 'none' }}>
                  Close
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
