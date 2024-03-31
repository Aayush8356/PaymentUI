import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { FaEmpire } from 'react-icons/fa';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState({});
  const [isLoggedIn, setLoggedIn] = useState(false);
  const URL = 'http://localhost:5000';

  const storeTokenInLS = serverToken => {
    setToken(serverToken);
    localStorage.setItem('token', serverToken);
  };
  // let isLoggedIn = !!token;

  const LogoutUser = () => {
    setToken('');
    localStorage.removeItem('token');
    setUser({});
    setLoggedIn(false);
  };
  const userAuthentication = async () => {
    try {
      const response = await fetch(`${URL}/user/current`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('response', data);
        setUser(data);
      }
    } catch (error) {
      console.error(error, 'Authentication failed');
    }
  };
  const checkTokenValidity = token => {
    if (!token) {
      return false;
    }

    const decodedToken = jwtDecode(token);

    if (!decodedToken.exp) {
      return false;
    }

    const currentTime = Date.now() / 1000;

    return decodedToken.exp > currentTime;
  };
  useEffect(() => {
    if (token) {
      let isTokenValid = checkTokenValidity(token);
      if (isTokenValid) {
        setLoggedIn(true);
        userAuthentication();
      } else {
        localStorage.removeItem('token');
      }
    }
  }, [token]);
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        storeTokenInLS,
        user,
        LogoutUser,
        userAuthentication,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error('useAuth used outside of the Provider');
  }
  return authContextValue;
};
