import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Layout from './Components/Layout/Layout';
import Dashboard from './Components/Dashbaord/Dashboard';
import ManagePrincipals from './Components/ManagePrincipals/ManagePrincipals';
import ManageStudents from './Components/ManageStudents/ManageStudents';
import ManageTeachers from './Components/ManageTeachers/ManageTeachers';
import Notifications from './Components/Notifications/Notifications';
import Registrations from './Components/Registrations/Registrations';
import PrincipalForm from './Components/Registrations/Registrations';
import TeacherForm from './Components/Registrations/Registrations';
import StudentForm from './Components/Registrations/Registrations';
import Reports from './Components/Reports/Reports';
import Settings from './Components/Settings/Settings';
import UploadLessonsPlans from './Components/UploadLessonsPlans/UploadLessonsPlans';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manageprincipals" element={<ManagePrincipals />} />
          <Route path="/managestudents" element={<ManageStudents />} />
          <Route path="/manageteachers" element={<ManageTeachers />} />
          <Route path="/notifications" element={<Notifications />} />
          
          {/* Registrations with Nested Routes */}
          <Route path="/registrations" element={<Registrations />}>
            <Route path="principal" element={<PrincipalForm />} />
            <Route path="teacher" element={<TeacherForm />} />
            <Route path="student" element={<StudentForm />} />
          </Route>

          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/uploadlessonsplans" element={<UploadLessonsPlans />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
