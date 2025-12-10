import { useEffect, useState } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Splash from '@/pages/Splash';
import Auth from '@/pages/Auth';
import Home from '@/pages/Home';
import AddTask from '@/pages/AddTask';
import TaskDetails from '@/pages/TaskDetails';
import HelperMarketplace from '@/pages/HelperMarketplace';
import Wallet from '@/pages/Wallet';
import Automations from '@/pages/Automations';
import Notifications from '@/pages/Notifications';
import Settings from '@/pages/Settings';
import Disputes from '@/pages/Disputes';
import KYC from '@/pages/KYC';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import ProfileSettings from '@/pages/ProfileSettings';
import SecuritySettings from '@/pages/SecuritySettings';
import EmailPreferences from '@/pages/EmailPreferences';
import Insights from '@/pages/Insights';
import HelpSupport from '@/pages/HelpSupport';
import AboutDoerly from '@/pages/AboutDoerly';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('doerly_token');
    if (token) {
      setIsAuthenticated(true);
    }
    setTimeout(() => setShowSplash(false), 2500);
  }, []);

  if (showSplash) {
    return <Splash />;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/auth"
            element={<Auth setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/"
            element={
              isAuthenticated ? <Home /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/add-task"
            element={
              isAuthenticated ? <AddTask /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/task/:taskId"
            element={
              isAuthenticated ? <TaskDetails /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/helpers"
            element={
              isAuthenticated ? (
                <HelperMarketplace />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
          <Route
            path="/wallet"
            element={
              isAuthenticated ? <Wallet /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/automations"
            element={
              isAuthenticated ? <Automations /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/notifications"
            element={
              isAuthenticated ? (
                <Notifications />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
          <Route
            path="/settings"
            element={
              isAuthenticated ? <Settings /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/disputes"
            element={
              isAuthenticated ? <Disputes /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/kyc"
            element={
              isAuthenticated ? <KYC /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/privacy-policy"
            element={
              isAuthenticated ? <PrivacyPolicy /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/terms-of-service"
            element={
              isAuthenticated ? <TermsOfService /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/profile-settings"
            element={
              isAuthenticated ? <ProfileSettings /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/security-settings"
            element={
              isAuthenticated ? <SecuritySettings /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/email-preferences"
            element={
              isAuthenticated ? <EmailPreferences /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/insights"
            element={
              isAuthenticated ? <Insights /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/help-support"
            element={
              isAuthenticated ? <HelpSupport /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/about"
            element={
              isAuthenticated ? <AboutDoerly /> : <Navigate to="/auth" replace />
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
