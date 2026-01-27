// Imports 
// ===========================================================================================================================================================

// Configuration
import { Routes, Route } from 'react-router-dom';
import { LoggedInRoute } from './AuthorizationRoutes/LoggedInRoute.tsx';
import { PublicRoute } from './AuthorizationRoutes/PublicRoute.tsx';
import Navigation from './components/Navigation.tsx';

// General
import HomePage from "./components/HomePage.tsx";
import LoginPage from "./components/LoginPage.tsx";
import Intro from "./components/Intro.tsx";
import Register from './components/Registration.tsx';
import UnknownHome from './components/UnknownHome.tsx';

// Users
import NewRequest from './components/User/NewRequest.tsx';
import MonitorRequests from './components/User/MonitorRequests.tsx';
import History from './components/User/History.tsx';

// Admin - Technician
import Registration_Requests from './components/Admin_Technician/Registration_Requests.tsx';
import Requests from './components/Admin_Technician/Requests.tsx';
import CategoriesManagement from './components/Admin_Technician/CategoriesManagement.tsx';
import UserManagement from './components/Admin_Technician/UserManagement.tsx';
import Announcements from './components/Admin_Technician/Announcements.tsx';


// Main Component 
// ===========================================================================================================================================================
export default function App() {
  return (
    <div>
      {/* Router ------------------------------------------------------------------------------------------------------*/}
      
        {/* Navigation Header*/}
        <Navigation />

        <Routes>
          <Route path='/login' element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }/>

          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }/>

          <Route path="/*" element={
            <PublicRoute>
              <Intro />
            </PublicRoute>
            
          }/>

          <Route path='/home' element={
            <LoggedInRoute allowedRoles={["USER", "ADMIN", "TECHNICIAN"]}>
              <HomePage />
            </LoggedInRoute>
          }/>

          <Route path="/unknownHome" element={
            <LoggedInRoute allowedRoles={["NOT_DETERMINED"]}>
              <UnknownHome />
            </LoggedInRoute>
          }/>

          <Route path="/new-request" element={
            <LoggedInRoute allowedRoles={["USER"]}>
              <NewRequest />
            </LoggedInRoute>
          }/>

          <Route path="/monitor" element={
            <LoggedInRoute allowedRoles={["USER"]}>
              <MonitorRequests />
            </LoggedInRoute>
          }/>

          <Route path="/history" element={
            <LoggedInRoute allowedRoles={["USER"]}>
              <History />
            </LoggedInRoute>
          }/>

          <Route path='/registration-requests' element={
            <LoggedInRoute allowedRoles={["ADMIN"]}>
              <Registration_Requests />
            </LoggedInRoute>
          }/>

          <Route path='/requests' element={
            <LoggedInRoute allowedRoles={["ADMIN", "TECHNICIAN"]}>
              <Requests />
            </LoggedInRoute>
          }/>

          <Route path="/categories" element={
            <LoggedInRoute allowedRoles={["ADMIN"]}>
              <CategoriesManagement />
            </LoggedInRoute>
          }/>

          <Route path="/users" element={
            <LoggedInRoute allowedRoles={["ADMIN"]}>
              <UserManagement />
            </LoggedInRoute>
          }/>

          <Route path="/announcements" element={
            <LoggedInRoute allowedRoles={["ADMIN"]}>
              <Announcements/>
            </LoggedInRoute>
          }/>
        </Routes>

      {/* Footer ----------------------------------------------------------------------------------------------------------*/}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-center">
            <p>&copy; 2026 MiHelper. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
