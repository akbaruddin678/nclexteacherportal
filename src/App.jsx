import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import SuperAdminLayout from './Layout/SuperAdminLayout'; // ← using the updated layout
import SuperAdminDashboard from './Components/SuperAdmin/Dashbaord/Dashboard';
import ManagePrincipals from './Components/SuperAdmin/ManagePrincipals/ManagePrincipals';
import ManageStudents from './Components/SuperAdmin/ManageStudents/ManageStudents';
import ManageTeachers from './Components/SuperAdmin/ManageTeachers/ManageTeachers';
import Notifications from './Components/SuperAdmin/Notifications/Notifications';
import Registrations from './Components/SuperAdmin/Registrations/Registrations';
import Reports from './Components/SuperAdmin/Reports/Reports';
import Settings from './Components/SuperAdmin/Settings/Settings';
import UploadLessonsPlans from './Components/SuperAdmin/UploadLessonsPlans/UploadLessonsPlans';


import CoordinatorLayout from './Layout/CoordinatorLayout'
import CoordinatorDashboard from './Components/Coordinator/dashboard/Dashbaord'


import TeacherLayout from './Layout/TeacherLayout'
import TeacherDashboard from './Components/Teacher/dashboard/Dashboard'


import Login from './components/Auth/Login'; 


function App() {
  return (
    <Router>
      <Routes>

      <Route path="/" element={<Login />} />

        {/* Nest all superadmin routes under this layout */}
        <Route path="/superadmin" element={<SuperAdminLayout />}>
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="manageprincipals" element={<ManagePrincipals />} />
          <Route path="managestudents" element={<ManageStudents />} />
          <Route path="manageteachers" element={<ManageTeachers />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="registrations" element={<Registrations />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="uploadlessonsplans" element={<UploadLessonsPlans />} />
        </Route>


        {/* Nest all coordinator routes under this layout */}
        <Route path="/coordinator" element={<CoordinatorLayout />}>
          <Route path="dashboard" element={<CoordinatorDashboard />} />
        </Route>


        {/* Nest all teacher routes under this layout */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route path="dashboard" element={<TeacherDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
