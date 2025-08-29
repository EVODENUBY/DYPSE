import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { HomePage } from './pages/HomePage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { ProblemStatementPage } from './pages/ProblemsPage';
import { SolutionPage } from './pages/SolutionsPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/youth/DashboardPage';
import NotificationsPage from './pages/youth/NotificationsPage';
import ProfilePage from './pages/youth/ProfilePage';
import SettingsPage from './pages/youth/settings/SettingsPage';
import ChangePassword from './pages/youth/settings/ChangePassword';
import EmailPreferences from './pages/youth/settings/EmailPreferences';
import JobsPage from './pages/youth/JobsPage';
import ApplicationsPage from './pages/youth/ApplicationsPage';
import TrainingPage from './pages/youth/TrainingPage';
import OpportunitiesPage from './pages/youth/OpportunitiesPage';
import GroupsPage from './pages/youth/GroupsPage';
import EmployerDashboardPage from './pages/employer/DashboardPage';
import EmployerProfiles from './pages/employer/EmployerProfiles';
import AdminDashboard from './pages/admin/DashboardPage';
import YouthProfilesPage from './pages/admin/YouthProfilesPage';
import SearchAndMatchPage from './pages/admin/SearchAndMatchPage';
import LocationMapPage from './pages/admin/LocationMapPage';
import EmployerLocationMapPage from './pages/employer/LocationMapPage';
import EmployersPage from './pages/admin/EmployersPage';
import YouthLayout from './components/youth/YouthLayout';
import EmployerLayout from './components/employer/EmployerLayout';
import AdminLayout from './components/admin/AdminLayout';
import AnalyticsPage from './pages/employer/AnalyticsPage';
import AdminAnalyticsPage from './pages/admin/AnalyticsPage';
import AdminNotificationsPage from './pages/admin/NotificationsPage';
import TrainingCentersPage from './pages/admin/TrainingCentersPage';
import EmployerNotificationsPage from './pages/employer/NotificationsPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1f2937',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderRadius: '0.5rem',
            padding: '1rem',
            fontSize: '0.875rem',
            maxWidth: '100%',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <Router>
        <AuthProvider>
          <NotificationProvider>
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/ProblemsPage" element={<ProblemStatementPage />} />
          <Route path="/SolutionsPage" element={<SolutionPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Youth Routes */}
          <Route path="/youth" element={
            <ProtectedRoute roles={['youth']}>
              <YouthLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />}>
              <Route index element={<Navigate to="change-password" replace />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="email-preferences" element={<EmailPreferences />} />
            </Route>
            <Route path="jobs" element={<JobsPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="trainings" element={<TrainingPage />} />
            <Route path="opportunities" element={<OpportunitiesPage />} />
            <Route path="groups" element={<GroupsPage />} />
            {/* Add other youth routes here */}
          </Route>
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="search-match" element={<SearchAndMatchPage />} />
            <Route path="notifications" element={<AdminNotificationsPage />} />
            <Route path="training-centers" element={<TrainingCentersPage />} />
            <Route path="*" index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="youth-profiles" element={<YouthProfilesPage/>} />
            <Route path="employers" element={<EmployersPage/>} />
            <Route path="analytics" element={<AdminAnalyticsPage/>}/>
            <Route path="location-map" element={<LocationMapPage/>}/>
            {/* Add other admin routes here */}
          </Route>
          
          {/* Employer Routes */}
          <Route 
            path="/employer" 
            element={
              <ProtectedRoute roles={['employer']}>
                <EmployerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EmployerDashboardPage />} />
            <Route path="profile" element={<EmployerProfiles />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="location-map" element={<EmployerLocationMapPage/>}/>
            <Route path="notifications" element={<EmployerNotificationsPage/>}/>
          </Route>       
          

          {/* Redirect root to appropriate dashboard based on role */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                {({ user }) => {
                  if (user.role === 'admin') return <Navigate to="/admin" replace />;
                  if (user.role === 'employer') return <Navigate to="/employer/dashboard" replace />;
                  return <Navigate to="/youth/dashboard" replace />;
                }}
              </ProtectedRoute>
            } 
          />
          
          {/* 404 - Not Found */}
          <Route 
            path="*" 
            element={
              <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800">404</h1>
                  <p className="text-gray-600 mt-2">Page not found</p>
                  <Link 
                    to="/" 
                    className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    Go back home
                  </Link>
                </div>
              </div>
            }
          />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  </>);
}

export default App
