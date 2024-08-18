import React, { useState, useEffect } from 'react';
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
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { MainListItems, SecondaryListItems } from './Component/listItems';
import IncomeForm from './Component/IncomeForm';
import ExpensesForm from './Component/ExpensesForm';
import SavingsForm from './Component/SavingsForm';
import SavingsRatioForm from './Component/SavingsRatioForm'; // เพิ่มการ import SavingsRatioForm
import MonthlyReportChart from './Component/MonthlyReportChart';
import SavingsRatioReport from './Component/SavingsRatioReport';

const drawerWidth = 260;

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
  const [open, setOpen] = useState(true);
  const [name, setName] = useState('');
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpensesForm, setShowExpensesForm] = useState(false);
  const [showSavingsForm, setShowSavingsForm] = useState(false);
  const [showSavingsRatioForm, setShowSavingsRatioForm] = useState(false); // เพิ่มตัวแปร state สำหรับ SavingsRatioForm
  const [showReport, setShowReport] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const nameFromLocalStorage = localStorage.getItem('name');
    setName(nameFromLocalStorage);
    setShowReport(true);
  }, []);

  const handleUserIncomeFormClick = () => {
    setShowIncomeForm(true);
    setShowExpensesForm(false);
    setShowSavingsForm(false);
    setShowSavingsRatioForm(false); // ซ่อน SavingsRatioForm เมื่อแสดง IncomeForm
    setShowReport(false);
  };

  const handleUserExpensesFormClick = () => {
    setShowExpensesForm(true);
    setShowIncomeForm(false);
    setShowSavingsForm(false);
    setShowSavingsRatioForm(false); // ซ่อน SavingsRatioForm เมื่อแสดง ExpensesForm
    setShowReport(false);
  };

  const handleUserSavingsFormClick = () => {
    setShowSavingsForm(true);
    setShowIncomeForm(false);
    setShowExpensesForm(false);
    setShowSavingsRatioForm(false); // ซ่อน SavingsRatioForm เมื่อแสดง SavingsForm
    setShowReport(false);
  };

  const handleUserSavingsRatioFormClick = () => {
    setShowSavingsRatioForm(true); // แสดง SavingsRatioForm
    setShowIncomeForm(false);
    setShowExpensesForm(false);
    setShowSavingsForm(false);
    setShowReport(false);
  };

  const handleUserReportClick = () => {
    setShowReport(true);
    setShowIncomeForm(false);
    setShowExpensesForm(false);
    setShowSavingsForm(false);
    setShowSavingsRatioForm(false); // ซ่อน SavingsRatioForm เมื่อแสดง Report
  };

  return (
    <ThemeProvider theme={defaultTheme}>
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
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
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
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
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
                      <MonthlyReportChart /> <SavingsRatioReport />
                    </>
                  )}
                  {showIncomeForm && <IncomeForm />}
                  {showExpensesForm && <ExpensesForm />}
                  {showSavingsForm && <SavingsForm />}
                  {showSavingsRatioForm && <SavingsRatioForm />}
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
