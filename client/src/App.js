import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import { Logout } from './components/Logout';
import { useAuth } from './store/auth';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Signup from './components/SignUp';
import Footer from './components/Footer';
import Contacts from './pages/Contacts';
import CreateContact from './pages/CreateContact';
const App = () => {
  const { isLoggedIn } = useAuth();
  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     window.location.replace('/login');
  //   }
  // }, []);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {isLoggedIn ? (
          <>
            <Route path="/logout" element={<Logout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contacts />} />
            <Route path="/add" element={<CreateContact />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </>
        )}
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
