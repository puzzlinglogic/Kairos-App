import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { SignUpPage } from './pages/SignUpPage';
import { SignInPage } from './pages/SignInPage';
import { AppPage } from './pages/AppPage';
import { NewEntryPage } from './pages/NewEntryPage';
import { TimelinePage } from './pages/TimelinePage';
import { PatternsPage } from './pages/PatternsPage';
import SubscribePage from './pages/SubscribePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/app" element={<AppPage />} />
          <Route path="/app/timeline" element={<TimelinePage />} />
          <Route path="/app/new" element={<NewEntryPage />} />
          <Route path="/app/patterns" element={<PatternsPage />} />
          <Route path="/app/subscribe" element={<SubscribePage />} />
          <Route path="/app/settings" element={<SettingsPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
