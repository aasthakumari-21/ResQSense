import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Activity, Map, Navigation, Users, AlertTriangle, Settings, Menu, X, ShieldAlert } from 'lucide-react';

// Pages
import WelcomePage from './pages/WelcomePage';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SilentZones from './pages/SilentZones';
import ResourceAllocation from './pages/ResourceAllocation';
import Volunteers from './pages/Volunteers';
import IncidentReport from './pages/IncidentReport';

// Navbar component definition inside App for simplicity, but best practice is separate
const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  // Hide Navbar completely on Welcome screen and Landing page
  if (location.pathname === '/' || location.pathname === '/landing') return null;

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <Activity className="w-5 h-5" /> },
    { name: 'Silent Zones', path: '/silent-zones', icon: <Map className="w-5 h-5" /> },
    { name: 'Resources', path: '/resources', icon: <Navigation className="w-5 h-5" /> },
    { name: 'Volunteers', path: '/volunteers', icon: <Users className="w-5 h-5" /> },
    { name: 'Report', path: '/report', icon: <AlertTriangle className="w-5 h-5" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-x-0 border-t-0 rounded-none bg-surface/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-primary w-8 h-8" />
            <span className="font-bold text-xl text-text tracking-wide">
              ResQ<span className="text-primary">Sense</span>
            </span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path 
                      ? 'bg-primary/20 text-primary border border-primary/30' 
                      : 'text-textMuted hover:bg-surfaceLight hover:text-text'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-textMuted hover:text-text inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden glass-panel border-x-0 border-b-0 rounded-none absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-textMuted hover:bg-surfaceLight hover:text-text'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background text-text">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/silent-zones" element={<SilentZones />} />
            <Route path="/resources" element={<ResourceAllocation />} />
            <Route path="/volunteers" element={<Volunteers />} />
            <Route path="/report" element={<IncidentReport />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
