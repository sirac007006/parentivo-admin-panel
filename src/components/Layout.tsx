// @ts-nocheck
import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  School as SchoolIcon,
  Report as ReportIcon,
  Comment as CommentIcon,
  CalendarMonth as CalendarIcon,
  EventAvailable as EventIcon,
  VideoCall as VideoCallIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import AuthService from '../services/authService';
import { USER_ROLES } from '../config';

const drawerWidth = 280;

interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Korisnici',
    path: '/users',
    icon: <PeopleIcon />,
    roles: [USER_ROLES.SUPERADMIN],
  },
  {
    title: 'Eksperti',
    path: '/experts',
    icon: <PersonIcon />,
    roles: [USER_ROLES.SUPERADMIN],
  },
  {
    title: 'Forum Kategorije',
    path: '/forum-categories',
    icon: <CategoryIcon />,
    roles: [USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN],
  },
  {
    title: 'Specijalizacije',
    path: '/specializations',
    icon: <SchoolIcon />,
    roles: [USER_ROLES.SUPERADMIN],
  },
  {
    title: 'Prijavljeni Postovi',
    path: '/reported-posts',
    icon: <ReportIcon />,
    roles: [USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN],
  },
  {
    title: 'Prijavljeni Komentari',
    path: '/reported-comments',
    icon: <CommentIcon />,
    roles: [USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN],
  },
  {
    title: 'HelpDesk Termini',
    path: '/helpdesk-slots',
    icon: <CalendarIcon />,
    roles: [USER_ROLES.SUPERADMIN],
  },
  {
    title: 'Moji Termini',
    path: '/slots',
    icon: <EventIcon />,
    roles: [USER_ROLES.EXPERT],
  },
  {
    title: 'Online Radionice',
    path: '/meetings',
    icon: <VideoCallIcon />,
    roles: [USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN],
  },
];

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userData = AuthService.getUserData();

  // If no user data, redirect to login
  React.useEffect(() => {
    if (!userData || !userData.role) {
      console.warn('No user data found, redirecting to login');
      navigate('/login');
    }
  }, [userData, navigate]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.roles) return true;
    return AuthService.hasRole(item.roles);
  });

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Parentivo Admin
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {filteredMenuItems.find((item) => item.path === location.pathname)
              ?.title || 'Dobrodošli'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              {userData?.fullName} ({userData?.role})
            </Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Odjavi se
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
