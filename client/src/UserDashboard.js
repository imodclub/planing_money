import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { MainListItems, SecondaryListItems } from './Component/listItems';
import IncomeForm from './Component/IncomeForm';
import ExpensesForm from './Component/ExpensesForm';
import SavingsForm from './Component/SavingsForm';
import SavingsRatioForm from './Component/SavingsRatioForm'; // เพิ่มการ import SavingsRatioForm
import MonthlyReportChart from './Component/MonthlyReportChart';
import SavingsRatioReport from './Component/SavingsRatioReport';
import IncomeReport from './Component/IncomeReport';
import ExpenseReport from './Component/ExpenseReport';
import SavingsReport from './Component/SavingsReport';
import EditDeleteItems from './Component/EditDeleteItems';
import DeleteData from './Component/DeleteData';
import FinancialSummary from './Component/FinancialSummary';
import apiURL from './config/Config';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpensesForm, setShowExpensesForm] = useState(false);
  const [showSavingsForm, setShowSavingsForm] = useState(false);
  const [showSavingsRatioForm, setShowSavingsRatioForm] = useState(false); // เพิ่มตัวแปร state สำหรับ SavingsRatioForm
  const [showReport, setShowReport] = useState(true);
  const [showIncomeReport, setShowIncomeReport] = useState(false);
  const [showExpenseReport, setShowExpenseReport] = useState(false);
  const [showSavingsReport, setShowSavingsReport] = useState(false);
  const [showEditDeleteItems, setShowEditDeleteItems] = useState(false);
  const [showDeleteData, setShowDeleteData] = useState(false);
  const [iframeHeight, setIframeHeight] = useState(window.innerHeight);
  const [iframeWidth, setIframeWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  /*----------Code เดิม---------/
  useEffect(() => {
    const nameFromLocalStorage = localStorage.getItem('name');
    const sessionName = sessionStorage.getItem('name');
    if (!nameFromLocalStorage && sessionName) {
      // Redirect to Sign In page if no session found
      window.location.href = '/signin';
    } else {
      setName(nameFromLocalStorage);
      setShowReport(true);
    }
  }, []);
  /----------Code เดิม---------*/

  const fetchUserData = useCallback(async (sessionId) => {
    try {
      const response = await fetch(`${apiURL}/session`, {
        method: 'GET',
        credentials: 'include', // เพื่อให้ cookies ถูกส่งไปด้วย
      });

      if (response.ok) {
        const data = await response.json();
        setName(data.name); // ตั้งค่าชื่อผู้ใช้จากข้อมูลที่ดึงมาได้
      } else {
        console.error('Session not found');
        navigate('/signin');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      navigate('/signin');
    }
  }, [navigate]);

  useEffect(() => {
    // ดึงข้อมูลจาก Cookie
    const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      acc[key] = value;
      return acc;
    }, {});

    const sessionId = cookies['session']; // ตรวจสอบค่า session ID
    console.log('Session ID:', sessionId);

    if (!sessionId) {
      // ถ้าไม่มี session ID ให้เปลี่ยนเส้นทางไปที่หน้า Sign In
      navigate('/signin');
    } else {
      // ดึงข้อมูลผู้ใช้จากเซิร์ฟเวอร์โดยใช้ session ID
      fetchUserData(sessionId);
    }
  }, [fetchUserData, navigate]); // เพิ่ม fetchUserData ใน dependency array


  const handleUserIncomeFormClick = () => {
    setShowIncomeForm(true);
    setShowExpensesForm(false);
    setShowSavingsForm(false);
    setShowSavingsRatioForm(false); // ซ่อน SavingsRatioForm เมื่อแสดง IncomeForm
    setShowReport(false);
    setShowIncomeReport(false);
    setShowExpenseReport(false);
    setShowSavingsReport(false);
    setShowEditDeleteItems(false);
  };

  const handleUserExpensesFormClick = () => {
    setShowExpensesForm(true);
    setShowIncomeForm(false);
    setShowSavingsForm(false);
    setShowSavingsRatioForm(false); // ซ่อน SavingsRatioForm เมื่อแสดง ExpensesForm
    setShowReport(false);
    setShowIncomeReport(false);
    setShowExpenseReport(false);
    setShowSavingsReport(false);
    setShowEditDeleteItems(false);
    setShowDeleteData(false);
  };

  const handleUserSavingsFormClick = () => {
    setShowSavingsForm(true);
    setShowIncomeForm(false);
    setShowExpensesForm(false);
    setShowSavingsRatioForm(false); // ซ่อน SavingsRatioForm เมื่อแสดง SavingsForm
    setShowReport(false);
    setShowIncomeReport(false);
    setShowSavingsReport(false);
    setShowExpenseReport(false);
    setShowEditDeleteItems(false);
  };

  const handleUserSavingsRatioFormClick = () => {
    setShowSavingsRatioForm(true); // แสดง SavingsRatioForm
    setShowIncomeForm(false);
    setShowExpensesForm(false);
    setShowSavingsForm(false);
    setShowReport(false);
    setShowExpenseReport(false);
    setShowIncomeReport(false);
    setShowSavingsReport(false);
    setShowDeleteData(false);
  };

  const handleUserReportClick = () => {
    setShowReport(true);
    setShowIncomeForm(false);
    setShowExpensesForm(false);
    setShowSavingsForm(false);
    setShowSavingsRatioForm(false);
    setShowExpenseReport(false);
    setShowIncomeReport(false);
    setShowSavingsReport(false);
    setShowEditDeleteItems(false);
    setShowDeleteData(false);
  };

  const handleUserIncomeReportClick = () => {
    setShowIncomeReport(true);
    setShowIncomeForm(false);
    setShowExpensesForm(false);
    setShowSavingsForm(false);
    setShowSavingsRatioForm(false);
    setShowReport(false);
    setShowExpenseReport(false);
    setShowSavingsReport(false);
    setShowDeleteData(false);
  };
 

    const handleUserExpenseReportClick = () => {
      setShowExpenseReport(true);
      setShowIncomeForm(false);
      setShowExpensesForm(false);
      setShowSavingsForm(false);
      setShowSavingsRatioForm(false);
      setShowReport(false);
      setShowIncomeReport(false);
      setShowSavingsReport(false);
      setShowEditDeleteItems(false);
      setShowDeleteData(false);
    };
  
const handleUserSavingsReportClick = () => {
  setShowSavingsReport(true);
  setShowIncomeForm(false);
  setShowExpensesForm(false);
  setShowSavingsForm(false);
  setShowSavingsRatioForm(false);
  setShowReport(false);
  setShowIncomeReport(false);
  setShowExpenseReport(false);
  setShowEditDeleteItems(false);
  setShowDeleteData(false);
};

    const handleEditDeleteItemsClick = () => {
      setShowEditDeleteItems(true);
      setShowIncomeForm(false);
      setShowExpensesForm(false);
      setShowSavingsForm(false);
      setShowSavingsRatioForm(false);
      setShowReport(false);
      setShowIncomeReport(false);
      setShowExpenseReport(false);
      setShowSavingsReport(false);
      setShowDeleteData(false);
    };
  
  const handleDeleteDataClick = () => {
    setShowDeleteData(true);
    setShowIncomeForm(false);
    setShowExpensesForm(false);
    setShowSavingsForm(false);
    setShowSavingsRatioForm(false);
    setShowReport(false);
    setShowIncomeReport(false);
    setShowExpenseReport(false);
    setShowSavingsReport(false);
    setShowEditDeleteItems(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIframeHeight(window.innerHeight);
      setIframeWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <div style={{ height: iframeHeight, width: iframeWidth }}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="absolute" open={open}>
            <Toolbar
              sx={{
                pr: '24px',
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: '36px',
                  ...(open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                สวัสดี คุณ {name}
              </Typography>
              <Typography variant="overline" display="block" gutterBottom>
                version 1.0
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
              <MainListItems
                onUserIncomeFormClick={handleUserIncomeFormClick}
                onUserExpensesFormClick={handleUserExpensesFormClick}
                onUserSavingsFormClick={handleUserSavingsFormClick}
                onUserSavingsRatioFormClick={handleUserSavingsRatioFormClick} // ส่ง prop สำหรับเรียกใช้ SavingsRatioForm
                onUserReportClick={handleUserReportClick}
                onUserIncomeReportClick={handleUserIncomeReportClick}
                onUserExpenseReportClick={handleUserExpenseReportClick}
                onUserSavingsReportClick={handleUserSavingsReportClick}
                onEditDeleteItemsClick={handleEditDeleteItemsClick}
                onDeleteDataClick={handleDeleteDataClick}
              />
              <Divider sx={{ my: 1 }} />
              <SecondaryListItems />
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
            }}
          >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper
                    sx={{ p: 2, display: 'flex', flexDirection: 'column' }}
                  >
                    <Typography
                      component="h2"
                      variant="h6"
                      color="primary"
                      gutterBottom
                    >
                      ข้อมูลทางการเงินของคุณ
                    </Typography>
                    {showReport && (
                      <>
                        <MonthlyReportChart /> <FinancialSummary />
                        <SavingsRatioReport />
                      </>
                    )}
                    {showIncomeForm && <IncomeForm />}
                    {showExpensesForm && <ExpensesForm />}
                    {showSavingsForm && <SavingsForm />}
                    {showSavingsRatioForm && <SavingsRatioForm />}
                    {showIncomeReport && <IncomeReport />}
                    {showExpenseReport && <ExpenseReport />}
                    {showSavingsReport && <SavingsReport />}
                    {showEditDeleteItems && <EditDeleteItems />}
                    {showDeleteData && <DeleteData />}
                  </Paper>
                  
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}
