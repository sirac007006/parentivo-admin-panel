import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import theme from './theme';
import Login from './pages/Login';
import LayoutNew from './components/LayoutNew';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardNew from './pages/DashboardNew';
import Users from './pages/Users';
import Experts from './pages/Experts';
import ForumCategories from './pages/ForumCategories';
import Specializations from './pages/Specializations';
import ReportedPosts from './pages/ReportedPosts';
import ReportedComments from './pages/ReportedComments';
import RejectedPosts from './pages/RejectedPosts';
import RejectedComments from './pages/RejectedComments';
import HelpDeskSlots from './pages/HelpDeskSlots';
import Slots from './pages/Slots';
import Meetings from './pages/Meetings';
import { USER_ROLES } from './config';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <LayoutNew />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardNew />} />
            
            {/* Users - SUPERADMIN only */}
            <Route
              path="users"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.SUPERADMIN]}>
                  <Users />
                </ProtectedRoute>
              }
            />
            
            {/* Experts - SUPERADMIN only */}
            <Route
              path="experts"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.SUPERADMIN]}>
                  <Experts />
                </ProtectedRoute>
              }
            />
            
            {/* Forum Categories - SUPERADMIN, ADMIN */}
            <Route
              path="forum-categories"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN]}>
                  <ForumCategories />
                </ProtectedRoute>
              }
            />
            
            {/* Specializations - SUPERADMIN only */}
            <Route
              path="specializations"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.SUPERADMIN]}>
                  <Specializations />
                </ProtectedRoute>
              }
            />
            
            {/* Reported Posts - SUPERADMIN, ADMIN */}
            <Route
              path="reported-posts"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN]}>
                  <ReportedPosts />
                </ProtectedRoute>
              }
            />
            
            {/* Reported Comments - SUPERADMIN, ADMIN */}
            <Route
              path="reported-comments"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN]}>
                  <ReportedComments />
                </ProtectedRoute>
              }
            />
            
            {/* Rejected Posts - SUPERADMIN, ADMIN */}
            <Route
              path="rejected-posts"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN]}>
                  <RejectedPosts />
                </ProtectedRoute>
              }
            />
            
            {/* Rejected Comments - SUPERADMIN, ADMIN */}
            <Route
              path="rejected-comments"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN]}>
                  <RejectedComments />
                </ProtectedRoute>
              }
            />
            
            {/* HelpDesk Slots - SUPERADMIN only */}
            <Route
              path="helpdesk-slots"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.SUPERADMIN]}>
                  <HelpDeskSlots />
                </ProtectedRoute>
              }
            />
            
            {/* Slots - EXPERT only */}
            <Route
              path="slots"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.EXPERT]}>
                  <Slots />
                </ProtectedRoute>
              }
            />
            
            {/* Meetings - SUPERADMIN, ADMIN */}
            <Route
              path="meetings"
              element={
                <ProtectedRoute requiredRoles={[USER_ROLES.SUPERADMIN, USER_ROLES.ADMIN]}>
                  <Meetings />
                </ProtectedRoute>
              }
            />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ThemeProvider>
  );
}

export default App;
