import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { NotesProvider } from './context/NotesContext';
import NotesListScreen from './screens/NotesListScreen';
import NoteDetailScreen from './screens/NoteDetailScreen';
import TagsScreen from './screens/TagsScreen';
import TasksScreen from './screens/TasksScreen';
import PandaSplash from './components/PandaSplash';
import { initOneSignal } from './lib/notifications';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  // OneSignal'ı başlat
  useEffect(() => {
    // Splash bittikten sonra bildirim izni iste
    if (!showSplash) {
      const timer = setTimeout(() => {
        initOneSignal();
      }, 2000); // 2 saniye bekle sonra sor
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <PandaSplash onComplete={handleSplashComplete} />;
  }

  return (
    <NotesProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<NotesListScreen />} />
            <Route path="/note/:id?" element={<NoteDetailScreen />} />
            <Route path="/tags" element={<TagsScreen />} />
            <Route path="/tasks" element={<TasksScreen />} />
          </Routes>
          <BottomNavigation />
        </div>
      </Router>
    </NotesProvider>
  );
}

function BottomNavigation() {
  const location = useLocation();
  
  return (
    <nav className="bottom-nav">
      <Link 
        to="/" 
        className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
      >
        <span className="nav-icon">📝</span>
        <span className="nav-label">Notlar</span>
      </Link>
      <Link 
        to="/tasks" 
        className={`nav-item ${location.pathname === '/tasks' ? 'active' : ''}`}
      >
        <span className="nav-icon">✅</span>
        <span className="nav-label">Görevler</span>
      </Link>
      <Link 
        to="/tags" 
        className={`nav-item ${location.pathname === '/tags' ? 'active' : ''}`}
      >
        <span className="nav-icon">🎋</span>
        <span className="nav-label">Etiketler</span>
      </Link>
    </nav>
  );
}

export default App;

