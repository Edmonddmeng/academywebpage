import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import PortalLayout from './components/PortalLayout'
import Home from './pages/Home'
import Contact from './pages/Contact'
import PlaceholderPage from './pages/PlaceholderPage'
import ContentPage from './pages/ContentPage'
import Login from './pages/Login'
import PortalShell from './portal/PortalShell'
import MyStudents from './portal/MyStudents'
import StudentForm from './portal/StudentForm'
import Application from './portal/Application'
import Checklist from './portal/Checklist'
import Recommend from './portal/Recommend'
import RequireStaff from './staff/RequireStaff'
import StaffApplications from './staff/StaffApplications'
import StaffApplication from './staff/StaffApplication'
import StaffInterviews from './staff/StaffInterviews'
import { AuthProvider } from './auth/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PortalLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/recommend/:token" element={<Recommend />} />
        </Route>
        <Route element={<PortalShell />}>
          <Route path="/portal" element={<MyStudents />} />
          <Route path="/portal/students/new" element={<StudentForm mode="new" />} />
          <Route path="/portal/students/new-year" element={<StudentForm mode="renew" />} />
          <Route path="/portal/applications/:id" element={<Application />} />
          <Route path="/portal/applications/:id/checklist" element={<Checklist />} />
          <Route element={<RequireStaff />}>
            <Route path="/staff" element={<StaffApplications />} />
            <Route path="/staff/applications/:id" element={<StaffApplication />} />
            <Route path="/staff/interviews" element={<StaffInterviews />} />
          </Route>
        </Route>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/:section" element={<PlaceholderPage />} />
          <Route path="/:section/:page" element={<ContentPage />} />
          <Route path="*" element={<PlaceholderPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
