import { Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./dashboards/dashboard";
import PageNotFound from "./components/pagenotfound";
import Notes from "./pages/Notes";
import Videos from "./pages/Videos";
import Assignments from "./pages/Assignments";
import Achievements from "./pages/Achievements";
import Downloads from "./pages/Downloads";
import Settings from "./pages/StudentsSettings";
import Timetable from "./pages/Timetable";
import Teacherdashboard from "./dashboards/teacherdashboard";
import Timetables from "./pages/Timetables";
import Uploads from "./pages/Uploads";
import UploadVideos from "./pages/lessons/UploadVideos";
import Upload from "./pages/lessons/upload";
import UploadNotes from "./pages/lessons/UploadNotes";
import UploadNote from "./pages/lessons/uploadnote";
import TeacherAssignments from "./pages/TeacherAssignments";
import EditVideo from "./pages/lessons/editvideo";
import EditNote from "./pages/lessons/editnote";
import StudentProfile from "./pages/StudentProfile";
import TeacherProfile from "./pages/TeacherProfile";
import TrSettingsPage from "./pages/TrSettingsPage";
import AdminOnboarding from "./pages/AdminOnboarding";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TeacherOnboarding from "./pages/TeacherOnboarding";
import Admindashboard from "./dashboards/admindashboard";
import ManageTeachers from "./pages/ManageTeachers";
import TrManageStudents from "./pages/TrManageStudents";
import ManageStudents from "./pages/ManageStudents";
import AdminNotifications from "./pages/AdminNotifications";
import AdminSettings from "./pages/AdminSettings";
import AdminProfile from "./pages/AdminProfile";


const App = () => {
  useEffect(() => {
    const unprotectedPaths = ["/", "/signup", "/login", "/unauthorized", "/not-found"];
    if (!unprotectedPaths.includes(window.location.pathname)) {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        window.location.pathname = "/unauthorized";
      }
    }
  }, []);

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />

        {/* Student routes */}
        <Route path="/studentdashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/notes" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Notes />
          </ProtectedRoute>
        } />
        <Route path="/videos" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Videos />
          </ProtectedRoute>
        } />
        <Route path="/assignments" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Assignments />
          </ProtectedRoute>
        } />
        <Route path="/achievements" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Achievements />
          </ProtectedRoute>
        } />
        <Route path="/downloads" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Downloads />
          </ProtectedRoute>
        } />
        <Route path="/timetable" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Timetable />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Settings />
          </ProtectedRoute>
        } />
        <Route path="/studentProfile" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentProfile />
          </ProtectedRoute>
        } />

        {/* Teacher routes */}
        <Route path='/teacherdashboard' element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <Teacherdashboard />
          </ProtectedRoute>
        } />
        <Route path='/teacheronboarding' element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherOnboarding />
          </ProtectedRoute>
        } />
        <Route path="/teacherdashboard/timetables" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <Timetables />
          </ProtectedRoute>
        } />
        <Route path="/teacherdashboard/students" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TrManageStudents />
          </ProtectedRoute>
        } />
        <Route path="/teacherdashboard/uploads" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <Uploads />
          </ProtectedRoute>
        } />
        <Route path='/teacherdashboard/lessons/uploadvideos' element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <UploadVideos />
          </ProtectedRoute>
        } />
        <Route path='/teacherdashboard/lessons/uploadvideos/upload' element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <Upload />
          </ProtectedRoute>
        } />
        <Route path='/teacherdashboard/lessons/uploadnotes' element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <UploadNotes />
          </ProtectedRoute>
        } />
        <Route path='/teacherdashboard/lessons/uploadnotes/upload' element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <UploadNote />
          </ProtectedRoute>
        } />
        <Route path="/teacherdashboard/assignments" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherAssignments />
          </ProtectedRoute>
        } />
        <Route path="/teacherdashboard/lessons/uploadvideos/edit/:id" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <EditVideo />
          </ProtectedRoute>
        } />
        <Route path="/teacherdashboard/lessons/uploadnotes/edit/:id" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <EditNote />
          </ProtectedRoute>
        } />
        <Route path="/teacherdashboard/teacherProfile" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherProfile />
          </ProtectedRoute>
        } />
        <Route path="/teacherdashboard/settings" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TrSettingsPage />
          </ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/adminonboarding" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminOnboarding />
          </ProtectedRoute>
        } />
        <Route path="/admindashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admindashboard/>
          </ProtectedRoute>
        }/>
        <Route path="/admin/teachers" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageTeachers/>
          </ProtectedRoute>
        }/>
        <Route path="/admin/students" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageStudents/>
          </ProtectedRoute>
        }/>
        <Route path="/admin/notifications" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminNotifications/>
          </ProtectedRoute>
        }/>
        <Route path="/admin/settings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminSettings/>
          </ProtectedRoute>
        }/>
        <Route path="/admin/profile" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminProfile/>
          </ProtectedRoute>
        }/>

        {/* 404 route */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <ToastContainer position="top-center" />
    </>
  );
};

export default App;
