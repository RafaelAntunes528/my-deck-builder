import '../../App/App.css';
import Home from '../../pages/Home';
import LoginPage from '../../pages/Login';
import SignUpPage from '../../pages/Signup';
import SearchPage from '../../pages/Search';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Tutorials from '../../pages/Tutorials';
import React, { useState, createContext } from 'react';
import Toast from '../Toast';

export const ToastContext = createContext();

function App() {
  const [toast, setToast] = useState(null);

  function showToast(message, type = 'info') {
    setToast({ message, type });
  }

  return (
    <ToastContext.Provider value={showToast}>
      <Router>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path='search/:name' element={<SearchPage />} />
          <Route path='/Tutorials' element={<Tutorials/>}/>
        </Routes>
        <div className="App">
        </div>
      </Router>
    </ToastContext.Provider>
  );
}

export default App;
