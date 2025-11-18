import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { SignUpPage } from './pages/SignUpPage';
import { SignInPage } from './pages/SignInPage';
import { AppPage } from './pages/AppPage';
import { NewEntryPage } from './pages/NewEntryPage';
import { TimelinePage } from './pages/TimelinePage';

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
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
